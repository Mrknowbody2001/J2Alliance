import { NextResponse } from "next/server";
import { adminCookie, adminCookieOptions, createAdminSession, getAdminProfile, verifyPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.username !== "string" || typeof body?.password !== "string") return NextResponse.json({ error: "Enter your username and password." }, { status: 400 });
  const profile = await getAdminProfile();
  if (body.username !== profile.username || !verifyPassword(body.password, profile.passwordHash)) return NextResponse.json({ error: "The username or password is incorrect." }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie, createAdminSession(), adminCookieOptions);
  return response;
}
