"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginForm({
  labels,
}: {
  labels: { email: string; password: string; signIn: string; backToSite: string };
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const sb = supabaseBrowser();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect") || "/admin";
    window.location.href = redirect;
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block">
        <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">
          {labels.email}
        </div>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent"
        />
      </label>
      <label className="block">
        <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">
          {labels.password}
        </div>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent"
        />
      </label>
      {error && (
        <div className="text-xs text-sale border border-sale/30 bg-sale/5 px-3 py-2">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink text-white text-[11px] tracking-widest-2 uppercase py-4 disabled:opacity-60"
      >
        {loading ? "…" : labels.signIn}
      </button>
      <div className="text-center">
        <Link
          href="/"
          className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink"
        >
          {labels.backToSite}
        </Link>
      </div>
    </form>
  );
}
