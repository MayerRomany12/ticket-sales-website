import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { createEvent } from "@/app/actions/event";

export const metadata: Metadata = { title: "New Event" };

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Link>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Create Event
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Fill in the details below. You can publish it after saving.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800/80 p-6">
        <EventForm action={createEvent} submitLabel="Create Event" />
      </div>
    </div>
  );
}
