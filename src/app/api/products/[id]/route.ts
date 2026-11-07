import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/services/product.service";
import { productUpdateSchema } from "@/validations/product.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error", error);
    return NextResponse.json(
      { error: "Failed to load product." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = productUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await updateProduct(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/products/[id] error", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
