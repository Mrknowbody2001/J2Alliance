import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCustomerSession, customerCookie, customerCookieOptions, hashCustomerPassword } from "@/lib/customer-auth";
import { callbackUri, oauthCookieOptions, stateCookie, verifierCookie } from "@/lib/customer-google-oauth";

type GoogleProfile = { email?: string; verified_email?: boolean; email_verified?: boolean; given_name?: string; family_name?: string; name?: string };

function finish(request: NextRequest, error?: string) {
  const response = NextResponse.redirect(new URL(error ? `/sign-in?error=${error}` : "/account", request.url));
  response.cookies.set(stateCookie, "", { ...oauthCookieOptions, maxAge: 0 });
  response.cookies.set(verifierCookie, "", { ...oauthCookieOptions, maxAge: 0 });
  return response;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = request.cookies.get(stateCookie)?.value;
  const verifier = request.cookies.get(verifierCookie)?.value;
  if (url.searchParams.has("error")) return finish(request, "google_cancelled");
  if (!code || !state || !savedState || state !== savedState || !verifier) return finish(request, "google_auth_failed");

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return finish(request, "google_not_configured");

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: clientId, client_secret: clientSecret,
        redirect_uri: callbackUri(request), grant_type: "authorization_code", code_verifier: verifier,
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) return finish(request, "google_auth_failed");
    const tokens = await tokenResponse.json() as { access_token?: string; token_type?: string };
    if (!tokens.access_token || tokens.token_type?.toLowerCase() !== "bearer") return finish(request, "google_auth_failed");

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` }, cache: "no-store",
    });
    if (!profileResponse.ok) return finish(request, "google_auth_failed");
    const profile = await profileResponse.json() as GoogleProfile;
    const email = profile.email?.trim().toLowerCase();
    // The OAuth2 v2 userinfo endpoint returns `verified_email`; `email_verified`
    // is the equivalent OpenID Connect claim used by other Google endpoints.
    if (!email || !(profile.verified_email === true || profile.email_verified === true)) {
      return finish(request, "google_email_unverified");
    }

    let customer = await prisma.customer.findUnique({ where: { email }, select: { id: true } });
    if (!customer) {
      const pieces = (profile.name || "J2Alliance Customer").trim().split(/\s+/);
      const firstName = profile.given_name?.trim() || pieces[0] || "Customer";
      const lastName = profile.family_name?.trim() || pieces.slice(1).join(" ") || "";
      try {
        customer = await prisma.customer.create({
          data: { email, firstName, lastName, passwordHash: hashCustomerPassword(randomBytes(48).toString("base64url")) },
          select: { id: true },
        });
      } catch (error) {
        // A simultaneous signup may have claimed the same verified email.
        if (!(typeof error === "object" && error !== null && "code" in error && error.code === "P2002")) throw error;
        customer = await prisma.customer.findUnique({ where: { email }, select: { id: true } });
        if (!customer) throw error;
      }
    }

    const response = finish(request);
    response.cookies.set(customerCookie, createCustomerSession(customer.id), customerCookieOptions);
    return response;
  } catch (error) {
    console.error("Google customer sign in failed:", error);
    return finish(request, "google_auth_failed");
  }
}
