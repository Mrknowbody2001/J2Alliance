import type { ReactNode } from "react";
import CustomerPrivateNavigation from "@/components/customer/customer-private-navigation";

export default function CustomerPagesLayout({ children }: { children: ReactNode }) {
  return <><CustomerPrivateNavigation />{children}</>;
}
