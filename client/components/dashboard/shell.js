"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, ChartNoAxesCombined, GitBranch, LogOut, Users } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: Briefcase },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/candidates", label: "Candidates", icon: Users },
  { href: "/dashboard/workflows", label: "Workflows", icon: GitBranch },
  { href: "/dashboard/analytics", label: "Analytics", icon: ChartNoAxesCombined }
];

export function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-white p-4 md:block">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">AI Recruitment</p>
          <h1 className="text-xl font-semibold">Recruiter Console</h1>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700",
                  pathname === link.href && "bg-blue-50 font-medium text-primary"
                )}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="absolute bottom-4 left-4 flex items-center gap-2 text-sm text-muted"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
