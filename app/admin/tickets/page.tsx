import { prisma } from "@/lib/prisma";
import { Ticket, Search, CheckCircle2, XCircle } from "lucide-react";

export const metadata = {
  title: "Manage Tickets | TicketVault Admin",
};

export default async function AdminTicketsPage() {
  const tickets = await prisma.ticket.findMany({
    include: {
      event: {
        select: { title: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">All Tickets</h1>
          <p className="text-slate-400 text-sm mt-1">View all sold tickets across events.</p>
        </div>
        <div className="bg-slate-800/50 flex items-center px-3 py-2 rounded-lg border border-slate-700/50 w-64">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search tickets..."
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500"
            disabled
            title="Search is disabled in MVP"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50">
                <th className="px-4 py-3 font-medium text-slate-300">Ticket Code</th>
                <th className="px-4 py-3 font-medium text-slate-300">Customer Name</th>
                <th className="px-4 py-3 font-medium text-slate-300">Email</th>
                <th className="px-4 py-3 font-medium text-slate-300">Event</th>
                <th className="px-4 py-3 font-medium text-slate-300">Status</th>
                <th className="px-4 py-3 font-medium text-slate-300">Purchased</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    <Ticket className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No tickets have been sold yet.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-violet-400 bg-violet-400/10 px-2 py-1 rounded-md text-xs">
                        {ticket.ticketCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{ticket.customerName}</td>
                    <td className="px-4 py-3 text-slate-400">{ticket.customerEmail}</td>
                    <td className="px-4 py-3 text-slate-300">{ticket.event.title}</td>
                    <td className="px-4 py-3">
                      {ticket.isUsed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Used
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(new Date(ticket.createdAt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
