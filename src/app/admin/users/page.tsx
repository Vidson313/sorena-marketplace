import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "../../../../supabase/server";
import { isUserAdmin } from "@/lib/queries";
import AdminUsersClient from "@/components/admin/admin-users";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let currentUser: any = { id: "admin-demo", email: "admin@sorena.dev" };
  let users: any[] = [];
  let totalOrders = 0;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return redirect("/sign-in");
      currentUser = data.user;
      const isAdmin = await isUserAdmin(currentUser.id);
      if (!isAdmin) return redirect("/dashboard");

      const [{ data: dbUsers }, { count }] = await Promise.all([
        supabase.from("users").select(`*, user_role:user_roles(role)`).order("created_at", { ascending: false }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
      ]);
      users = dbUsers || [];
      totalOrders = count || 0;
    } catch {}
  }

  return (
    <AdminUsersClient
      currentUser={currentUser}
      users={users}
      totalOrders={totalOrders}
    />
  );
}
