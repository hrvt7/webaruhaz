"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { savePickupLocation, deletePickupLocation, PickupLocationInput } from "./actions";

export default function PickupForm({
  mode,
  initial,
}: {
  mode: "new" | "edit";
  initial: PickupLocationInput & { id?: string | null };
}) {
  const [state, setState] = useState<PickupLocationInput>(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    start(async () => {
      try { await savePickupLocation(initial.id ?? null, state); }
      catch (e) { setError((e as Error).message); }
    });
  };

  const remove = () => {
    if (!initial.id || !confirm("Biztosan törlöd ezt az átvételi pontot?")) return;
    start(async () => {
      try { await deletePickupLocation(initial.id as string); }
      catch (e) { setError((e as Error).message); }
    });
  };

  return (
    <form onSubmit={submit} className="max-w-2xl bg-white border border-line p-6 md:p-8 space-y-6">
      <div>
        <Label>Bolt név (vevő ezt látja a kosárban)</Label>
        <input
          required
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          placeholder="pl. Aetheris Szombathely"
          className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Cím (utca + házszám)</Label>
          <input
            required
            value={state.address}
            onChange={(e) => setState({ ...state, address: e.target.value })}
            placeholder="pl. Király utca 9."
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
          />
        </div>
        <div>
          <Label>Város</Label>
          <input
            required
            value={state.city}
            onChange={(e) => setState({ ...state, city: e.target.value })}
            placeholder="Szombathely"
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
          />
        </div>
        <div>
          <Label>Irányítószám</Label>
          <input
            value={state.postcode ?? ""}
            onChange={(e) => setState({ ...state, postcode: e.target.value || null })}
            placeholder="9700"
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm font-mono"
            maxLength={10}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Telefon (opcionális)</Label>
          <input
            type="tel"
            value={state.phone ?? ""}
            onChange={(e) => setState({ ...state, phone: e.target.value || null })}
            placeholder="+36 30 123 4567"
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm"
          />
        </div>
        <div>
          <Label>Sorrend (kisebb = előrébb a listában)</Label>
          <input
            type="number"
            value={state.sort_order}
            onChange={(e) => setState({ ...state, sort_order: Number(e.target.value) })}
            className="w-full border-b border-line focus:border-ink py-2 outline-none bg-transparent text-sm font-mono"
          />
        </div>
      </div>

      <div>
        <Label>Nyitvatartás (több sor is lehet)</Label>
        <textarea
          rows={3}
          value={state.hours ?? ""}
          onChange={(e) => setState({ ...state, hours: e.target.value || null })}
          placeholder={"H–P: 10:00–18:00\nSzo: 10:00–13:00"}
          className="w-full border border-line focus:border-ink p-3 outline-none bg-transparent text-sm whitespace-pre-line"
        />
      </div>

      <div>
        <Label>Megjegyzés (pl. bejárat, parkolás — opcionális)</Label>
        <textarea
          rows={2}
          value={state.notes ?? ""}
          onChange={(e) => setState({ ...state, notes: e.target.value || null })}
          className="w-full border border-line focus:border-ink p-3 outline-none bg-transparent text-sm"
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={state.active}
          onChange={(e) => setState({ ...state, active: e.target.checked })}
          className="accent-ink"
        />
        <span className="text-sm">Aktív (vevő választhatja a kosárban)</span>
      </label>

      {error && <div className="text-xs text-sale border border-sale/30 bg-sale/5 px-3 py-2">{error}</div>}

      <div className="flex items-center gap-3 pt-4 border-t border-line">
        <button type="submit" disabled={pending} className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-6 py-3 disabled:opacity-60">
          {pending ? "…" : "Mentés"}
        </button>
        <Link href="/admin/pickup-locations" className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink">Mégse</Link>
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
