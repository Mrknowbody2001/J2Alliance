"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subCategoryCreateSchema } from "@/validations/subcategory.schema";

const formSchema = subCategoryCreateSchema;

type SubCategoryFormValues = z.infer<typeof formSchema>;

type CategoryOption = {
  id: string;
  name: string;
};

type SubCategoryFormProps = {
  subCategoryId?: string;
  categories: CategoryOption[];
  initialData?: SubCategoryFormValues;
};

export default function SubCategoryForm({
  subCategoryId,
  categories,
  initialData,
}: SubCategoryFormProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubCategoryFormValues>({
    defaultValues: initialData ?? { name: "", imageUrl: null, categoryId: "" },
  });

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }
    setImageUploading(true);
    setImageError(null);
    try {
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Unable to read image."));
        reader.onerror = () => reject(new Error("Unable to read image."));
        reader.readAsDataURL(file);
      });
      const response = await fetch("/api/uploads/subcategory-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, fileName: file.name, subcategoryName: watch("name") || "collection" }),
      });
      const data = (await response.json().catch(() => null)) as { secureUrl?: string; error?: string } | null;
      if (!response.ok || !data?.secureUrl) throw new Error(data?.error ?? "Image upload failed.");
      setImageUrl(data.secureUrl);
      setValue("imageUrl", data.secureUrl, { shouldDirty: true });
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (values: SubCategoryFormValues) => {
    const parsed = formSchema.safeParse({ ...values, imageUrl });

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!field) return;
        setError(field as keyof SubCategoryFormValues, {
          type: "manual",
          message: issue.message,
        });
      });
      return;
    }

    const response = await fetch(
      subCategoryId ? `/api/subcategories/${subCategoryId}` : "/api/subcategories",
      {
        method: subCategoryId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      }
    );

    if (!response.ok) {
      setError("name", {
        type: "manual",
        message: "Failed to save sub category. Please try again.",
      });
      return;
    }

    router.push("/admin/subcategories");
    router.refresh();
  };

  return (
    <form
      className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">
            Sub Category Name
          </label>
          <Input
            {...register("name")}
            placeholder="Sneakers"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Main Category</label>
          <select
            {...register("categoryId")}
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            aria-invalid={Boolean(errors.categoryId)}
          >
            <option value="">Select main category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500">{errors.categoryId.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700">Sub Category Image</label>
        <p className="text-xs text-zinc-500">Shown as the circular collection image on the public category page.</p>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
        <div className="flex flex-wrap items-center gap-4">
          {imageUrl ? <img src={imageUrl} alt="Sub category preview" className="h-20 w-20 rounded-full border border-zinc-200 object-cover" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-zinc-300 text-center text-[10px] text-zinc-500">No image</div>}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={imageUploading}>{imageUploading ? "Uploading..." : imageUrl ? "Replace Image" : "Upload Image"}</Button>
            {imageUrl && <Button type="button" variant="outline" onClick={() => { setImageUrl(null); setValue("imageUrl", null, { shouldDirty: true }); }}>Remove</Button>}
          </div>
        </div>
        {imageError && <p className="text-xs text-red-500">{imageError}</p>}
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || imageUploading || categories.length === 0}>
          {isSubmitting
            ? "Saving..."
            : subCategoryId
            ? "Update Sub Category"
            : "Create Sub Category"}
        </Button>
      </div>
    </form>
  );
}
