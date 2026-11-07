import { createHash, randomBytes } from "node:crypto";

export const stateCookie = "customer_google_state";
export const verifierCookie = "customer_google_verifier";
export const oauthCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 600,
};

export function callbackUri(request: Request) {
  return process.env.GOOGLE_REDIRECT_URI || new URL("/api/customer/google/callback", request.url).toString();
}

export function createGoogleAuthorization(request: Request) {
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const authorizeUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizeUrl.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: callbackUri(request),
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();
  return { state, verifier, authorizeUrl };
}
