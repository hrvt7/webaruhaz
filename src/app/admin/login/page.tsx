import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { getT } from "@/i18n/server";

export default async function LoginPage() {
  const { t } = await getT();
  return (
    <div className="min-h-[calc(100vh-120px)] grid place-items-center px-6 py-12 bg-bone">
      <div className="bg-white border border-line w-full max-w-md p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="font-display text-3xl tracking-[0.25em]">Aetheris</div>
          <div className="mt-1 text-[11px] tracking-widest-2 uppercase text-muted">
            Admin
          </div>
        </div>
        <Suspense>
          <LoginForm
            labels={{
              email: t.admin.email,
              password: t.admin.password,
              signIn: t.admin.signIn,
              backToSite: t.admin.backToSite,
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
