import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { isUserAdmin } from "@/lib/queries";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is admin
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return redirect("/dashboard");
  }

  // Get real stats
  const [
    { count: totalOrders },
    { count: totalUsers },
    { data: orders },
    { data: topProducts },
  ] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("orders")
      .select(`
        *,
        user:users(name, email),
        items:order_items(*, product:products(title_fa))
      `)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("products")
      .select("title_fa, sales_count, price")
      .order("sales_count", { ascending: false })
      .limit(4),
  ]);

  // Calculate total revenue
  const { data: paidOrders } = await supabase
    .from("orders")
    .select("total")
    .eq("payment_status", "paid");
  
  const totalRevenue = paidOrders?.reduce((acc: number, o: any) => acc + Number(o.total), 0) || 0;

  // Get view count (from products)
  const { data: viewData } = await supabase
    .from("products")
    .select("view_count");
  const totalViews = viewData?.reduce((acc: number, p: any) => acc + (p.view_count || 0), 0) || 0;

  const stats = {
    totalRevenue,
    totalOrders: totalOrders || 0,
    totalUsers: totalUsers || 0,
    totalViews,
  };

  return (
    <AdminDashboard 
      user={user} 
      stats={stats}
      recentOrders={orders || []}
      topProducts={topProducts || []}
    />
  );
}
