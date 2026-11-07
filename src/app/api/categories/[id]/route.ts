import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/services/category.service";
import { categoryUpdateSchema } from "@/validations/category.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const category = await getCategoryById(id);
    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error("GET /api/categories/[id] error", error);
    return NextResponse.json(
      { error: "Failed to load category." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const existing = await getCategoryById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = categoryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await updateCategory(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/categories/[id] error", error);
    return NextResponse.json(
      { error: "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const existing = await getCategoryById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error", error);
    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 }
    );
  }
}
