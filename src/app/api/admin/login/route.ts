import { NextResponse } from "next/server";
import {
  adminLoginChallengeCookie,
  adminLoginChallengeCookieOptions,
  createAdminLoginChallenge,
  getAdminProfile,
  verifyPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (typeof body?.username !== "string" || typeof body?.password !== "string") {
      return NextResponse.json({ error: "Enter your username and password." }, { status: 400 });
    }

    const profile = await getAdminProfile();
    if (body.username !== profile.username || !verifyPassword(body.password, profile.passwordHash)) {
      return NextResponse.json({ error: "Incorrect username or password. Please try again." }, { status: 401 });
    }

    const response = NextResponse.json({ emailOtpRequired: true });
    response.cookies.set(adminLoginChallengeCookie, createAdminLoginChallenge(), adminLoginChallengeCookieOptions);
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("ADMIN_USERNAME") || message.includes("legacy default admin password")) {
      return NextResponse.json({ error: "Admin login needs to be configured. Contact your site administrator." }, { status: 503 });
    }
    return NextResponse.json({ error: "Admin sign-in is temporarily unavailable. Please try again shortly." }, { status: 500 });
  }
}
