import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { createCategory, listCategories } from "@/services/category.service";
import { categoryCreateSchema } from "@/validations/category.schema";

export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error", error);
    return NextResponse.json(
      { error: "Failed to load categories." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const parsed = categoryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const category = await createCategory(parsed.data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error", error);
    return NextResponse.json(
      { error: "Failed to create category." },
      { status: 500 }
    );
  }
}
