import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, Ticket, CalendarDays, MapPin, Download } from "lucide-react";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { PrintButton } from "@/components/public/PrintButton";

export const metadata = { title: "Ticket Confirmed" };

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  // Verify the session is actually paid
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      redirect("/");
    }
  } catch (err) {
    redirect("/");
  }

  // Retrieve ticket from database
  const ticket = await prisma.ticket.findUnique({
    where: { stripeSessionId: session_id },
    include: { event: true },
  });

  if (!ticket) {
    // Webhook hasn't finished fulfilling yet. Auto-refresh.
    return (
      <div className="min-h-[80vh] bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <meta httpEquiv="refresh" content="3" />
        <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-8" />
        <h1 className="text-3xl font-bold text-white mb-4">Securing your ticket...</h1>
        <p className="text-slate-400 max-w-sm mx-auto">
          We are generating your unique QR code and finalizing your purchase. This page will refresh automatically.
        </p>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ticket.event.date));

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl" />
            <CheckCircle2 className="w-8 h-8 relative z-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            You're Going to {ticket.event.title}!
          </h1>
          <p className="text-lg text-slate-400">
            A confirmation email has been sent to <span className="text-white font-medium">{ticket.customerEmail}</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-violet-500/10">
          {/* Ticket Header */}
          <div className="bg-slate-900 p-8 text-center border-b border-dashed border-slate-700 relative">
            {/* Cutouts for ticket effect */}
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-slate-950 rounded-full" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-slate-950 rounded-full" />
            
            <h2 className="text-2xl font-bold text-white mb-2">{ticket.event.title}</h2>
            <p className="text-slate-400 flex items-center justify-center gap-2 mb-2">
              <CalendarDays className="w-4 h-4 text-violet-400" />
              {formattedDate}
            </p>
            <p className="text-slate-400 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-violet-400" />
              {ticket.event.location}
            </p>
          </div>

          {/* Ticket Body */}
          <div className="p-8 text-center bg-white relative">
            <div className="mb-8">
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-2">Ticket Code</p>
              <p className="text-3xl font-mono font-bold text-slate-900 tracking-widest">{ticket.ticketCode}</p>
            </div>
            
            {ticket.qrCode && (
              <div className="flex justify-center mb-8">
                <div className="p-4 border-2 border-slate-100 rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ticket.qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t border-slate-100 text-left">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Attendee</p>
                <p className="font-semibold text-slate-900">{ticket.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Type</p>
                <p className="font-semibold text-slate-900">General Admission</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <PrintButton />
          <Link
            href="/events"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
          >
            <Ticket className="w-5 h-5" />
            More Events
          </Link>
        </div>
      </div>
    </div>
  );
}
