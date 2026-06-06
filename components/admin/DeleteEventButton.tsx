"use client";

import { useTransition } from "react";
import { deleteEvent } from "@/app/actions/event";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteEventButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    )
      return;

    startTransition(async () => {
      await deleteEvent(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
