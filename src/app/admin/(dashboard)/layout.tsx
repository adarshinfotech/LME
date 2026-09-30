import { AccessDenied, AdminShell } from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireStaff();
  if (!ctx) return <AccessDenied />;
  return <AdminShell staff={ctx.staff}>{children}</AdminShell>;
}
