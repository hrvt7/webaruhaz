import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getT } from "@/i18n/server";
import AdminShell from "./AdminShell";

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

  if (!user) {
    return <>{children}</>;
  }

  const { data: allowed } = await sb
    .from("admin_users")
    .select("email")
    .eq("email", user.email ?? "")
    .maybeSingle();

  if (!allowed) {
    await sb.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <AdminShell
      userEmail={user.email ?? ""}
      labels={{
        dashboard: t.admin.dashboard,
        products: t.admin.products,
        collections: t.admin.collections,
        landing: t.admin.landing,
        orders: t.admin.orders,
      }}
      signOutLabel={t.admin.signOut}
      viewSiteLabel={t.admin.viewSite}
    >
      {children}
    </AdminShell>
  );
}
