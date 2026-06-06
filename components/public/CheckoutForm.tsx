"use client";

import { useActionState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/checkout";
import type { CheckoutState } from "@/app/actions/checkout";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200";
const labelCls = "block text-sm font-medium text-slate-300 mb-1.5";

interface CheckoutFormProps {
  eventId: string;
}

const initialState: CheckoutState = {};

export function CheckoutForm({ eventId }: CheckoutFormProps) {
  const [state, formAction, isPending] = useActionState(createCheckoutSession, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="eventId" value={eventId} />

      {state?.errors?._form && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {state.errors._form?.[0]}
        </div>
      )}

      <div>
        <label htmlFor="name" className={labelCls}>
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          required
          className={inputCls}
        />
        {state?.errors?.name && (
          <p className="text-red-400 text-xs mt-1">{state.errors.name?.[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>
          Email Address <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
          className={inputCls}
        />
        {state?.errors?.email && (
          <p className="text-red-400 text-xs mt-1">{state.errors.email?.[0]}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-base transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Processing..." : "Continue to Payment"}
        </button>
      </div>
    </form>
  );
}
