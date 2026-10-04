import { NextRequest, NextResponse } from "next/server";

async function isValidSession(token?: string) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL;
  if (!payload || !signature || !secret) return false;
  try {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const expected = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    if (expected !== signature) return false;
    const data = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { sub?: string; exp?: number };
    return data.sub === "admin" && typeof data.exp === "number" && data.exp > Date.now() / 1000;
  } catch { return false; }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isApi = pathname.startsWith("/api/");
  if (isApi && pathname.startsWith("/api/customer/")) return NextResponse.next();
  if (isApi && ["/api/admin/login", "/api/admin/logout"].includes(pathname)) return NextResponse.next();
  if (isApi && request.method === "GET" && pathname !== "/api/admin/profile") return NextResponse.next();
  if (isApi && request.method === "POST" && ["/api/cart", "/api/orders"].includes(pathname)) return NextResponse.next();
  if (await isValidSession(request.cookies.get("admin_session")?.value)) return NextResponse.next();
  if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const login = new URL("/admin/login", request.url);
  if (request.nextUrl.pathname !== "/admin") login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/((?!login).*)", "/api/:path*"] };
