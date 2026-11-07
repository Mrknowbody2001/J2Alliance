import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import {
  createSubCategory,
  listSubCategories,
} from "@/services/subcategory.service";
import { subCategoryCreateSchema } from "@/validations/subcategory.schema";

export async function GET() {
  try {
    const subcategories = await listSubCategories();
    return NextResponse.json(subcategories);
  } catch (error) {
    console.error("GET /api/subcategories error", error);
    return NextResponse.json(
      { error: "Failed to load sub categories." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const parsed = subCategoryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const subcategory = await createSubCategory(parsed.data);
    return NextResponse.json(subcategory, { status: 201 });
  } catch (error) {
    console.error("POST /api/subcategories error", error);
    return NextResponse.json(
      { error: "Failed to create sub category." },
      { status: 500 }
    );
  }
}
