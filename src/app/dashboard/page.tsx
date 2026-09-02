import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import {
  Package,
  Download,
  Heart,
  MessageSquare,
  Settings,
  ChevronLeft,
  Key
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "../../../supabase/server";
import Link from "next/link";
import { getUserOrders, getFavorites } from "@/lib/queries";

export const dynamic = "force-dynamic";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

export default async function Dashboard() {
  let user: any = { email: "demo@example.com", id: "demo-user" };
  let orders: any[] = [];
  let favorites: any[] = [];
  let ticketsCount = 0;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        user = data.user;
        [orders, favorites] = await Promise.all([
          getUserOrders(user.id),
          getFavorites(user.id),
        ]);
        const { count } = await supabase
          .from("support_tickets")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);
        ticketsCount = count || 0;
      }
    } catch {}
  }

  const completedOrders = orders.filter((o: any) => o.status === "completed");
  const totalDownloads = completedOrders.reduce((acc: number, order: any) => {
    return acc + (order.items?.length || 0);
  }, 0);

  const stats = [
    { label: "خریدهای من", value: orders.length.toString(), icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "دانلودها", value: totalDownloads.toString(), icon: Download, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "علاقه‌مندی‌ها", value: favorites.length.toString(), icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "تیکت‌های پشتیبانی", value: ticketsCount.toString(), icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const recentPurchases = completedOrders.slice(0, 5).flatMap((order: any) =>
    order.items?.map((item: any) => ({
      id: item.id,
      order_number: order.order_number,
      product: item.product,
      price: Number(item.discount_price || item.price),
      status: order.status,
      created_at: order.created_at,
      license_key: item.license_key,
    })) || []
  );

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">داشبورد من</h1>
              <p className="text-muted-foreground">خوش آمدید، {user.email}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/products">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white">
                  مشاهده پروژه‌ها
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="glass-surface rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-surface rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">خریدهای اخیر</h2>
                  <Link href="/dashboard/orders">
                    <Button variant="ghost" size="sm" className="text-primary">
                      مشاهده همه
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentPurchases.map((purchase: any) => (
                    <div
                      key={purchase.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={purchase.product?.thumbnail_url}
                          alt={purchase.product?.title_fa}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {purchase.product?.title_fa}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{purchase.order_number}</span>
                          <span>•</span>
                          <span>{purchase.created_at}</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm text-primary">
                          {formatPrice(purchase.price)} تومان
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-500">
                          تکمیل شده
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Key className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {recentPurchases.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">هنوز خریدی انجام نداده‌اید</p>
                    <Link href="/products">
                      <Button>مشاهده پروژه‌ها</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-surface rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">دسترسی سریع</h2>
                <div className="space-y-2">
                  <Link href="/dashboard/orders">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Package className="w-4 h-4" />
                      سفارشات من
                    </Button>
                  </Link>
                  <Link href="/favorites">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Heart className="w-4 h-4" />
                      علاقه‌مندی‌ها
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Settings className="w-4 h-4" />
                      تنظیمات
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="glass-surface rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">اطلاعات حساب</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {user.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.email}</p>
                      <p className="text-xs text-muted-foreground">حساب کاربری فعال</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-surface rounded-2xl p-6 border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">نیاز به کمک دارید؟</h3>
                    <p className="text-xs text-muted-foreground">تیم پشتیبانی آماده پاسخگویی است</p>
                  </div>
                </div>
                <Link href="/products">
                  <Button size="sm" className="w-full rounded-full">
                    ارتباط با پشتیبانی
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
