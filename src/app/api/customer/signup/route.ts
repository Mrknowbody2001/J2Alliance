import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCustomerSession, customerCookie, customerCookieOptions, hashCustomerPassword } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!firstName || !lastName || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return NextResponse.json({ error: "Enter your name, a valid email, and a password with at least 8 characters." }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.create({
      data: { firstName, lastName, email, passwordHash: hashCustomerPassword(password) },
      select: { id: true },
    });
    const response = NextResponse.json({ success: true });
    response.cookies.set(customerCookie, createCustomerSession(customer.id), customerCookieOptions);
    return response;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
    }
    console.error("Customer sign up failed:", error);
    return NextResponse.json({ error: "We couldn't create your account. Please try again." }, { status: 500 });
  }
}
