import type { ReactNode } from "react";
import StorefrontNavigation from "@/components/storefront/storefront-navigation";

export const dynamic = "force-dynamic";

export default async function PublicPagesLayout({ children }: { children: ReactNode }) {
  return <><StorefrontNavigation />{children}</>;
}
