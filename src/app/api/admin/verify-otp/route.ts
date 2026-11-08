import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookie,
  adminCookieOptions,
  adminLoginChallengeCookie,
  adminLoginChallengeCookieOptions,
  createAdminSession,
  getAdminOtpChallengeId,
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function hashCode(challengeId: string, code: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
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
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!/^\d{6}$/.test(code)) return NextResponse.json({ error: "Enter the 6-digit verification code." }, { status: 400 });

  const challenge = await prisma.adminOtpChallenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.expiresAt <= new Date()) {
    if (challenge) await prisma.adminOtpChallenge.deleteMany({ where: { id: challengeId } });
    return NextResponse.json({ error: "That code has expired. Request a new verification code." }, { status: 401 });
  }
  const attempt = await prisma.adminOtpChallenge.updateMany({
    where: { id: challengeId, expiresAt: { gt: new Date() }, attempts: { lt: 5 } },
    data: { attempts: { increment: 1 } },
  });
  if (!attempt.count) {
    return NextResponse.json({ error: "Too many incorrect attempts. Request a new verification code." }, { status: 429 });
  }
  const currentChallenge = await prisma.adminOtpChallenge.findUnique({ where: { id: challengeId } });
  if (!currentChallenge || currentChallenge.expiresAt <= new Date()) {
    return NextResponse.json({ error: "That code has expired. Request a new verification code." }, { status: 401 });
  }
  const actual = Buffer.from(hashCode(challengeId, code), "hex");
  const expected = Buffer.from(currentChallenge.codeHash, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    const attemptsRemaining = Math.max(0, 5 - currentChallenge.attempts);
    return NextResponse.json({ error: attemptsRemaining ? `That code is incorrect. ${attemptsRemaining} attempts remaining.` : "That code is incorrect. Request a new verification code." }, { status: 401 });
  }

  const consumed = await prisma.adminOtpChallenge.deleteMany({ where: { id: challengeId, codeHash: currentChallenge.codeHash } });
  if (!consumed.count) return NextResponse.json({ error: "That verification code has already been used. Request a new code." }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie, createAdminSession(), adminCookieOptions);
  response.cookies.set(adminLoginChallengeCookie, "", { ...adminLoginChallengeCookieOptions, maxAge: 0 });
  return response;
}
