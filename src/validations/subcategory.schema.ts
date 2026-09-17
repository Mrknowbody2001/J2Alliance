import { z } from "zod";

export const subCategoryCreateSchema = z.object({
  name: z.string().min(2, "Sub category name is required").max(120),
  imageUrl: z.string().url("Please upload a valid image.").nullable().optional(),
  categoryId: z.string().min(1, "Main category is required"),
});

export const subCategoryUpdateSchema = subCategoryCreateSchema.partial();
