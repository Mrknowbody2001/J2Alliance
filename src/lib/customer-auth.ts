import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "customer_session";
const SESSION_TTL = 60 * 60 * 24 * 7;

function sessionSecret() {
  const value = process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL;
  if (!value) throw new Error("Set CUSTOMER_SESSION_SECRET before using customer sign in.");
  return value;
}

export function hashCustomerPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyCustomerPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createCustomerSession(customerId: string) {
  const payload = Buffer.from(JSON.stringify({ sub: customerId, exp: Math.floor(Date.now() / 1000) + SESSION_TTL })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function getCustomerIdFromSession(token?: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  try {
    const expected = Buffer.from(sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: string; exp?: number };
    return data.sub && typeof data.exp === "number" && data.exp > Date.now() / 1000 ? data.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentCustomerId() {
  return getCustomerIdFromSession((await cookies()).get(COOKIE_NAME)?.value);
}

export const customerCookie = COOKIE_NAME;
export const customerCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL,
};
