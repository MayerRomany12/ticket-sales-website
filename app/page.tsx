import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/public/EventCard";
import { ArrowRight, Ticket, CalendarDays } from "lucide-react";
import { PublicNav } from "@/components/public/PublicNav";
import { PublicFooter } from "@/components/public/PublicFooter";

export const metadata = { title: "Home" };

export default async function HomePage() {
  const events = await prisma.event.findMany({
    where: { published: true, date: { gte: new Date() } },
    orderBy: { date: "asc" },
  });

  const featuredEvents = events.slice(0, 3);
  const upcomingEvents = events.slice(3, 9); // limit upcoming to next 6

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <PublicNav />
      <main className="flex-grow pt-16 w-full">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32 overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-slate-950">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-slate-950 to-indigo-600/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none" />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-8">
              <Ticket className="w-4 h-4" />
              <span>Discover your next experience</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-8">
              Unforgettable <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Events</span>
              <br /> Start Here
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
              Get tickets to the best concerts, festivals, and exclusive events. No sign-up required.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/events"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-lg transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="py-20 bg-slate-950">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Featured Events</h2>
                  <p className="text-slate-400">Don&apos;t miss out on these top picks</p>
                </div>
                <Link
                  href="/events"
                  className="hidden sm:flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-medium"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="py-20 bg-slate-900 border-t border-slate-800/60">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-white mb-2">Upcoming Events</h2>
              <p className="text-slate-400 mb-12">More exciting events coming soon</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
              <div className="mt-16 text-center">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
                >
                  View All Events <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {events.length === 0 && (
          <section className="py-32 bg-slate-950">
            <div className="max-w-xl mx-auto text-center px-6">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="w-10 h-10 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No upcoming events</h2>
              <p className="text-slate-400">
                We&apos;re currently preparing some amazing experiences. Check back later!
              </p>
            </div>
          </section>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
