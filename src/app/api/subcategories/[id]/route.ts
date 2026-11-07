import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import {
  deleteSubCategory,
  getSubCategoryById,
  updateSubCategory,
} from "@/services/subcategory.service";
import { subCategoryUpdateSchema } from "@/validations/subcategory.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const subcategory = await getSubCategoryById(id);
    if (!subcategory) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("GET /api/subcategories/[id] error", error);
    return NextResponse.json(
      { error: "Failed to load sub category." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const existing = await getSubCategoryById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = subCategoryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await updateSubCategory(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/subcategories/[id] error", error);
    return NextResponse.json(
      { error: "Failed to update sub category." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const existing = await getSubCategoryById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteSubCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/subcategories/[id] error", error);
    return NextResponse.json(
      { error: "Failed to delete sub category." },
      { status: 500 }
    );
  }
}
