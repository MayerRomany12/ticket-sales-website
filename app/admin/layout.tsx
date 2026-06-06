import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Ticket } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import SignOutButton from "@/components/admin/SignOutButton";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | TicketVault Admin" },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const initials = session.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "A";

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 flex flex-col bg-slate-900 border-r border-slate-800/70">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-slate-800/70 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20 flex-shrink-0">
              <Ticket className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              TicketVault
            </span>
          </div>
        </div>

        {/* Navigation */}
        <AdminNav />

        {/* User info + sign-out */}
        <div className="flex-shrink-0 p-3 border-t border-slate-800/70 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate leading-none">
                {session.user?.name ?? "Admin"}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {session.user?.email}
              </p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-slate-800/70 bg-slate-950">
          <span className="text-sm text-slate-400">
            Logged in as{" "}
            <span className="text-white font-medium">
              {session.user?.email}
            </span>
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
