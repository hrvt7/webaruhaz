export const metadata = { title: "ÁSZF" };

export default function AszfPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24 prose-content">
      <div className="mb-10 p-4 border border-sale/30 bg-sale/5 text-xs text-sale leading-relaxed">
        <strong>⚠️ Template</strong> — az alábbi szöveg szakmai sablon a 45/2014. (II. 26.)
        Korm. rendelet és a Ptk. szerint. A <code>[CSERÉLD KI]</code> jelölt helyeket
        éles használat előtt a valós cégadatokra kell cserélni. Éles ügyféllel mindenképp
        ügyvédi ellenőrzést javaslunk.
      </div>

      <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-3">
        Jogi információ
      </div>
      <h1 className="font-display text-4xl md:text-5xl mb-2">
        Általános Szerződési Feltételek
      </h1>
      <p className="text-sm text-muted">
        Hatályos: 2026. április 1. napjától · Verzió 1.0
      </p>

      <Section n="1." title="A Szolgáltató adatai">
        <p>
          <strong>Cégnév:</strong> Aetheris Kft. [CSERÉLD KI]<br />
          <strong>Székhely:</strong> 1051 Budapest, Október 6. utca 12. [CSERÉLD KI]<br />
          <strong>Cégjegyzékszám:</strong> 01-09-999999 [CSERÉLD KI]<br />
          <strong>Bejegyző bíróság:</strong> Fővárosi Törvényszék Cégbírósága [CSERÉLD KI]<br />
          <strong>Adószám:</strong> 99999999-2-41 [CSERÉLD KI]<br />
          <strong>Közösségi adószám:</strong> HU99999999 [CSERÉLD KI]<br />
          <strong>Bankszámlaszám:</strong> [CSERÉLD KI — IBAN]<br />
          <strong>Képviselő:</strong> [CSERÉLD KI — ügyvezető neve]<br />
          <strong>E-mail:</strong> info@aetheris.hu<br />
          <strong>Telefon:</strong> +36 30 525 2336<br />
          <strong>Weboldal:</strong> https://webaruhaz-gamma.vercel.app
        </p>
      </Section>

      <Section n="2." title="Tárhelyszolgáltató adatai">
        <p>
          <strong>Cégnév:</strong> Vercel Inc.<br />
          <strong>Cím:</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
          <strong>E-mail:</strong> privacy@vercel.com<br />
          <strong>Weboldal:</strong> https://vercel.com
        </p>
        <p>
          Az Szolgáltató adatbázis- és képtárhely-szolgáltatója: <strong>Supabase Inc.</strong>
          (970 Toa Payoh N #07-04, Singapore 318992), fizikai adatközpont: Frankfurt, EU.
        </p>
      </Section>

      <Section n="3." title="Alapvető rendelkezések">
        <p>
          A jelen ÁSZF a Szolgáltató által a weboldalán nyújtott elektronikus
          kereskedelmi szolgáltatásokat igénybe vevő Megrendelő („Vevő”) jogait és
          kötelezettségeit tartalmazza. A Szerződő Felek között elektronikus úton
          létrejött szerződést a Szolgáltató nem iktatja, kizárólag magyar nyelven
          áll rendelkezésre. A Szolgáltató magatartási kódex rendelkezéseinek nem
          veti alá magát.
        </p>
        <p>
          A szerződéskötés nyelve: magyar. A Szolgáltatóval való jogviszonyra a
          magyar jog irányadó.
        </p>
      </Section>

      <Section n="4." title="A megvásárolható termékek köre">
        <p>
          A weboldalon a Szolgáltató által forgalmazott divatcikkek — női és
          férfi ruházat, cipő, kiegészítők — szerepelnek. A termékek mellett
          feltüntetett árak forintban (Ft) értendők, az ÁFA-t tartalmazzák. A
          feltüntetett árak nem minősülnek kötelező érvényű ajánlattételnek; a
          Szolgáltató fenntartja az árváltoztatás jogát a rendelés leadása előtt.
        </p>
        <p>
          Amennyiben a weboldalon nyilvánvaló hibás ár (pl. közismerten elfogadott,
          valószerűtlen vagy nyomdahibából eredő ár) jelenik meg, a Szolgáltató nem
          köteles a terméket a hibás áron értékesíteni, hanem ajánlhatja a helyes
          áron történő kiszállítást, amelynek ismeretében a Vevő elállhat a
          rendeléstől.
        </p>
      </Section>

      <Section n="5." title="A rendelés menete">
        <p>
          A termék kiválasztása után a méret és szín megadásával a „Kosárba”
          gombbal a terméket a virtuális kosárba helyezi. A kosár tartalma a
          rendelés véglegesítéséig módosítható.
        </p>
        <p>
          A „Rendelés leadása” gombra kattintva a rendszer a megadott adatokat
          (név, telefonszám, szállítási cím, megjegyzés) egy WhatsApp üzenet formájában
          továbbítja a Szolgáltatónak. A rendelés a Szolgáltató visszaigazolása
          után — legkésőbb a rendelés leadását követő 48 órán belül — válik
          érvényes szerződéssé. Ha a visszaigazolás 48 órán belül nem érkezik meg,
          a Vevő mentesül az ajánlati kötöttség alól.
        </p>
      </Section>

      <Section n="6." title="Fizetési módok">
        <ul>
          <li>
            <strong>Utánvét</strong> — kiszállításkor készpénzben vagy bankkártyával a
            futárnak. [CSERÉLD KI/BŐVÍTSD — kapható-e?]
          </li>
          <li>
            <strong>Előreutalás</strong> — a visszaigazolásban közölt számlaszámra, a
            teljesítés az összeg beérkezését követően indul.
          </li>
          <li>
            <strong>Online bankkártyás fizetés</strong> — hamarosan elérhető
            (SimplePay/Stripe integráció kiépítés alatt). [CSERÉLD KI, ha élesíted]
          </li>
        </ul>
      </Section>

      <Section n="7." title="Szállítási feltételek">
        <p>
          A Szolgáltató a megrendeléseket Magyarország területére postai
          csomagként (GLS) szállítja. Szállítási díj: 1.690 Ft, 30.000 Ft feletti
          rendelésnél ingyenes. A szállítási idő 1–3 munkanap. EU-n belüli
          kiszállítás egyedi egyeztetés alapján, 6.900 Ft átalány díjjal, 3–5
          munkanap.
        </p>
        <p>
          A termékkel kapcsolatos reklamációt a csomag átvételekor, lehetőség
          szerint a futár jelenlétében kell jegyzőkönyvben rögzíttetni.
        </p>
      </Section>

      <Section n="8." title="Elállási jog">
        <p>
          A 45/2014. (II. 26.) Korm. rendelet alapján a Vevő a szerződéstől a
          termék átvételétől számított <strong>14 naptári napon belül indokolás
          nélkül elállhat</strong>. Az elállási jogát a Vevő a Szolgáltató felé
          írásban (e-mail: info@aetheris.hu) köteles jelezni. Az elállási
          nyilatkozat mintáját a rendelet 2. melléklete tartalmazza.
        </p>
        <p>
          A Vevő az elállási jogát a szerződés megkötésének napja és a termék
          átvételének napja közötti időszakban is gyakorolhatja. A terméket az
          elállás bejelentésétől számított 14 napon belül kell visszaküldenie a
          Szolgáltató címére. A visszaküldés költsége a Vevőt terheli, kivéve, ha
          a Szolgáltató vállalta ezt.
        </p>
        <p>
          A Szolgáltató a visszaküldött termék kézhezvételétől számított 14 napon
          belül visszautalja a Vevő által megfizetett teljes összeget — beleértve a
          szállítási díjat is (kivéve, ha a Vevő a legkevésbé költséges szállítási
          módtól eltérőt választott). A visszatérítés ugyanazzal a fizetési
          móddal történik, mint az eredeti ügylet.
        </p>
        <p>
          <strong>Elállási jog korlátai:</strong>
        </p>
        <ul>
          <li>
            Higiéniai okokból lezárt csomagolású termék — ha a csomagolást a Vevő
            az átvétel után felbontotta, nem vehető vissza.
          </li>
          <li>
            Egyedi megrendelésre készült, vagy a Vevő személyéhez kötött, egyedileg
            szabott termék.
          </li>
          <li>Romlandó vagy minőségét rövid ideig megőrző termék.</li>
        </ul>
      </Section>

      <Section n="9." title="Szavatosság és jótállás">
        <p>
          A Szolgáltató minden terméke mögött <strong>2 év kellékszavatosságot</strong>
          vállal a Ptk. rendelkezései szerint. Kellékszavatossági igénye érvényesítése
          során a Vevő kérheti: kijavítást, kicserélést, árleszállítást, vagy végső
          esetben elállhat a szerződéstől.
        </p>
        <p>
          Termékszavatosság: a gyártóval szemben 2 évig érvényesíthető igény.
        </p>
        <p>
          A Szolgáltató a kifejezetten jótállásra kötelezett termékek esetén (ha
          ilyen termék kerül forgalomba, pl. tartós fogyasztási cikk) a 151/2003.
          (IX. 22.) Korm. rendelet szerint jótáll.
        </p>
      </Section>

      <Section n="10." title="Panaszkezelés">
        <p>
          A Vevő panaszát írásban (info@aetheris.hu) nyújthatja be. A Szolgáltató a
          panaszt legkésőbb annak beérkezésétől számított <strong>30 napon
          belül</strong> írásban megválaszolja. A panasz elutasítása esetén a
          Szolgáltató írásban indokolja döntését.
        </p>
      </Section>

      <Section n="11." title="Békéltető testület és vitarendezés">
        <p>
          Ha a Vevő a panaszára nem kap kielégítő választ, az alábbi szervekhez
          fordulhat:
        </p>
        <p>
          <strong>Budapesti Békéltető Testület</strong><br />
          Cím: 1016 Budapest, Krisztina krt. 99.<br />
          Telefon: +36 1 488 2131<br />
          E-mail: bekelteto.testulet@bkik.hu<br />
          Web:{" "}
          <a href="https://bekeltet.bkik.hu" target="_blank" rel="noopener noreferrer">
            bekeltet.bkik.hu
          </a>
        </p>
        <p>
          <strong>Online vitarendezési platform</strong> (EU):{" "}
          <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">
            ec.europa.eu/odr
          </a>
        </p>
        <p>
          <strong>Fogyasztóvédelmi hatóság:</strong>{" "}
          <a href="https://fogyasztovedelem.kormany.hu" target="_blank" rel="noopener noreferrer">
            fogyasztovedelem.kormany.hu
          </a>
        </p>
      </Section>

      <Section n="12." title="Szerzői jog">
        <p>
          A weboldalon szereplő valamennyi tartalom — szövegek, grafikák, képek,
          logók, elrendezés — a Szolgáltató szellemi tulajdonát képezi. A
          tartalom bármely részének engedély nélküli felhasználása, másolása,
          terjesztése szerzői jogi és polgári jogi eljárás megindítását vonja maga
          után.
        </p>
      </Section>

      <Section n="13." title="Egyéb rendelkezések">
        <p>
          A jelen ÁSZF-ben nem szabályozott kérdésekben a Ptk., a 45/2014. (II.
          26.) Korm. rendelet, a 2001. évi CVIII. törvény (Ektv.), a 2011. évi CXII.
          törvény (Info.tv.), valamint az Európai Parlament és a Tanács (EU)
          2016/679. rendelete (GDPR) rendelkezései az irányadók.
        </p>
        <p>
          A Szolgáltató fenntartja az ÁSZF egyoldalú módosításának jogát. Az ÁSZF
          módosítása a weboldalon való közzététel napján lép hatályba; a már
          leadott rendelésekre a leadás napján érvényes ÁSZF vonatkozik.
        </p>
      </Section>

      <style>{`
        .prose-content h2 { font-family: var(--font-playfair); font-size: 1.6rem; margin-top: 2.5rem; margin-bottom: 0.8rem; }
        .prose-content p { margin: 0.8rem 0; color: #6b6b6b; line-height: 1.7; font-size: 0.95rem; }
        .prose-content ul { margin: 0.8rem 0; padding-left: 1.2rem; color: #6b6b6b; font-size: 0.95rem; }
        .prose-content ul li { margin: 0.4rem 0; line-height: 1.6; }
        .prose-content a { text-decoration: underline; color: #0a0a0a; }
        .prose-content strong { color: #0a0a0a; font-weight: 600; }
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
