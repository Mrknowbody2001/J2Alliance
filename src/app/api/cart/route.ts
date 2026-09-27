import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Cart is managed on the client using Zustand.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: "Cart received successfully.",
      cart: body,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid cart data.",
      },
      { status: 400 }
    );
  }
}