import "server-only";
import nodemailer from "nodemailer";

function getCredentials() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) {
    throw new Error("Admin email verification is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
  }
  return { user, pass };
}

export function getAdminEmailAddress() {
  return getCredentials().user;
}

export async function sendAdminOtpEmail(code: string, recipient: string) {
  const { user, pass } = getCredentials();
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `J2Alliance Store Console <${user}>`,
    to: recipient,
    subject: "Your J2Alliance admin sign-in code",
    text: `Your admin sign-in code is ${code}. It expires in 5 minutes. If you did not request this code, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#18181b"><p style="font-size:12px;letter-spacing:3px;color:#a1a1aa;text-transform:uppercase">J2Alliance Store Console</p><h1 style="font-size:24px">Your sign-in code</h1><p>Enter this code to finish signing in. It expires in 5 minutes.</p><p style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px 0">${code}</p><p style="color:#71717a;font-size:13px">If you did not request this code, you can ignore this email.</p></div>`,
  });
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.length > 2 ? `${local[0]}${"*".repeat(Math.min(local.length - 2, 6))}${local.at(-1)}` : `${local[0]}*`;
  return `${visible}@${domain}`;
}
