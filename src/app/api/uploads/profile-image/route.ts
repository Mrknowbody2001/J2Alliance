import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apiKey = process.env.CLOUDINARY_API_KEY ?? process.env.CLOUDINARY_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET ?? process.env.CLOUDINARY_SECRET;
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || ((!apiKey || !apiSecret) && !preset)) return NextResponse.json({ error: "Cloudinary upload is not configured." }, { status: 500 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Choose a JPG, PNG, or WebP image under 5 MB." }, { status: 400 });
  const upload = new FormData();
  upload.append("file", file);
  upload.append("folder", "admin/profile");
  if (apiKey && apiSecret) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const { createHash } = await import("node:crypto");
    const signature = createHash("sha1").update(`folder=admin/profile&timestamp=${timestamp}${apiSecret}`).digest("hex");
    upload.append("api_key", apiKey); upload.append("timestamp", timestamp); upload.append("signature", signature);
  } else upload.append("upload_preset", preset!);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body: upload });
  const result = await response.json();
  if (!response.ok || !result.secure_url) return NextResponse.json({ error: result.error?.message ?? "Image upload failed." }, { status: 502 });
  return NextResponse.json({ secureUrl: result.secure_url });
}
