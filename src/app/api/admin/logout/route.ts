import { NextResponse } from "next/server";
import { adminCookie, adminCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(adminCookie, "", { ...adminCookieOptions, maxAge: 0 });
  return response;
}
