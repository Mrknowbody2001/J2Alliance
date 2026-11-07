import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createDiscount, listDiscounts } from "@/services/discount.service";

function valid(body: Record<string, unknown>) {
  return typeof body.name === "string" && body.name.trim().length > 0 &&
    ["CATEGORY", "SUBCATEGORY", "PRODUCT"].includes(String(body.scope)) &&
    typeof body.targetId === "string" && body.targetId.length > 0 &&
    ["PERCENTAGE", "AMOUNT"].includes(String(body.type)) &&
    typeof body.value === "number" && Number.isFinite(body.value) && body.value > 0 &&
    (body.type !== "PERCENTAGE" || body.value <= 100) &&
    typeof body.startsAt === "string" && !Number.isNaN(Date.parse(body.startsAt)) &&
    typeof body.endsAt === "string" && !Number.isNaN(Date.parse(body.endsAt)) &&
    Date.parse(body.endsAt) > Date.parse(body.startsAt) && typeof body.active === "boolean";
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json(await listDiscounts()); }
  catch (error) { console.error("GET discounts", error); return NextResponse.json({ error: "Failed to load discounts." }, { status: 500 }); }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!valid(body)) return NextResponse.json({ error: "Check the discount details and date range." }, { status: 400 });
    return NextResponse.json(await createDiscount(body), { status: 201 });
  } catch (error) { console.error("POST discounts", error); return NextResponse.json({ error: "Failed to create discount." }, { status: 500 }); }
}
