"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { updateOrderStatus } from "./actions";

type Item = {
  name: string;
  price: number;
  qty: number;
  size: string;
  color: string;
};

export default function OrderRow({
  order,
  labels,
}: {
  order: {
    id: string;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string;
    customer_address: string | null;
    note: string | null;
    items: Item[];
    subtotal: number;
    status: string;
    created_at: string;
  };
  labels: { status: string; statusOptions: { value: string; label: string }[] };
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [, start] = useTransition();

  const update = (v: string) => {
    setStatus(v);
    start(() => updateOrderStatus(order.id, v));
  };

  return (
    <>
      <tr className="border-b border-line">
        <td className="p-3">
          <button
            onClick={() => setOpen(!open)}
            className="h-7 w-7 grid place-items-center hover:bg-bone"
          >
            {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        </td>
        <td className="p-4">
          <div>{order.customer_name}</div>
          <div className="text-xs text-muted">
            {order.customer_email && <>{order.customer_email}<br /></>}
            {order.customer_phone}
          </div>
        </td>
        <td className="p-4 text-xs text-muted">
          {new Date(order.created_at).toLocaleString()}
        </td>
        <td className="p-4 price font-mono">
          {new Intl.NumberFormat("hu-HU").format(order.subtotal)} Ft
        </td>
        <td className="p-4">
          <select
            value={status}
            onChange={(e) => update(e.target.value)}
            className="bg-transparent border border-line px-2 py-1 text-xs uppercase tracking-widest-2"
          >
            {labels.statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {open && (
        <tr className="bg-bone">
          <td />
          <td colSpan={4} className="p-6">
            <div className="grid md:grid-cols-[1fr_1fr] gap-6 text-sm">
              <div>
                <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-2">
                  Szállítási cím
                </div>
                <div className="whitespace-pre-line">
                  {order.customer_address || "—"}
                </div>
                {order.note && (
                  <div className="mt-4">
                    <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-2">
                      Megjegyzés
                    </div>
                    <div>{order.note}</div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-[10px] tracking-widest-2 uppercase text-muted mb-2">
                  Tételek
                </div>
                <ul className="space-y-1 price font-mono text-xs">
                  {order.items.map((i, idx) => (
                    <li key={idx}>
                      • {i.name} — {i.color}, {i.size} ×{i.qty} —{" "}
                      {new Intl.NumberFormat("hu-HU").format(i.price * i.qty)} Ft
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
