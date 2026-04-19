export const metadata = { title: "Adatkezelési tájékoztató" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24 prose-content">
      <div className="mb-10 p-4 border border-sale/30 bg-sale/5 text-xs text-sale leading-relaxed">
        <strong>⚠️ Template</strong> — az alábbi szöveg szakmai sablon, a <code>[CSERÉLD KI]</code> jelöléseket
        éles használat előtt a valós cégadatokra kell cserélni. A dokumentum magyar jog (GDPR, Info.tv.,
        Ektv.) alapján készült, de éles ügyféllel mindenképp ügyvédi átnézést javaslunk.
      </div>

      <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
        Jogi információ
      </div>
      <h1 className="font-display text-4xl md:text-5xl mb-2">Adatkezelési tájékoztató</h1>
      <p className="text-sm text-muted">
        Hatályos: 2026. április 1. napjától · Verzió 1.0
      </p>

      <Section n="1." title="Az Adatkezelő">
        <p>
          <strong>Cégnév:</strong> Aetheris Kft. [CSERÉLD KI]<br />
          <strong>Székhely:</strong> 1051 Budapest, Október 6. utca 12. [CSERÉLD KI]<br />
          <strong>Cégjegyzékszám:</strong> 01-09-999999 [CSERÉLD KI]<br />
          <strong>Adószám:</strong> 99999999-2-41 [CSERÉLD KI]<br />
          <strong>Képviselő:</strong> [CSERÉLD KI — ügyvezető neve]<br />
          <strong>Bejegyző bíróság:</strong> Fővárosi Törvényszék Cégbírósága [CSERÉLD KI]<br />
          <strong>E-mail:</strong> info@aetheris.hu<br />
          <strong>Telefon:</strong> +36 30 525 2336<br />
          <strong>Weboldal:</strong> https://webaruhaz-gamma.vercel.app<br />
          <strong>NAIH regisztrációs szám:</strong> nem kötelező (GDPR alapján nem szükséges)
        </p>
      </Section>

      <Section n="2." title="Tárhelyszolgáltatók és adatfeldolgozók">
        <p>
          Az Adatkezelő az alábbi adatfeldolgozókat veszi igénybe a szolgáltatás
          nyújtásához:
        </p>
        <ul>
          <li>
            <strong>Vercel Inc.</strong> (weboldal tárhely) — 340 S Lemon Ave
            #4133, Walnut, CA 91789, USA. Alapja: GDPR 46. cikk (Standard Contractual
            Clauses).
          </li>
          <li>
            <strong>Supabase Inc.</strong> (adatbázis, képtárhely, hitelesítés) —
            970 Toa Payoh N #07-04, Singapore 318992. Az adatok fizikai tárolása:
            Frankfurt, EU (eu-central-1 régió).
          </li>
          <li>
            <strong>Meta Platforms Ireland Ltd.</strong> (WhatsApp üzenetek rendelés
            visszaigazolásához) — 4 Grand Canal Square, Dublin, Írország.
          </li>
          <li>
            <strong>Google LLC</strong> (Google Fonts betöltése, Google Maps
            megjelenítése a kapcsolat oldalon) — 1600 Amphitheatre Pkwy, Mountain
            View, CA 94043, USA.
          </li>
          <li>
            <strong>GLS General Logistics Systems Hungary Kft.</strong> (szállítás) —
            2351 Alsónémedi, GLS Európa utca 2. [CSERÉLD KI ha más futár]
          </li>
        </ul>
      </Section>

      <Section n="3." title="A kezelt személyes adatok">
        <table>
          <thead>
            <tr>
              <th>Kör</th>
              <th>Kezelt adat</th>
              <th>Cél</th>
              <th>Jogalap (GDPR 6. cikk)</th>
              <th>Megőrzési idő</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Vásárlás (rendelés)</td>
              <td>Név, telefonszám, e-mail, szállítási cím, megrendelés részletei</td>
              <td>Szerződés teljesítése, kiszállítás</td>
              <td>(1)(b) szerződés teljesítése</td>
              <td>8 év (számviteli tv. 169. §)</td>
            </tr>
            <tr>
              <td>Számlázás</td>
              <td>Vevő név, cím, adószám (ha cég)</td>
              <td>Számlakiállítás, NAV adatszolgáltatás</td>
              <td>(1)(c) jogi kötelezettség (Sztv. 166. §)</td>
              <td>8 év</td>
            </tr>
            <tr>
              <td>Hírlevél feliratkozás</td>
              <td>E-mail cím, név (opcionális)</td>
              <td>Direkt marketing közlések</td>
              <td>(1)(a) hozzájárulás</td>
              <td>Visszavonásig</td>
            </tr>
            <tr>
              <td>Kapcsolatfelvétel</td>
              <td>Név, e-mail, üzenet tartalma</td>
              <td>Válaszadás</td>
              <td>(1)(f) jogos érdek</td>
              <td>6 hónap</td>
            </tr>
            <tr>
              <td>Analitika (hozzájárulás mellett)</td>
              <td>Anonimizált IP, böngésző, látogatás adatai</td>
              <td>Szolgáltatás fejlesztése</td>
              <td>(1)(a) hozzájárulás (cookie banner)</td>
              <td>13 hónap</td>
            </tr>
            <tr>
              <td>Kosár (localStorage)</td>
              <td>Kosár tartalma, kiválasztott nyelv</td>
              <td>Felhasználói élmény</td>
              <td>(1)(f) jogos érdek / szükséges cookie</td>
              <td>Kézi törlésig</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section n="4." title="Adattovábbítás harmadik országokba">
        <p>
          Egyes adatfeldolgozóink (Vercel, Supabase, Google, Meta) tevékenységük
          során USA-ba továbbíthatnak adatokat. Az adattovábbítás jogalapja a GDPR
          46. cikk (2)(c) pontja szerinti Európai Bizottság által elfogadott
          mintaszerződési feltételek (SCC), valamint a Data Privacy Framework
          keretrendszer.
        </p>
      </Section>

      <Section n="5." title="Az érintett jogai">
        <p>
          A GDPR alapján az alábbi jogok illetik meg Önt:
        </p>
        <ul>
          <li>
            <strong>Tájékoztatáshoz való jog</strong> (15. cikk) — lekérheti, milyen
            adatait kezeljük.
          </li>
          <li>
            <strong>Helyesbítéshez való jog</strong> (16. cikk) — javíttathatja a
            pontatlan adatait.
          </li>
          <li>
            <strong>Törléshez való jog</strong> (17. cikk, „elfeledtetés”) — kérheti
            adatainak törlését, kivéve ha jogszabály kötelező megőrzést ír elő
            (számlázási adatok).
          </li>
          <li>
            <strong>Korlátozáshoz való jog</strong> (18. cikk).
          </li>
          <li>
            <strong>Adathordozhatósághoz való jog</strong> (20. cikk) — adatait
            géppel olvasható formátumban elkérheti.
          </li>
          <li>
            <strong>Tiltakozáshoz való jog</strong> (21. cikk) — jogos érdeken
            alapuló adatkezelés ellen.
          </li>
          <li>
            <strong>Hozzájárulás visszavonásához való jog</strong> — bármikor, a
            korábbi adatkezelés jogszerűségének érintése nélkül.
          </li>
        </ul>
        <p>
          Bármelyik jog gyakorlásához írjon a <a href="mailto:info@aetheris.hu">info@aetheris.hu</a> címre.
          Kérését 30 napon belül teljesítjük, vagy elutasításának indokáról
          tájékoztatjuk.
        </p>
      </Section>

      <Section n="6." title="Adatbiztonság">
        <p>
          Az Adatkezelő a vonatkozó technikai és szervezési intézkedéseket
          megteszi: SSL/TLS titkosítás, jelszavak bcrypt hashelése, szerepkör-alapú
          hozzáférés (RLS), napi automatikus biztonsági mentések, rendszeres
          szoftverfrissítések. A személyes adatok harmadik fél számára szerződéses
          alapon, kizárólag az adott cél eléréséhez szükséges mértékben kerülnek
          átadásra.
        </p>
      </Section>

      <Section n="7." title="Sütik (cookie) használata">
        <p>
          Részletes sütileírás az oldal alján megjelenő sütibannerben található.
          Kategóriánként:
        </p>
        <ul>
          <li>
            <strong>Szükséges (mindig aktív):</strong> nyelvválasztás cookie
            („lunara-locale”), bejelentkezési sütik (Supabase Auth), kosár
            (localStorage „lunara-cart-v1”), cookie-hozzájárulás mentése
            („lunara-cookie-consent-v1”).
          </li>
          <li>
            <strong>Analitika (opcionális):</strong> jelenleg nem használunk, de a
            jövőben esetlegesen Vercel Analytics, Google Analytics 4 anonimizált
            beállítással.
          </li>
          <li>
            <strong>Marketing (opcionális):</strong> jelenleg nem használunk.
          </li>
        </ul>
        <p>
          A hozzájárulás bármikor módosítható a böngésző localStorage törlésével
          vagy a <a href="mailto:info@aetheris.hu">info@aetheris.hu</a> címen történő
          kapcsolatfelvétellel.
        </p>
      </Section>

      <Section n="8." title="Jogorvoslat">
        <p>
          Amennyiben Ön úgy ítéli meg, hogy az Adatkezelő tevékenysége sérti a
          személyes adatok védelméhez fűződő jogát, panasszal élhet:
        </p>
        <p>
          <strong>Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)</strong><br />
          Cím: 1055 Budapest, Falk Miksa utca 9-11.<br />
          Levelezési cím: 1363 Budapest, Pf.: 9.<br />
          Telefon: +36 1 391 1400<br />
          E-mail: ugyfelszolgalat@naih.hu<br />
          Weboldal: <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">www.naih.hu</a>
        </p>
        <p>
          Az érintett bírósági úton is érvényesítheti jogait. A per az érintett
          lakóhelye szerinti törvényszék előtt is megindítható.
        </p>
      </Section>

      <Section n="9." title="Változtatási jog">
        <p>
          Az Adatkezelő fenntartja a jogot a tájékoztató egyoldalú módosítására. A
          módosítás hatályba lépésének napjáról értesítést küldünk, illetve az új
          verzió az oldalon közzétételre kerül.
        </p>
      </Section>

      <style>{`
        .prose-content h2 { font-family: var(--font-playfair); font-size: 1.6rem; margin-top: 2.5rem; margin-bottom: 0.8rem; }
        .prose-content p { margin: 0.8rem 0; color: #6b6b6b; line-height: 1.7; font-size: 0.95rem; }
        .prose-content ul { margin: 0.8rem 0; padding-left: 1.2rem; color: #6b6b6b; font-size: 0.95rem; }
        .prose-content ul li { margin: 0.4rem 0; line-height: 1.6; }
        .prose-content a { text-decoration: underline; color: #0a0a0a; }
        .prose-content strong { color: #0a0a0a; font-weight: 600; }
        .prose-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; }
        .prose-content th { text-align: left; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.7rem; color: #6b6b6b; padding: 0.5rem; border-bottom: 1px solid #e5e0d7; font-weight: 500; }
        .prose-content td { padding: 0.6rem 0.5rem; border-bottom: 1px solid #e5e0d7; vertical-align: top; color: #3a3a3a; }
        .prose-content code { background: #F5F1EA; padding: 0 4px; font-family: var(--font-jetbrains); font-size: 0.82rem; }
      `}</style>
    </article>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2>{n} {title}</h2>
      {children}
    </section>
  );
}
