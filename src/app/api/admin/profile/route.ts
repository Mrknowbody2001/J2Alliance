import { NextResponse } from "next/server";
import { hashPassword, isAdminAuthenticated, getAdminProfile } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getAdminProfile();
  return NextResponse.json({ username: profile.username, imageUrl: profile.imageUrl });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const imageUrl = body?.imageUrl === null || typeof body?.imageUrl === "string" ? body.imageUrl : undefined;
  if (username.length < 3 || username.length > 40) return NextResponse.json({ error: "Username must be 3–40 characters." }, { status: 400 });
  if (password && password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  if (imageUrl !== undefined && imageUrl !== null && (imageUrl.length > 2048 || !imageUrl.startsWith("https://"))) return NextResponse.json({ error: "Choose a valid profile image." }, { status: 400 });
  try {
    const updated = await prisma.adminProfile.update({ where: { id: "admin" }, data: { username, ...(password ? { passwordHash: hashPassword(password) } : {}), ...(imageUrl !== undefined ? { imageUrl } : {}) } });
    return NextResponse.json({ username: updated.username, imageUrl: updated.imageUrl });
  } catch {
    return NextResponse.json({ error: "That username is already in use." }, { status: 409 });
  }
}
