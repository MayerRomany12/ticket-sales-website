import Link from "next/link";
import { Ticket } from "lucide-react";

export function PublicNav() {
  return (
    <nav className="fixed top-0 inset-x-0 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 z-50">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            TicketVault
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/events"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
