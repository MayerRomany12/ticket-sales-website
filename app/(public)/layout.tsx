import { ReactNode } from "react";
import { PublicNav } from "@/components/public/PublicNav";
import { PublicFooter } from "@/components/public/PublicFooter";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <PublicNav />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
