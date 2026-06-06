import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/EventForm";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";
import { PublishButton } from "@/components/admin/PublishButton";
import { updateEvent } from "@/app/actions/event";

export const metadata: Metadata = { title: "Edit Event" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const boundUpdateEvent = updateEvent.bind(null, event.id);

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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Edit Event
          </h2>
          <p className="text-slate-400 text-sm mt-1 truncate max-w-sm">
            {event.title}
          </p>
        </div>
        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-shrink-0 mt-1">
          <PublishButton id={event.id} published={event.published} />
          <DeleteEventButton id={event.id} />
        </div>
      </div>

      {/* Status banner */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border ${
          event.published
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : "bg-slate-800/50 border-slate-700/40 text-slate-400"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            event.published ? "bg-emerald-400" : "bg-slate-500"
          }`}
        />
        {event.published
          ? "This event is published and visible to the public."
          : "This event is a draft — only visible to admins."}
      </div>

      {/* Form card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800/80 p-6">
        <EventForm
          action={boundUpdateEvent}
          defaultValues={event}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
