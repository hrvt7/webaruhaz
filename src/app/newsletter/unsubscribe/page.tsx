import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = { title: "Leiratkozás" };

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t: token } = await searchParams;
  let ok = false;
  let email: string | null = null;

  if (token) {
    const sb = await supabaseServer();
    const { data } = await sb
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("unsubscribe_token", token)
      .is("unsubscribed_at", null)
      .select("email")
      .maybeSingle();
    if (data) {
      ok = true;
      email = data.email;
    }
  }

  return (
    <section className="min-h-[60vh] grid place-items-center px-6 py-16">
      <div className="max-w-xl text-center">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
          Hírlevél
        </div>
        <h1 className="font-display text-4xl md:text-5xl">
          {ok ? "Sikeres leiratkozás" : "Nem található feliratkozás"}
        </h1>
        <p className="mt-5 text-muted leading-relaxed">
          {ok
            ? `A(z) ${email} email cím leiratkozott a hírlevelünkről. Sajnáljuk, hogy elmész — bármikor visszatérhetsz a főoldalon keresztül.`
            : "A leiratkozási link érvénytelen vagy már használatban volt. Ha segítségre van szükséged, írj az info@aetheris.hu címre."}
        </p>
        <Link
          href="/"
          className="inline-block mt-10 bg-ink text-white text-[11px] tracking-widest-2 uppercase px-8 py-4"
        >
          Vissza a boltba
        </Link>
      </div>
    </section>
  );
}
