import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, CalendarDays, Pencil, Ticket } from "lucide-react";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";
import { PublishButton } from "@/components/admin/PublishButton";

export const metadata: Metadata = { title: "Events" };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatPrice(price: any) {
  const numPrice = Number(price);
  return numPrice === 0
    ? "Free"
    : new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tickets: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Events
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {events.length === 0
              ? "No events yet"
              : `${events.length} event${events.length === 1 ? "" : "s"} total`}
          </p>
        </div>
        <Link
          id="new-event-btn"
          href="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-px"
        >
          <Plus className="w-4 h-4" />
          New Event
        </Link>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-slate-800/60 border-dashed rounded-2xl bg-slate-900/30 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
            <CalendarDays className="w-7 h-7 text-slate-600" />
          </div>
          <div>
            <p className="text-slate-300 font-medium">No events yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Create your first event to get started.
            </p>
          </div>
          <Link
            href="/admin/events/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 font-medium text-sm border border-violet-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      )}

      {/* Events table */}
      {events.length > 0 && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3.5 text-left font-semibold">Event</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Date</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Price</th>
                  <th className="px-5 py-3.5 text-left font-semibold">
                    Tickets
                  </th>
                  <th className="px-5 py-3.5 text-left font-semibold">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-slate-800/30 transition-colors duration-100"
                  >
                    {/* Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {event.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={event.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                            <Ticket className="w-5 h-5 text-slate-600" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-[200px]">
                            {event.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(event.date)}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 text-slate-300 whitespace-nowrap font-medium">
                      {formatPrice(event.price)}
                    </td>

                    {/* Tickets */}
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                      <span className="text-white font-medium">
                        {event._count.tickets}
                      </span>
                      <span className="text-slate-500">
                        {" "}/ {event.capacity}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.published
                            ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20"
                            : "bg-slate-700/50 text-slate-400 ring-1 ring-slate-600/30"
                          }`}
                      >
                        {event.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700/60 border border-slate-700/40 hover:border-slate-600/60 transition-all duration-150"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <PublishButton
                          id={event.id}
                          published={event.published}
                        />
                        <DeleteEventButton id={event.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
