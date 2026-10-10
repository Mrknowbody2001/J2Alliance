import { requireAdmin } from "@/lib/admin-auth";
import OrdersManager from "@/components/admin-components/orders-manager";

export default async function AdminOrdersPage() {
  await requireAdmin();
  return <OrdersManager />;
}
