import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { listProducts, createProduct } from "@/services/product.service";
import { productCreateSchema } from "@/validations/product.schema";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error", error);
    return NextResponse.json(
      { error: "Failed to load products." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const parsed = productCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const product = await createProduct(parsed.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 },
    );
  }
}
