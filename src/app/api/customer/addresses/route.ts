import { NextResponse } from "next/server";
import { getCurrentCustomerId } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customerId = await getCurrentCustomerId();
  if (!customerId) return NextResponse.json({ error: "Please sign in to manage saved addresses." }, { status: 401 });
  const addresses = await prisma.customerAddress.findMany({ where: { customerId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ addresses });
}

export async function POST(request: Request) {
  const customerId = await getCurrentCustomerId();
  if (!customerId) return NextResponse.json({ error: "Please sign in to manage saved addresses." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const label = typeof body?.label === "string" && body.label.trim() ? body.label.trim().slice(0, 40) : "Home";
  const recipient = typeof body?.recipient === "string" ? body.recipient.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const address = typeof body?.address === "string" ? body.address.trim() : "";
  const city = typeof body?.city === "string" ? body.city.trim() : "";
  const postalCode = typeof body?.postalCode === "string" ? body.postalCode.trim() || null : null;
  if (!recipient || !phone || !address || !city) return NextResponse.json({ error: "Name, phone, address, and city are required." }, { status: 400 });
  const saved = await prisma.customerAddress.create({ data: { customerId, label, recipient, phone, address, city, postalCode } });
  return NextResponse.json({ address: saved }, { status: 201 });
}

export async function DELETE(request: Request) {
  const customerId = await getCurrentCustomerId();
  if (!customerId) return NextResponse.json({ error: "Please sign in to manage saved addresses." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Address id is required." }, { status: 400 });
  const result = await prisma.customerAddress.deleteMany({ where: { id, customerId } });
  if (!result.count) return NextResponse.json({ error: "Address not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}
