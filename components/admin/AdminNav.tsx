"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Ticket, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/events", label: "Events", icon: CalendarDays, exact: false },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket, exact: false },
  { href: "/admin/validate", label: "Scan Tickets", icon: ScanLine, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold px-3 py-2">
        Menu
      </p>
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact
          ? pathname === href
          : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
              isActive
                ? "bg-violet-600/15 text-violet-300 font-medium"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 flex-shrink-0 transition-colors",
                isActive
                  ? "text-violet-400"
                  : "group-hover:text-violet-400"
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
