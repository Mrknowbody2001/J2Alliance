import { requireAdmin } from "@/lib/admin-auth";
import DiscountManager from "@/components/admin-components/discount-manager";
import { listCategoriesWithSubCategories } from "@/services/category.service";
import { listDiscounts } from "@/services/discount.service";
import { listProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  await requireAdmin();
  const [categories, products, discounts] = await Promise.all([listCategoriesWithSubCategories(), listProducts(), listDiscounts()]);
  return <DiscountManager
    categories={categories.map(({ id, name }) => ({ id, name }))}
    subcategories={categories.flatMap((category) => category.subcategories.map((subcategory) => ({ id: subcategory.id, name: `${category.name} / ${subcategory.name}`, categoryId: category.id })))}
    products={products.map(({ id, title }) => ({ id, name: title }))}
    discounts={discounts.map((discount) => ({ ...discount, startsAt: discount.startsAt.toISOString(), endsAt: discount.endsAt.toISOString() }))}
  />;
}
