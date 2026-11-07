import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteDiscount, updateDiscount } from "@/services/discount.service";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.active !== "boolean") return NextResponse.json({ error: "Invalid discount status." }, { status: 400 });
    const { id } = await params;
    return NextResponse.json(await updateDiscount(id, { active: body.active }));
  } catch (error) { console.error("PATCH discount", error); return NextResponse.json({ error: "Failed to update discount." }, { status: 500 }); }
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { const { id } = await params; await deleteDiscount(id); return NextResponse.json({ success: true }); }
  catch (error) { console.error("DELETE discount", error); return NextResponse.json({ error: "Failed to delete discount." }, { status: 500 }); }
}
