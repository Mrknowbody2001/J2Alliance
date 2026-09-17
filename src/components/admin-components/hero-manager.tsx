"use client";

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { HeroSectionDTO } from "@/types";

type HeroManagerProps = {
  initialHero: HeroSectionDTO;
};

type NoticeState = {
  type: "success" | "error";
  message: string;
};

const isHeroSectionDTO = (
  value: HeroSectionDTO | { error?: string } | null
): value is HeroSectionDTO =>
  Boolean(value && "id" in value && "maxSlides" in value && "slides" in value);

const isHeroSlideDTO = (
  value: HeroSectionDTO["slides"][number] | { error?: string } | null
): value is HeroSectionDTO["slides"][number] =>
  Boolean(value && "id" in value && "imageUrl" in value && "position" in value);

const emptyErrors = {
  imageUrl: "",
  title: "",
  maxSlides: "",
};

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read image."));
    };
    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });

const readImageDimensions = (file: File) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      resolve({ width: image.width, height: image.height });
      URL.revokeObjectURL(objectUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image dimensions."));
    };

    image.src = objectUrl;
  });

export default function HeroManager({ initialHero }: HeroManagerProps) {
  const [hero, setHero] = useState(initialHero);
  const [maxSlides, setMaxSlides] = useState(String(initialHero.maxSlides));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [eyebrow, setEyebrow] = useState("");
  const [title, setTitle] = useState("");
  const [copy, setCopy] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingSlide, setIsSavingSlide] = useState(false);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [errors, setErrors] = useState(emptyErrors);

  const remainingSlots = useMemo(
    () => Math.max(hero.maxSlides - hero.slides.length, 0),
    [hero.maxSlides, hero.slides.length]
  );

  const resetSlideForm = () => {
    setEditingId(null);
    setUploadedImageUrl("");
    setPreviewUrl("");
    setEyebrow("");
    setTitle("");
    setCopy("");
    setErrors((current) => ({
      ...current,
      imageUrl: "",
      title: "",
    }));
  };

  const uploadHeroImage = async (file: File) => {
    const dimensions = await readImageDimensions(file);

    if (dimensions.width < 1200 || dimensions.height < 520) {
      throw new Error("Hero images should be at least 1200 x 520 pixels.");
    }

    const imageData = await toDataUrl(file);
    const response = await fetch("/api/uploads/hero-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageData,
        fileName: file.name,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | { secureUrl?: string; error?: string }
      | null;

    if (!response.ok || !data?.secureUrl) {
      throw new Error(data?.error ?? "Failed to upload hero image.");
    }

    return data.secureUrl;
  };

  const handleSelectImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setNotice(null);
    setErrors((current) => ({ ...current, imageUrl: "" }));
    setIsUploadingImage(true);

    try {
      const secureUrl = await uploadHeroImage(file);
      setUploadedImageUrl(secureUrl);
      setPreviewUrl(secureUrl);
    } catch (error) {
      setErrors((current) => ({
        ...current,
        imageUrl:
          error instanceof Error ? error.message : "Failed to upload image.",
      }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveSettings = async () => {
    setNotice(null);
    setErrors((current) => ({ ...current, maxSlides: "" }));

    const parsed = Number(maxSlides);

    if (!Number.isInteger(parsed) || parsed < 1) {
      setErrors((current) => ({
        ...current,
        maxSlides: "Enter a whole number greater than 0.",
      }));
      return;
    }

    setIsSavingSettings(true);

    try {
      const response = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxSlides: parsed }),
      });

      const data = (await response.json().catch(() => null)) as
        | HeroSectionDTO
        | { error?: string }
        | null;

      if (!response.ok || !isHeroSectionDTO(data)) {
        throw new Error(
          data && "error" in data ? data.error : "Failed to update hero."
        );
      }

      setHero(data);
      setMaxSlides(String(data.maxSlides));
      setNotice({
        type: "success",
        message: "Hero slide limit updated.",
      });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        maxSlides:
          error instanceof Error
            ? error.message
            : "Failed to update hero settings.",
      }));
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleEditSlide = (slide: HeroSectionDTO["slides"][number]) => {
    setNotice(null);
    setEditingId(slide.id);
    setUploadedImageUrl(slide.imageUrl);
    setPreviewUrl(slide.imageUrl);
    setEyebrow(slide.eyebrow ?? "");
    setTitle(slide.title);
    setCopy(slide.copy ?? "");
    setErrors((current) => ({
      ...current,
      imageUrl: "",
      title: "",
    }));
  };

  const handleDeleteSlide = async (id: string) => {
    setNotice(null);

    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Failed to delete hero slide.");
      }

      setHero((current) => ({
        ...current,
        slides: current.slides.filter((slide) => slide.id !== id),
      }));

      if (editingId === id) {
        resetSlideForm();
      }

      setNotice({
        type: "success",
        message: "Hero slide deleted.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete slide.",
      });
    }
  };

  const handleSaveSlide = async () => {
    setNotice(null);
    setErrors((current) => ({
      ...current,
      imageUrl: uploadedImageUrl ? "" : current.imageUrl,
      title: title.trim() ? "" : current.title,
    }));

    let hasErrors = false;

    if (!uploadedImageUrl) {
      hasErrors = true;
      setErrors((current) => ({
        ...current,
        imageUrl: "Upload a hero image first.",
      }));
    }

    if (!title.trim()) {
      hasErrors = true;
      setErrors((current) => ({
        ...current,
        title: "Add a slide title.",
      }));
    }

    if (hasErrors) {
      return;
    }

    setIsSavingSlide(true);

    try {
      const endpoint = editingId
        ? `/api/hero-slides/${editingId}`
        : "/api/hero-slides";
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadedImageUrl,
          eyebrow: eyebrow.trim() || null,
          title: title.trim(),
          copy: copy.trim() || null,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | HeroSectionDTO["slides"][number]
        | { error?: string }
        | null;

      if (!response.ok || !isHeroSlideDTO(data)) {
        throw new Error(
          data && "error" in data ? data.error : "Failed to save hero slide."
        );
      }

      setHero((current) => {
        const existingIndex = current.slides.findIndex((slide) => slide.id === data.id);

        if (existingIndex >= 0) {
          const nextSlides = [...current.slides];
          nextSlides[existingIndex] = data;
          return {
            ...current,
            slides: nextSlides.sort((first, second) => first.position - second.position),
          };
        }

        return {
          ...current,
          slides: [...current.slides, data].sort(
            (first, second) => first.position - second.position
          ),
        };
      });

      resetSlideForm();
      setNotice({
        type: "success",
        message: editingId ? "Hero slide updated." : "Hero slide added.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to save hero slide.",
      });
    } finally {
      setIsSavingSlide(false);
    }
  };

  const canAddNewSlide = hero.slides.length < hero.maxSlides || Boolean(editingId);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Hero scroller settings</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Choose how many homepage hero slides can be active in the image scroller.
              </p>
            </div>
            <div className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
              {hero.slides.length} / {hero.maxSlides} used
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[220px_1fr_auto] md:items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Hero slide limit
              </label>
              <Input
                type="number"
                min={1}
                max={12}
                value={maxSlides}
                onChange={(event) => setMaxSlides(event.target.value)}
              />
              <p className="text-xs text-zinc-500">
                Lower the number after deleting extra previous slides.
              </p>
              {errors.maxSlides && (
                <p className="text-xs text-red-500">{errors.maxSlides}</p>
              )}
            </div>
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              Remaining space: <span className="font-semibold">{remainingSlots}</span>
              {" "}slide{remainingSlots === 1 ? "" : "s"}.
            </div>
            <Button onClick={handleSaveSettings} disabled={isSavingSettings}>
              {isSavingSettings ? "Saving..." : "Save Setting"}
            </Button>
          </div>

          {notice && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                notice.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {notice.message}
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              {editingId ? "Edit hero slide" : "Add hero slide"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Upload a wide image and update the text shown over it on the homepage.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              <span className="font-semibold">Recommended image:</span>{" "}
              1920 × 840 px (16:7). Use a wide, high-quality image and keep important
              content away from the outer edges so it stays visible on smaller screens.
            </div>
            <label className="text-sm font-medium text-zinc-700">Hero image</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center transition hover:border-zinc-400 hover:bg-zinc-100">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Hero preview"
                  className="aspect-[16/7] w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex aspect-[16/7] w-full flex-col items-center justify-center gap-3">
                  <ImagePlus className="h-8 w-8 text-zinc-400" />
                  <div className="text-sm text-zinc-500">
                    Click to upload a hero image
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSelectImage}
              />
            </label>
            {isUploadingImage && (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Uploading image...
              </div>
            )}
            {errors.imageUrl && (
              <p className="text-xs text-red-500">{errors.imageUrl}</p>
            )}
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Eyebrow</label>
              <Input
                value={eyebrow}
                maxLength={80}
                onChange={(event) => setEyebrow(event.target.value)}
                placeholder="Online Store"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Title</label>
              <Input
                value={title}
                maxLength={120}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="J2Alliance"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Copy</label>
              <textarea
                value={copy}
                maxLength={240}
                onChange={(event) => setCopy(event.target.value)}
                className="min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Short text shown below the slide title."
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="outline" onClick={resetSlideForm}>
              Clear
            </Button>
            <Button
              type="button"
              onClick={handleSaveSlide}
              disabled={isSavingSlide || isUploadingImage || !canAddNewSlide}
            >
              {isSavingSlide ? "Saving..." : editingId ? "Update Slide" : "Add Slide"}
            </Button>
          </div>

          {!canAddNewSlide && !editingId && (
            <p className="text-sm text-amber-600">
              Hero scroller is full. Increase the slide limit before adding more.
            </p>
          )}
        </section>
      </div>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Current hero slides</h2>
          <p className="mt-1 text-sm text-zinc-500">
            These slides appear in order on the homepage hero image scroller.
          </p>
        </div>

        {hero.slides.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {hero.slides.map((slide, index) => (
              <article
                key={slide.id}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="aspect-[16/7] w-full object-cover"
                />
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Slide {index + 1}
                    </span>
                    <span className="text-xs text-zinc-400">Order {slide.position + 1}</span>
                  </div>
                  <div>
                    {slide.eyebrow && (
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {slide.eyebrow}
                      </p>
                    )}
                    <h3 className="mt-1 text-lg font-semibold text-zinc-900">
                      {slide.title}
                    </h3>
                    {slide.copy && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
                        {slide.copy}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSlide(slide)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void handleDeleteSlide(slide.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-sm text-zinc-500">
            No hero slides yet. Add one here; until then the storefront uses the default banner images.
          </div>
        )}
      </section>
    </div>
  );
}
