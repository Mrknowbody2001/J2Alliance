import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCustomerSession, customerCookie, customerCookieOptions, verifyCustomerPassword } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });

  try {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer || !verifyCustomerPassword(password, customer.passwordHash)) {
      return NextResponse.json({ error: "The email or password is incorrect." }, { status: 401 });
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set(customerCookie, createCustomerSession(customer.id), customerCookieOptions);
    return response;
  } catch (error) {
    console.error("Customer sign in failed:", error);
    return NextResponse.json({ error: "We couldn't sign you in. Please try again." }, { status: 500 });
  }
}
