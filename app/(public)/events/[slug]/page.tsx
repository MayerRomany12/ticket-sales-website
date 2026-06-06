import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalendarDays, MapPin, Ticket, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  
  if (!event) return { title: "Event Not Found" };
  return { title: event.title, description: event.description };
}

export default async function EventDetailsPage({ params }: Props) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, published: true },
  });

  if (!event) notFound();

  const remainingTickets = event.capacity - event.ticketsSold;
  const isSoldOut = remainingTickets <= 0;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(event.date));

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Banner */}
      <div className="relative w-full h-[40vh] min-h-[300px] max-h-[500px] bg-slate-900 overflow-hidden">
        {event.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-800/80">
            <Ticket className="w-20 h-20 text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-5xl mx-auto">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60 backdrop-blur-md">
                  <CalendarDays className="w-4 h-4 text-violet-400" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60 backdrop-blur-md">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Col: Description */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </section>
        </div>

        {/* Right Col: Ticket Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-950/50">
            <h3 className="text-xl font-bold text-white mb-6">Tickets</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <span className="text-slate-400">Price</span>
                <span className="text-2xl font-bold text-white">
                  {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-800">
                <span className="text-slate-400">Remaining</span>
                <div className="text-right">
                  {isSoldOut ? (
                    <span className="text-red-400 font-bold">Sold Out</span>
                  ) : (
                    <span className="text-white font-medium">
                      {remainingTickets} <span className="text-slate-500 text-sm">/ {event.capacity}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isSoldOut ? (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800 text-slate-500 font-bold text-lg cursor-not-allowed"
              >
                <Ticket className="w-5 h-5" />
                Sold Out
              </button>
            ) : (
              <Link
                href={`/checkout/${event.id}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Ticket className="w-5 h-5" />
                Buy Ticket
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
