import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/public/EventCard";
import { Ticket } from "lucide-react";

export const metadata = { title: "All Events" };

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            Discover Events
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Browse our full catalog of upcoming experiences, concerts, and festivals.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-slate-800/60 rounded-2xl bg-slate-900/30">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No events found</h2>
            <p className="text-slate-500">
              Check back later for new and exciting events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
