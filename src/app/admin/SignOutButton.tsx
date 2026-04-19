"use client";

import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignOutButton({ label }: { label: string }) {
  const signOut = async () => {
    const sb = supabaseBrowser();
    await sb.auth.signOut();
    window.location.href = "/admin/login";
  };
  return (
    <button
      onClick={signOut}
      className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
    >
      {label}
    </button>
  );
}
