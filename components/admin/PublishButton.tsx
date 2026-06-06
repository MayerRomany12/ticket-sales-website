"use client";

import { useTransition } from "react";
import { togglePublish } from "@/app/actions/event";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface PublishButtonProps {
  id: string;
  published: boolean;
}

export function PublishButton({ id, published }: PublishButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await togglePublish(id, !published);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
        published
          ? "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-500/30"
          : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/30"
      }`}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : published ? (
        <EyeOff className="w-3.5 h-3.5" />
      ) : (
        <Eye className="w-3.5 h-3.5" />
      )}
      {isPending ? "…" : published ? "Unpublish" : "Publish"}
    </button>
  );
}
