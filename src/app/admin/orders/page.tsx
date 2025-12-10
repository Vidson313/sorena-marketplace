import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { isUserAdmin } from "@/lib/queries";
import AdminOrdersClient from "@/components/admin/admin-orders";

export default async function AdminOrdersPage() {
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

  // Get all orders with items and user info
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      user:users(name, email),
      items:order_items(
        *,
        product:products(title_fa, thumbnail_url)
      )
    `)
    .order("created_at", { ascending: false });

  return <AdminOrdersClient user={user} orders={orders || []} />;
}
