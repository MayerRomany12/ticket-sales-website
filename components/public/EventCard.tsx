"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import type { Event } from "@prisma/client";

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const remainingTickets = event.capacity - event.ticketsSold;
  const isSoldOut = remainingTickets <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-colors duration-300"
    >
      <Link href={`/events/${event.slug}`} className="block h-full flex flex-col">
        <div className="relative aspect-[16/9] w-full bg-slate-800 overflow-hidden">
          {event.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800/80">
              <Ticket className="w-12 h-12 text-slate-700" />
            </div>
          )}
          {/* Price badge */}
          <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-700/50 shadow-xl">
            {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-2 mt-auto">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <CalendarDays className="w-4 h-4 text-violet-400" />
              <span>
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(event.date))}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-violet-400" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-sm">
              {isSoldOut ? (
                <span className="text-red-400 font-medium">Sold Out</span>
              ) : (
                <span className="text-emerald-400 font-medium">
                  {remainingTickets} tickets left
                </span>
              )}
            </div>
            <span className="text-violet-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              View Details &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
