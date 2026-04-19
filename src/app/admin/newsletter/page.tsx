import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { Mail, Send } from "lucide-react";

export const revalidate = 0;

export default async function AdminNewsletterPage() {
  const sb = await supabaseServer();
  const [
    { data: subs, count: subsCount },
    { data: activeSubs, count: activeCount },
    { data: campaigns },
  ] = await Promise.all([
    sb
      .from("newsletter_subscribers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false }),
    sb
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .is("unsubscribed_at", null),
    sb
      .from("newsletter_campaigns")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-2">
            Hírlevél
          </div>
          <h1 className="font-display text-4xl md:text-5xl">Hírlevél</h1>
        </div>
        <Link
          href="/admin/newsletter/new"
          className="bg-ink text-white text-[11px] tracking-widest-2 uppercase px-6 py-3 flex items-center gap-2"
        >
          <Send size={14} strokeWidth={1.6} /> Új kampány
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Stat label="Összes feliratkozó" value={subsCount ?? 0} />
        <Stat label="Aktív feliratkozó" value={activeCount ?? 0} />
        <Stat label="Kiküldött kampány" value={campaigns?.length ?? 0} />
      </div>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="bg-white border border-line">
          <div className="px-5 py-4 border-b border-line flex items-center gap-2 text-[11px] tracking-widest-2 uppercase">
            <Mail size={14} strokeWidth={1.6} /> Feliratkozók
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {(subs ?? []).length === 0 ? (
              <div className="p-10 text-center text-sm text-muted">
                Még nincs feliratkozó.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] tracking-widest-2 uppercase text-muted border-b border-line">
                    <th className="p-4">Email</th>
                    <th className="p-4">Dátum</th>
                    <th className="p-4">Státusz</th>
                  </tr>
                </thead>
                <tbody>
                  {(subs ?? []).map((s: { id: string; email: string; created_at: string; unsubscribed_at: string | null }) => (
                    <tr key={s.id} className="border-b border-line last:border-0">
                      <td className="p-4">{s.email}</td>
                      <td className="p-4 text-xs text-muted">
                        {new Date(s.created_at).toLocaleDateString("hu-HU")}
                      </td>
                      <td className="p-4">
                        {s.unsubscribed_at ? (
                          <span className="text-[10px] tracking-widest-2 uppercase text-muted">
                            Leiratkozott
                          </span>
                        ) : (
                          <span className="text-[10px] tracking-widest-2 uppercase text-green-700">
                            Aktív
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white border border-line">
          <div className="px-5 py-4 border-b border-line text-[11px] tracking-widest-2 uppercase">
            Kampányok
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {(campaigns ?? []).length === 0 ? (
              <div className="p-10 text-center text-sm text-muted">
                Még nincs kampány.
              </div>
            ) : (
              <ul>
                {(campaigns ?? []).map(
                  (c: { id: string; subject: string; status: string; recipients_count: number; sent_at: string | null; created_at: string }) => (
                    <li key={c.id} className="p-5 border-b border-line last:border-0">
                      <div className="font-display text-base">{c.subject}</div>
                      <div className="mt-1 text-xs text-muted flex gap-3">
                        <span>
                          {c.sent_at
                            ? new Date(c.sent_at).toLocaleString("hu-HU")
                            : new Date(c.created_at).toLocaleString("hu-HU")}
                        </span>
                        <span className="text-[10px] tracking-widest-2 uppercase">
                          {c.status === "sent"
                            ? `✓ ${c.recipients_count} címzett`
                            : c.status === "draft"
                            ? "Piszkozat"
                            : c.status}
                        </span>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-line p-5">
      <div className="text-[10px] tracking-widest-2 uppercase text-muted">{label}</div>
      <div className="font-display text-4xl mt-2">{value}</div>
    </div>
  );
}
