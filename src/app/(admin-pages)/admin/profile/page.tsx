import { requireAdmin } from "@/lib/admin-auth";
import AdminProfileForm from "@/components/admin-components/admin-profile-form";
export default async function AdminProfilePage() {
  await requireAdmin(); return <AdminProfileForm />; }
