import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "admin_session";
const SESSION_TTL = 60 * 60 * 24 * 7;
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "123";

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL;
  if (!value) throw new Error("Set ADMIN_SESSION_SECRET before using admin login.");
  return value;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

export async function getAdminProfile() {
  const current = await prisma.adminProfile.findUnique({ where: { id: "admin" } });
  if (current) return current;
  return prisma.adminProfile.create({
    data: { id: "admin", username: DEFAULT_USERNAME, passwordHash: hashPassword(DEFAULT_PASSWORD) },
  }).catch(async (error: unknown) => {
    const created = await prisma.adminProfile.findUnique({ where: { id: "admin" } });
    if (created) return created;
    throw error;
  });
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createAdminSession() {
  const payload = Buffer.from(JSON.stringify({ sub: "admin", exp: Math.floor(Date.now() / 1000) + SESSION_TTL })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(token?: string) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: string; exp?: number };
    return data.sub === "admin" && typeof data.exp === "number" && data.exp > Date.now() / 1000;
  } catch { return false; }
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return isValidAdminSession(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

export const adminCookie = COOKIE_NAME;
export const adminCookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_TTL };
