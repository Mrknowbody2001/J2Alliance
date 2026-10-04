import { redirect } from "next/navigation";
import { CustomerDashboard } from "@/components/customer/customer-dashboard";
import { getCurrentCustomerId } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const id = await getCurrentCustomerId();
  if (!id) redirect("/sign-in");
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: { id: true, email: true, firstName: true, lastName: true, phone: true, address: true, city: true, postalCode: true },
  });
  if (!customer) redirect("/sign-in");
  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({ where: { customerId: id }, include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.customerAddress.findMany({ where: { customerId: id }, orderBy: { createdAt: "desc" } }),
  ]);
  return <CustomerDashboard customer={customer} orders={orders} addresses={addresses} />;
}
