import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getT } from "@/i18n/server";
import AdminSidebar from "./AdminSidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SignOutButton from "./SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getT();
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();

  // Not logged in → render children (login page takes over)
  if (!user) {
    return <>{children}</>;
  }

  const { data: allowed } = await sb
    .from("admin_users")
    .select("email")
    .eq("email", user.email ?? "")
    .maybeSingle();

  if (!allowed) {
    // signed in but not an admin
    await sb.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] bg-bone">
      <aside className="bg-white border-r border-line min-h-screen sticky top-0 flex flex-col">
        <div className="p-6 border-b border-line">
          <Link
            href="/admin"
            className="font-display text-xl tracking-[0.25em] block"
          >
            LUNARA
          </Link>
          <div className="mt-1 text-[10px] tracking-widest-2 uppercase text-muted">
            Admin
          </div>
        </div>

        <AdminSidebar
          labels={{
            dashboard: t.admin.dashboard,
            products: t.admin.products,
            collections: t.admin.collections,
            landing: t.admin.landing,
            orders: t.admin.orders,
          }}
        />

        <div className="mt-auto p-6 border-t border-line space-y-3">
          <Link
            href="/"
            target="_blank"
            className="text-[11px] tracking-widest-2 uppercase text-muted hover:text-ink block"
          >
            {t.admin.viewSite}
          </Link>
          <LanguageSwitcher />
          <div className="text-xs text-muted truncate">{user.email}</div>
          <SignOutButton label={t.admin.signOut} />
        </div>
      </aside>

      <main className="min-h-screen">
        <div className="max-w-[1200px] mx-auto p-8 md:p-10">{children}</div>
      </main>
    </div>
  );
}
