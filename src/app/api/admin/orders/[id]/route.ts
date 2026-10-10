import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export async function PATCH(request: Request, context: RouteContext<"/api/admin/orders/[id]">) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || (body.orderStatus === undefined && body.paymentStatus === undefined)) {
    return NextResponse.json({ error: "Choose an order or payment status to update." }, { status: 400 });
  }
  if (body.orderStatus !== undefined && !ORDER_STATUSES.includes(body.orderStatus)) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }
  if (body.paymentStatus !== undefined && !PAYMENT_STATUSES.includes(body.paymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
  }
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(body.orderStatus ? { orderStatus: body.orderStatus } : {}),
        ...(body.paymentStatus ? { paymentStatus: body.paymentStatus } : {}),
      },
      include: { items: true },
    });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
}
