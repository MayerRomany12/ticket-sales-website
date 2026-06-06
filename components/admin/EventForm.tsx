"use client";

import { useActionState } from "react";
import type { EventFormState } from "@/lib/validations/event";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all duration-200";

const labelCls = "block text-sm font-medium text-slate-300 mb-1.5";
const errorCls = "text-red-400 text-xs mt-1";

interface DefaultValues {
  title?: string;
  description?: string;
  image?: string | null;
  location?: string;
  date?: Date;
  price?: number;
  capacity?: number;
}

interface EventFormProps {
  action: (
    prevState: EventFormState,
    formData: FormData
  ) => Promise<EventFormState>;
  defaultValues?: DefaultValues;
  submitLabel?: string;
}

function formatDatetimeLocal(date: Date): string {
  // Converts a Date to the "yyyy-MM-ddTHH:mm" format required by datetime-local input
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EventForm({
  action,
  defaultValues,
  submitLabel = "Save Event",
}: EventFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  const dateValue = defaultValues?.date
    ? formatDatetimeLocal(new Date(defaultValues.date))
    : "";

  return (
    <form action={formAction} className="space-y-5">
      {/* Global error */}
      {state.errors?._form && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {state.errors._form[0]}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="ev-title" className={labelCls}>
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="ev-title"
          name="title"
          type="text"
          placeholder="e.g. Summer Music Festival"
          defaultValue={defaultValues?.title ?? ""}
          className={inputCls}
        />
        {state.errors?.title && (
          <p className={errorCls}>{state.errors.title[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="ev-description" className={labelCls}>
          Description <span className="text-red-400">*</span>
        </label>
        <Textarea
          id="ev-description"
          name="description"
          rows={4}
          placeholder="Describe your event…"
          defaultValue={defaultValues?.description ?? ""}
          className={`${inputCls} min-h-[100px] resize-y`}
        />
        {state.errors?.description && (
          <p className={errorCls}>{state.errors.description[0]}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="ev-location" className={labelCls}>
          Location <span className="text-red-400">*</span>
        </label>
        <input
          id="ev-location"
          name="location"
          type="text"
          placeholder="e.g. Cairo, Egypt"
          defaultValue={defaultValues?.location ?? ""}
          className={inputCls}
        />
        {state.errors?.location && (
          <p className={errorCls}>{state.errors.location[0]}</p>
        )}
      </div>

      {/* Date + Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="ev-date" className={labelCls}>
            Date &amp; Time <span className="text-red-400">*</span>
          </label>
          <input
            id="ev-date"
            name="date"
            type="datetime-local"
            defaultValue={dateValue}
            className={`${inputCls} [color-scheme:dark]`}
          />
          {state.errors?.date && (
            <p className={errorCls}>{state.errors.date[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="ev-price" className={labelCls}>
            Price ($) <span className="text-red-400">*</span>
          </label>
          <input
            id="ev-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            defaultValue={defaultValues?.price ?? ""}
            className={inputCls}
          />
          {state.errors?.price && (
            <p className={errorCls}>{state.errors.price[0]}</p>
          )}
        </div>
      </div>

      {/* Capacity */}
      <div className="sm:w-1/2">
        <label htmlFor="ev-capacity" className={labelCls}>
          Capacity <span className="text-red-400">*</span>
        </label>
        <input
          id="ev-capacity"
          name="capacity"
          type="number"
          min="1"
          step="1"
          placeholder="100"
          defaultValue={defaultValues?.capacity ?? ""}
          className={inputCls}
        />
        {state.errors?.capacity && (
          <p className={errorCls}>{state.errors.capacity[0]}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="ev-image" className={labelCls}>
          Image URL{" "}
          <span className="text-slate-500 font-normal">(optional)</span>
        </label>
        <input
          id="ev-image"
          name="image"
          type="url"
          placeholder="https://example.com/image.jpg"
          defaultValue={defaultValues?.image ?? ""}
          className={inputCls}
        />
        {state.errors?.image && (
          <p className={errorCls}>{state.errors.image[0]}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          id="ev-submit"
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
