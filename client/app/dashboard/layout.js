import { AuthGuard } from "../../components/dashboard/auth-guard";
import { DashboardShell } from "../../components/dashboard/shell";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
