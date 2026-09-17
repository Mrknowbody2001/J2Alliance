import { prisma } from "@/lib/prisma";
import type { CategoryInput } from "@/types";

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          subcategories: true,
        },
      },
    },
  });
}

export async function listCategoriesBasic() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function listCategoriesWithSubCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      subcategories: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });
}

export async function getCategoryWithSubCategories(id: string) {
  if (!id) {
    throw new Error("Category id is required.");
  }

  return prisma.category.findUnique({
    where: { id },
    include: {
      subcategories: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });
}

export async function getCategoryById(id: string) {
  if (!id) {
    throw new Error("Category id is required.");
  }

  return prisma.category.findUnique({
    where: { id },
    include: {
      subcategories: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });
}

export async function createCategory(data: CategoryInput) {
  return prisma.category.create({ data });
}

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  if (!id) {
    throw new Error("Category id is required.");
  }

  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  if (!id) {
    throw new Error("Category id is required.");
  }

  return prisma.category.delete({ where: { id } });
}
