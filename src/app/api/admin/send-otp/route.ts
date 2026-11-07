import { randomInt, createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminLoginChallengeCookie, getAdminOtpChallengeId } from "@/lib/admin-auth";
import { maskEmail, sendAdminOtpEmail } from "@/lib/admin-email";
import { prisma } from "@/lib/prisma";

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

function hashCode(challengeId: string, code: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL;
  if (!secret) throw new Error("Admin session secret is not configured.");
  return createHmac("sha256", secret).update(`${challengeId}:${code}`).digest("hex");
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const challengeId = getAdminOtpChallengeId(cookieStore.get(adminLoginChallengeCookie)?.value);
  if (!challengeId) {
    return NextResponse.json({ error: "Your sign-in step expired. Enter your username and password again." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const enteredEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!enteredEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enteredEmail)) {
    return NextResponse.json({ error: "Enter a valid admin email address." }, { status: 400 });
  }

  const now = new Date();
  await prisma.adminOtpChallenge.deleteMany({ where: { expiresAt: { lte: now } } });
  const existing = await prisma.adminOtpChallenge.findUnique({ where: { id: challengeId } });
  if (existing && existing.resendAfter > now) {
    const retryAfter = Math.ceil((existing.resendAfter.getTime() - now.getTime()) / 1000);
    return NextResponse.json({ error: `Please wait ${retryAfter} seconds before requesting another code.`, retryAfter }, { status: 429 });
  }

  const code = String(randomInt(100000, 1000000));
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);
  const resendAfter = new Date(now.getTime() + RESEND_COOLDOWN_MS);
  if (existing) {
    const reserved = await prisma.adminOtpChallenge.updateMany({
      where: { id: challengeId, resendAfter: { lte: now } },
      data: { codeHash: hashCode(challengeId, code), expiresAt, resendAfter, attempts: 0 },
    });
    if (!reserved.count) {
      const latest = await prisma.adminOtpChallenge.findUnique({ where: { id: challengeId } });
      const retryAfter = latest ? Math.max(1, Math.ceil((latest.resendAfter.getTime() - Date.now()) / 1000)) : 1;
      return NextResponse.json({ error: `Please wait ${retryAfter} seconds before requesting another code.`, retryAfter }, { status: 429 });
    }
  } else {
    try {
      await prisma.adminOtpChallenge.create({ data: { id: challengeId, codeHash: hashCode(challengeId, code), expiresAt, resendAfter, attempts: 0 } });
    } catch {
      return NextResponse.json({ error: "A verification code was just requested. Please wait before trying again." }, { status: 429 });
    }
  }

  try {
    await sendAdminOtpEmail(code, enteredEmail);
  } catch (error) {
    console.error("Admin OTP email delivery failed", error);
    await prisma.adminOtpChallenge.deleteMany({ where: { id: challengeId } });
    const smtpError = error as { code?: string; responseCode?: number; command?: string };
    const message = smtpError.responseCode === 535 || smtpError.code === "EAUTH"
      ? "Gmail rejected the SMTP login. Set GMAIL_USER to the matching Gmail address and GMAIL_APP_PASSWORD to a current 16-character Google App Password, then restart the server."
      : smtpError.code === "ETIMEDOUT" || smtpError.code === "ECONNECTION"
        ? "Could not connect to Gmail SMTP. Check your internet connection or firewall and try again."
        : "We could not send the verification email. Check the Gmail SMTP settings and server logs, then try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ otpRequired: true, emailHint: maskEmail(enteredEmail), resendAfter: resendAfter.toISOString() });
}
