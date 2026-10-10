import { NextResponse } from "next/server";
import { getCurrentCustomerId } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customerId = await getCurrentCustomerId();
  if (!customerId) return NextResponse.json({ error: "Please sign in to view your orders." }, { status: 401 });
  const orders = await prisma.order.findMany({ where: { customerId }, include: { items: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customerInfo = body?.customer;
    const rawItems = body?.items;
    if (!customerInfo || !Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 50) {
      return NextResponse.json({ success: false, message: "Customer information and at least one item are required." }, { status: 400 });
    }
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "country"];
    if (required.some((key) => typeof customerInfo[key] !== "string" || !customerInfo[key].trim())) {
      return NextResponse.json({ success: false, message: "Complete all required delivery details." }, { status: 400 });
    }
    const quantities = new Map<string, number>();
    for (const item of rawItems) {
      if (typeof item?.productId !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json({ success: false, message: "One or more cart items are invalid." }, { status: 400 });
      }
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    }
    const products = await prisma.product.findMany({ where: { id: { in: [...quantities.keys()] } }, select: { id: true, title: true, price: true } });
    if (products.length !== quantities.size) return NextResponse.json({ success: false, message: "A product in your cart is no longer available." }, { status: 400 });
    const items = products.map((product) => ({ productId: product.id, productTitle: product.title, price: product.price, quantity: quantities.get(product.id)!, total: product.price * quantities.get(product.id)! }));
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const deliveryFee = 0;
    const customerId = await getCurrentCustomerId();
    const signedIn = customerId ? await prisma.customer.findUnique({ where: { id: customerId }, select: { id: true } }) : null;
    const orderNumber = `J2-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order = await prisma.order.create({
      data: {
        orderNumber, customerId: signedIn?.id,
        customerFirstName: customerInfo.firstName.trim(), customerLastName: customerInfo.lastName.trim(),
        customerEmail: customerInfo.email.trim().toLowerCase(), customerPhone: customerInfo.phone.trim(),
        customerAddress: customerInfo.address.trim(), customerCity: customerInfo.city.trim(),
        customerCountry: customerInfo.country.trim(),
        customerPostalCode: typeof customerInfo.postalCode === "string" ? customerInfo.postalCode.trim() || null : null,
        subtotal, deliveryFee, total: subtotal + deliveryFee,
        paymentMethod: "TEST", paymentStatus: "PENDING", orderStatus: "PENDING",
        items: { create: items },
      }, include: { items: true },
    });
    return NextResponse.json({ success: true, message: "Order created successfully.", order }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, message: "Failed to create order." }, { status: 500 });
  }
}
