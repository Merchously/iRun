import { requireAuth } from "@/lib/auth/guards";
import { isStaff } from "@/lib/permissions/check";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { roles } = await requireAuth();

  if (!isStaff(roles)) {
    redirect("/account");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
