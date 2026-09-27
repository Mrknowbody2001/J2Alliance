import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: [],
    message: "Order API is ready.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus,
    } = body;

    // Basic validation
    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer information is required.",
        },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order must contain at least one item.",
        },
        { status: 400 }
      );
    }

    if (subtotal === undefined || total === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Order total information is required.",
        },
        { status: 400 }
      );
    }

    /*
     * TEST ORDER
     *
     * We are not saving to PostgreSQL yet.
     *
     * After the Order and OrderItem Prisma models are created,
     * this section will create the actual database order.
     */

    const orderNumber = `J2-${Date.now()}`;

    const testOrder = {
      orderNumber,

      customer,

      items,

      subtotal,
      deliveryFee: deliveryFee ?? 0,
      total,

      paymentMethod: paymentMethod ?? "TEST",
      paymentStatus: paymentStatus ?? "PAID",
      orderStatus: orderStatus ?? "PENDING",

      createdAt: new Date().toISOString(),
    };

    console.log("=================================");
    console.log("J2 TEST ORDER");
    console.log("=================================");
    console.log(testOrder);
    console.log("=================================");

    return NextResponse.json(
      {
        success: true,
        message: "Test order created successfully.",
        order: testOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order.",
      },
      { status: 500 }
    );
  }
}