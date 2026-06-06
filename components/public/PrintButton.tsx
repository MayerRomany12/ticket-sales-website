"use client";

import { Download } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all"
    >
      <Download className="w-5 h-5" />
      Download / Print
    </button>
  );
}
