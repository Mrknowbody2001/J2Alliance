import { z } from "zod";

export const heroSectionUpdateSchema = z.object({
  maxSlides: z
    .number({ error: "Hero slide limit is required" })
    .int("Hero slide limit must be a whole number")
    .min(1, "Hero must allow at least 1 slide")
    .max(12, "Hero can allow up to 12 slides"),
});

export const heroSlideCreateSchema = z.object({
  imageUrl: z.url("Hero image is required"),
  eyebrow: z.string().trim().max(80, "Eyebrow can be up to 80 characters").nullable().optional(),
  title: z.string().trim().min(1, "Slide title is required").max(120, "Title can be up to 120 characters"),
  copy: z.string().trim().max(240, "Copy can be up to 240 characters").nullable().optional(),
  position: z.number().int().min(0).optional(),
});

export const heroSlideUpdateSchema = heroSlideCreateSchema.partial();
