"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { saveCoupon, deleteCoupon, CouponInput } from "./actions";

export default function CouponForm({
  mode,
  initial,
}: {
  mode: "new" | "edit";
  initial: CouponInput & { id?: string | null; uses_count?: number };
}) {
  const [state, setState] = useState<CouponInput>(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      try { await saveCoupon(initial.id ?? null, state); }
      catch (e) { setError((e as Error).message); }
    });
  };

  const remove = () => {
    if (!initial.id || !confirm("Biztosan törlöd a kupont?")) return;
    start(async () => {
      try { await deleteCoupon(initial.id as string); }
      catch (e) { setError((e as Error).message); }
    });
  };

  const expiresInput = state.expires_at ? state.expires_at.slice(0, 10) : "";

  return (
    <form onSubmit={submit} className="max-w-2xl bg-white border border-line p-6 md:p-8 space-y-6">
      <div>
        <Label>Kuponkód (ügyfél ezt írja be) — automatikusan NAGYBETŰS lesz</Label>
        <input
          required
          value={state.code}
          onChange={(e) => setState({ ...state, code: e.target.value.toUpperCase() })}
          placeholder="pl. TAVASZ10"
          className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm font-mono tracking-widest-2 uppercase"
          maxLength={32}
        />
      </div>

      <div>
        <Label>Leírás (opcionális — admin belső célra)</Label>
        <input
          value={state.description}
          onChange={(e) => setState({ ...state, description: e.target.value })}
          placeholder="pl. Első vásárlók — 10% kedvezmény"
          className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Kedvezmény típusa</Label>
          <select
            value={state.discount_type}
            onChange={(e) => setState({ ...state, discount_type: e.target.value as "percent" | "fixed" })}
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
          >
            <option value="percent">Százalékos (%)</option>
            <option value="fixed">Fix összeg (Ft)</option>
          </select>
        </div>
        <div>
          <Label>
            {state.discount_type === "percent" ? "Százalék (1-100)" : "Összeg Ft-ban"}
          </Label>
          <input
            type="number"
            required
            min={1}
            max={state.discount_type === "percent" ? 100 : undefined}
            value={state.discount_value}
            onChange={(e) => setState({ ...state, discount_value: Number(e.target.value) })}
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm font-mono"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Minimum rendelési érték (Ft, 0 = nincs)</Label>
          <input
            type="number"
            min={0}
            value={state.min_order}
            onChange={(e) => setState({ ...state, min_order: Number(e.target.value) })}
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm font-mono"
          />
        </div>
        <div>
          <Label>Max. felhasználási szám (üres = korlátlan)</Label>
          <input
            type="number"
            min={0}
            value={state.max_uses ?? ""}
            onChange={(e) => setState({ ...state, max_uses: e.target.value ? Number(e.target.value) : null })}
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm font-mono"
          />
        </div>
      </div>

      <div>
        <Label>Lejárat dátuma (üres = soha)</Label>
        <input
          type="date"
          value={expiresInput}
          onChange={(e) =>
            setState({
              ...state,
              expires_at: e.target.value ? new Date(e.target.value).toISOString() : null,
            })
          }
          className="border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm font-mono"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={state.active}
          onChange={(e) => setState({ ...state, active: e.target.checked })}
          className="accent-ink"
        />
        <span className="text-sm">Aktív (ügyfél használhatja)</span>
      </label>

      {mode === "edit" && typeof initial.uses_count === "number" && (
        <div className="bg-bone p-3 text-xs text-muted">
          Eddig <strong>{initial.uses_count}</strong>× használták.
        </div>
      )}

      {error && <div className="text-xs text-sale border border-sale/30 bg-sale/5 px-3 py-2">{error}</div>}

      <div className="flex items-center gap-3 pt-4 border-t border-line">
        <button type="submit" disabled={pending} className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-6 py-3 disabled:opacity-60">
          {pending ? "…" : "Mentés"}
        </button>
        <Link href="/admin/coupons" className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink">Mégse</Link>
        {mode === "edit" && (
          <button type="button" onClick={remove} className="ml-auto text-[11px] tracking-widest-2 uppercase text-sale hover:opacity-60 flex items-center gap-1">
            <Trash2 size={14} strokeWidth={1.4} /> Törlés
          </button>
        )}
      </div>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-1">{children}</div>;
}
