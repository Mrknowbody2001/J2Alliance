import { StorefrontHeader, type ShellCategory } from "@/components/storefront/storefront-shell";
import { listCategoriesWithSubCategories } from "@/services/category.service";

export default async function StorefrontNavigation() {
  const categories = await listCategoriesWithSubCategories();
  const navCategories: ShellCategory[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    subcategories: category.subcategories.map(({ id, name }) => ({ id, name })),
  }));

  return <StorefrontHeader categories={navCategories} />;
}
