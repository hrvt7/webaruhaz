"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction } from "./actions";

export default function LoginForm({
  labels,
}: {
  labels: { email: string; password: string; signIn: string; backToSite: string };
}) {
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirect" value={redirect} />
      <label className="block">
        <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">
          {labels.email}
        </div>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue=""
          className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent"
        />
      </label>
      <label className="block">
        <div className="text-[11px] tracking-widest-2 uppercase text-muted mb-1">
          {labels.password}
        </div>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue=""
          className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent"
        />
      </label>
      {state?.error && (
        <div className="text-xs text-sale border border-sale/30 bg-sale/5 px-3 py-2">
          {state.error}
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink text-white text-[11px] tracking-widest-2 uppercase py-4 disabled:opacity-60"
      >
        {pending ? "..." : labels.signIn}
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
