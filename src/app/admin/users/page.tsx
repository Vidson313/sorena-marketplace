import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { isUserAdmin } from "@/lib/queries";
import AdminUsersClient from "@/components/admin/admin-users";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return redirect("/dashboard");
  }

  // Get all users with their roles
  const { data: users } = await supabase
    .from("users")
    .select(`
      *,
      user_role:user_roles(role)
    `)
    .order("created_at", { ascending: false });

  // Get user stats
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });

  return (
    <AdminUsersClient 
      currentUser={user} 
      users={users || []}
      totalOrders={totalOrders || 0}
    />
  );
}
