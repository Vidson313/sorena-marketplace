import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "../../../../supabase/server";
import { isUserAdmin } from "@/lib/queries";
import AdminOrdersClient from "@/components/admin/admin-orders";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let user: any = { id: "admin-demo", email: "admin@sorena.dev" };
  let orders: any[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return redirect("/sign-in");
      user = data.user;
      const isAdmin = await isUserAdmin(user.id);
      if (!isAdmin) return redirect("/dashboard");

      const { data: dbOrders } = await supabase
        .from("orders")
        .select(`*, user:users(name, email), items:order_items(*, product:products(title_fa, thumbnail_url))`)
        .order("created_at", { ascending: false });
      orders = dbOrders || [];
    } catch {}
  }

  return <AdminOrdersClient user={user} orders={orders} />;
}
