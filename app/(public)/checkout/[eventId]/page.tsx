import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";
import { CheckoutForm } from "@/components/public/CheckoutForm";

interface Props {
  params: Promise<{ eventId: string }>;
}

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({ params }: Props) {
  const { eventId } = await params;
  
  const event = await prisma.event.findUnique({
    where: { id: eventId, published: true },
  });

  if (!event) notFound();

  const remainingTickets = event.capacity - event.ticketsSold;
  if (remainingTickets <= 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mb-6">
          <Ticket className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Sold Out</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Unfortunately, there are no more tickets available for {event.title}.
        </p>
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="md:col-span-3">
            <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
            <p className="text-slate-400 mb-8">
              Enter your details to secure your ticket.
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <CheckoutForm eventId={event.id} />
            </div>
          </div>

          {/* Summary Section */}
          <div className="md:col-span-2">
            <div className="sticky top-24 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
              
              <div className="flex gap-4 mb-6">
                {event.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Ticket className="w-6 h-6 text-slate-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-white line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">1 × Ticket</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">
                    {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Fees</span>
                  <span className="text-white">$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-800">
                <span className="text-base font-medium text-white">Total</span>
                <span className="text-xl font-bold text-white">
                  {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
