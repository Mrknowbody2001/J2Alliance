import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "dnbinkwgg";

const sanitizeSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

const buildSignature = (params: Record<string, string>, apiSecret: string) => {
  const sortedParams = Object.entries(params)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${sortedParams}${apiSecret}`)
    .digest("hex");
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.CLOUDINARY_API_KEY ?? process.env.CLOUDINARY_KEY;
    const apiSecret =
      process.env.CLOUDINARY_API_SECRET ?? process.env.CLOUDINARY_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if ((!apiKey || !apiSecret) && !uploadPreset) {
      return NextResponse.json(
        {
          error:
            "Cloudinary config missing. Set CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET (or CLOUDINARY_KEY + CLOUDINARY_SECRET), or set CLOUDINARY_UPLOAD_PRESET for unsigned uploads.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as {
      imageData?: string;
      fileName?: string;
    };

    const imageData = body.imageData?.trim();
    const fileName = body.fileName?.trim();

    if (!imageData || !imageData.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image data." },
        { status: 400 }
      );
    }

    if (imageData.length > MAX_IMAGE_SIZE_BYTES * 1.4) {
      return NextResponse.json(
        { error: "Image is too large. Max 10MB." },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = `hero/${sanitizeSegment("home-hero")}`;

    const formData = new FormData();
    formData.append("file", imageData);
    formData.append("folder", folder);

    if (apiKey && apiSecret) {
      const signatureParams: Record<string, string> = { folder, timestamp };
      if (fileName) signatureParams.filename_override = fileName;
      const signature = buildSignature(signatureParams, apiSecret);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
    } else if (uploadPreset) {
      formData.append("upload_preset", uploadPreset);
    }

    if (fileName) {
      formData.append("filename_override", fileName);
    }

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadData = (await uploadResponse.json()) as {
      secure_url?: string;
      error?: { message?: string };
    };

    if (!uploadResponse.ok || !uploadData.secure_url) {
      return NextResponse.json(
        {
          error:
            uploadData.error?.message ??
            "Failed to upload image to Cloudinary.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ secureUrl: uploadData.secure_url, folder });
  } catch (error) {
    console.error("POST /api/uploads/hero-image error", error);
    return NextResponse.json(
      { error: "Unexpected upload error." },
      { status: 500 }
    );
  }
}
