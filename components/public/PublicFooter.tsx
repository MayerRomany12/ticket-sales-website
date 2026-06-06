export function PublicFooter() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/50 py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} TicketVault MVP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
