import LandingForm from "./LandingForm";
import { getT } from "@/i18n/server";
import { getLanding } from "@/lib/store";

export const revalidate = 0;

export default async function AdminLandingPage() {
  const { t } = await getT();
  const landing = await getLanding();

  return (
    <div>
      <div className="mb-10">
        <div className="text-[11px] tracking-widest-3 uppercase text-muted mb-2">
          {t.admin.landing}
        </div>
        <h1 className="font-display text-4xl md:text-5xl">{t.admin.landing}</h1>
        <p className="mt-3 text-sm text-muted max-w-xl">
          A főoldal szekcióinak szerkesztése. A mentés után néhány másodpercen
          belül frissül a publikus weboldal.
        </p>
      </div>

      <LandingForm
        initial={landing}
        labels={{
          save: t.admin.save,
          savedAt: t.admin.savedAt,
          dropImage: t.admin.dropImage,
        }}
      />
    </div>
  );
}
