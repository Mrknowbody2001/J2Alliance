import { NextResponse } from "next/server";
import { createGoogleAuthorization, oauthCookieOptions, stateCookie, verifierCookie } from "@/lib/customer-google-oauth";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return NextResponse.redirect(new URL("/sign-in?error=google_not_configured", request.url));

  const { state, verifier, authorizeUrl } = createGoogleAuthorization(request);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(stateCookie, state, oauthCookieOptions);
  response.cookies.set(verifierCookie, verifier, oauthCookieOptions);
  return response;
}
