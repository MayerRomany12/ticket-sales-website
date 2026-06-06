"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      id="admin-sign-out"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
    >
      <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
      Sign out
    </button>
  );
}
