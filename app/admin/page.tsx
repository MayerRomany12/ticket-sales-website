import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Ticket, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const [totalEvents, totalTickets, publishedEvents] = await Promise.all([
    prisma.event.count(),
    prisma.ticket.count(),
    prisma.event.count({ where: { published: true } }),
  ]);

  const stats = [
    {
      id: "stat-total-events",
      label: "Total Events",
      value: totalEvents,
      description: "All events in the system",
      icon: CalendarDays,
      gradient: "from-violet-600 to-indigo-600",
      glow: "shadow-violet-500/20",
      ring: "ring-violet-500/20",
    },
    {
      id: "stat-tickets-sold",
      label: "Tickets Sold",
      value: totalTickets,
      description: "Across all events",
      icon: Ticket,
      gradient: "from-emerald-600 to-teal-600",
      glow: "shadow-emerald-500/20",
      ring: "ring-emerald-500/20",
    },
    {
      id: "stat-published-events",
      label: "Published Events",
      value: publishedEvents,
      description: "Visible to the public",
      icon: CheckCircle2,
      gradient: "from-sky-600 to-cyan-600",
      glow: "shadow-sky-500/20",
      ring: "ring-sky-500/20",
    },
  ];

  const firstName = session?.user?.name?.split(" ")[0] ?? "Admin";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Dashboard
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back,{" "}
          <span className="text-violet-400 font-medium">{firstName}</span>. Here
          &apos;s your platform overview.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ id, label, value, description, icon: Icon, gradient, glow, ring }) => (
          <div
            key={id}
            id={id}
            className="bg-slate-900 rounded-xl p-5 border border-slate-800/80 hover:border-slate-700/80 transition-colors duration-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-3xl font-bold text-white tabular-nums">
                  {value}
                </p>
                <p className="text-sm font-medium text-slate-300 mt-1">
                  {label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {description}
                </p>
              </div>
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg ${glow} ring-1 ${ring}`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming-soon placeholder */}
      <div className="bg-slate-900/40 border border-slate-800/60 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
          <Ticket className="w-6 h-6 text-slate-600" />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium">
            Event &amp; Ticket Management
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Coming in the next milestone — stay tuned.
          </p>
        </div>
      </div>
    </div>
  );
}
