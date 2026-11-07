import { prisma } from "@/lib/prisma";

export type DiscountInput = {
  name: string;
  scope: "CATEGORY" | "SUBCATEGORY" | "PRODUCT";
  targetId: string;
  type: "PERCENTAGE" | "AMOUNT";
  value: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
};

export async function listDiscounts() {
  return prisma.discount.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createDiscount(data: DiscountInput) {
  const exists = data.scope === "CATEGORY"
    ? await prisma.category.findUnique({ where: { id: data.targetId }, select: { id: true } })
    : data.scope === "SUBCATEGORY"
      ? await prisma.subCategory.findUnique({ where: { id: data.targetId }, select: { id: true } })
      : await prisma.product.findUnique({ where: { id: data.targetId }, select: { id: true } });
  if (!exists) throw new Error("The selected discount target was not found.");
  return prisma.discount.create({ data: { ...data, startsAt: new Date(data.startsAt), endsAt: new Date(data.endsAt) } });
}

export async function updateDiscount(id: string, data: Partial<DiscountInput>) {
  return prisma.discount.update({ where: { id }, data: {
    ...data,
    ...(data.startsAt ? { startsAt: new Date(data.startsAt) } : {}),
    ...(data.endsAt ? { endsAt: new Date(data.endsAt) } : {}),
  } });
}

export async function deleteDiscount(id: string) {
  return prisma.discount.delete({ where: { id } });
}

export async function getDiscountForProduct(product: { id: string; categoryId: string; subCategoryId: string; price: number }) {
  const now = new Date();
  const candidates = await prisma.discount.findMany({
    where: { active: true, startsAt: { lte: now }, endsAt: { gt: now }, OR: [
      { scope: "PRODUCT", targetId: product.id },
      { scope: "SUBCATEGORY", targetId: product.subCategoryId },
      { scope: "CATEGORY", targetId: product.categoryId },
    ] },
    orderBy: [{ scope: "asc" }, { createdAt: "desc" }],
  });
  return calculateDiscount(product, candidates);
}

function calculateDiscount(product: { id: string; categoryId: string; subCategoryId: string; price: number }, candidates: Awaited<ReturnType<typeof listDiscounts>>) {
  const specificity = { PRODUCT: 3, SUBCATEGORY: 2, CATEGORY: 1 };
  const discount = candidates.filter((item) =>
    (item.scope === "PRODUCT" && item.targetId === product.id) ||
    (item.scope === "SUBCATEGORY" && item.targetId === product.subCategoryId) ||
    (item.scope === "CATEGORY" && item.targetId === product.categoryId)
  ).sort((a, b) => specificity[b.scope] - specificity[a.scope] || b.createdAt.getTime() - a.createdAt.getTime())[0];
  if (!discount) return null;
  const amount = discount.type === "PERCENTAGE" ? product.price * discount.value / 100 : discount.value;
  return { id: discount.id, name: discount.name, type: discount.type, value: discount.value, discountedPrice: Math.max(0, Math.round((product.price - amount) * 100) / 100) };
}

export async function getDiscountsForProducts<T extends { id: string; categoryId: string; subCategoryId: string; price: number }>(products: T[]) {
  if (!products.length) return products.map((product) => ({ ...product, discount: null }));
  const now = new Date();
  const candidates = await prisma.discount.findMany({
    where: { active: true, startsAt: { lte: now }, endsAt: { gt: now }, OR: [
      { scope: "CATEGORY", targetId: { in: [...new Set(products.map((product) => product.categoryId))] } },
      { scope: "SUBCATEGORY", targetId: { in: [...new Set(products.map((product) => product.subCategoryId))] } },
      { scope: "PRODUCT", targetId: { in: products.map((product) => product.id) } },
    ] },
  });
  return products.map((product) => ({ ...product, discount: calculateDiscount(product, candidates) }));
}
