import { NextResponse } from "next/server";
import { customerCookie, customerCookieOptions } from "@/lib/customer-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(customerCookie, "", { ...customerCookieOptions, maxAge: 0 });
  return response;
}
