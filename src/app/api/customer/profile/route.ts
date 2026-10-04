import { NextResponse } from "next/server";
import { getCurrentCustomerId } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

async function authenticatedCustomer() {
  const id = await getCurrentCustomerId();
  if (!id) return null;
  return prisma.customer.findUnique({ where: { id }, select: { id: true, email: true, firstName: true, lastName: true, phone: true, address: true, city: true, postalCode: true } });
}

export async function GET() {
  const customer = await authenticatedCustomer();
  if (!customer) return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  return NextResponse.json({ customer });
}

export async function PATCH(request: Request) {
  const customer = await authenticatedCustomer();
  if (!customer) return NextResponse.json({ error: "Please sign in to continue." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body?.lastName === "string" ? body.lastName.trim() : "";
  if (!firstName || !lastName) return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  const optional = (value: unknown) => typeof value === "string" && value.trim() ? value.trim() : null;
  const updated = await prisma.customer.update({
    where: { id: customer.id },
    data: { firstName, lastName, phone: optional(body.phone), address: optional(body.address), city: optional(body.city), postalCode: optional(body.postalCode) },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, address: true, city: true, postalCode: true },
  });
  return NextResponse.json({ customer: updated });
}
