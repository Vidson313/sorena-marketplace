import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "../../../supabase/server";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { isUserAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let user: any = { id: "admin-demo", email: "admin@sorena.dev" };
  let stats = {
    totalRevenue: 12500000,
    totalOrders: 28,
    totalUsers: 142,
    totalViews: 3540,
  };
  let recentOrders: any[] = [];
  let topProducts: any[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return redirect("/sign-in");
      user = data.user;
      const isAdmin = await isUserAdmin(user.id);
      if (!isAdmin) return redirect("/dashboard");

      const [
        { count: totalOrders },
        { count: totalUsers },
        { data: orders },
        { data: products },
      ] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("orders").select(`*, user:users(name, email), items:order_items(*, product:products(title_fa))`).order("created_at", { ascending: false }).limit(5),
        supabase.from("products").select("title_fa, sales_count, price").order("sales_count", { ascending: false }).limit(4),
      ]);

      const { data: paidOrders } = await supabase.from("orders").select("total").eq("payment_status", "paid");
      const totalRevenue = paidOrders?.reduce((acc: number, o: any) => acc + Number(o.total), 0) || 0;
      const { data: viewData } = await supabase.from("products").select("view_count");
      const totalViews = viewData?.reduce((acc: number, p: any) => acc + (p.view_count || 0), 0) || 0;

      stats = { totalRevenue, totalOrders: totalOrders || 0, totalUsers: totalUsers || 0, totalViews };
      recentOrders = orders || [];
      topProducts = products || [];
    } catch {}
  }

  return (
    <AdminDashboard
      user={user}
      stats={stats}
      recentOrders={recentOrders}
      topProducts={topProducts}
    />
  );
}
