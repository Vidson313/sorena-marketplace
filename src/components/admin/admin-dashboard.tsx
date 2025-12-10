"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Star,
  ChevronLeft,
  Search,
  Bell,
  UserCircle,
  Menu,
} from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface AdminDashboardProps {
  user: User;
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalViews: number;
  };
  recentOrders: any[];
  topProducts: any[];
}

const sidebarItems = [
  { name: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { name: "محصولات", href: "/admin/products", icon: Package },
  { name: "سفارشات", href: "/admin/orders", icon: ShoppingCart },
  { name: "کاربران", href: "/admin/users", icon: Users },
  { name: "آمار و گزارش", href: "/admin/analytics", icon: BarChart3 },
  { name: "نظرات", href: "/admin/reviews", icon: Star },
  { name: "پشتیبانی", href: "/admin/support", icon: MessageSquare },
  { name: "تنظیمات", href: "/admin/settings", icon: Settings },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

const statusLabels: Record<string, { label: string; className: string }> = {
  completed: { label: "تکمیل شده", className: "bg-green-500/10 text-green-500" },
  pending: { label: "در انتظار", className: "bg-yellow-500/10 text-yellow-500" },
  processing: { label: "در حال پردازش", className: "bg-blue-500/10 text-blue-500" },
  cancelled: { label: "لغو شده", className: "bg-red-500/10 text-red-500" },
};

export default function AdminDashboard({ user, stats, recentOrders, topProducts }: AdminDashboardProps) {
  const supabase = createClient();
  const router = useRouter();

  const statsData = [
    {
      label: "درآمد کل",
      value: formatPrice(stats.totalRevenue),
      unit: "تومان",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "سفارشات",
      value: stats.totalOrders.toString(),
      unit: "",
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "کاربران",
      value: stats.totalUsers.toString(),
      unit: "",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "بازدید",
      value: stats.totalViews.toString(),
      unit: "",
      icon: Eye,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col glass-surface-strong border-l border-border/40 fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">س</span>
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">سورنا</span>
              <p className="text-xs text-muted-foreground">پنل مدیریت</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  item.href === "/admin" ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">مدیر</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:mr-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 glass-surface-strong border-b border-border/40">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <div className="hidden md:flex relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="w-64 h-10 pr-10 pl-4 rounded-full bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-primary" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      تنظیمات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push("/");
                      router.refresh();
                    }}
                  >
                    <LogOut className="w-4 h-4 ml-2" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">داشبورد</h1>
              <p className="text-muted-foreground">خلاصه وضعیت فروشگاه</p>
            </div>
            <Link href="/admin/products">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                افزودن محصول
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, index) => (
              <div key={index} className="glass-surface rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">
                  {stat.value}
                  {stat.unit && <span className="text-sm font-normal text-muted-foreground mr-1">{stat.unit}</span>}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 glass-surface rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">سفارشات اخیر</h2>
                <Link href="/admin/orders">
                  <Button variant="ghost" size="sm" className="text-primary">
                    مشاهده همه
                    <ChevronLeft className="w-4 h-4 mr-1" />
                  </Button>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-right text-sm text-muted-foreground border-b border-border">
                      <th className="pb-3 font-medium">شماره سفارش</th>
                      <th className="pb-3 font-medium">مشتری</th>
                      <th className="pb-3 font-medium">مبلغ</th>
                      <th className="pb-3 font-medium">وضعیت</th>
                      <th className="pb-3 font-medium">تاریخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          هنوز سفارشی ثبت نشده است
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order: any) => (
                        <tr key={order.id} className="border-b border-border/50 last:border-0">
                          <td className="py-4 text-sm font-mono">{order.order_number}</td>
                          <td className="py-4 text-sm">{order.user?.name || order.user?.email || "بدون نام"}</td>
                          <td className="py-4 text-sm font-medium">{formatPrice(Number(order.total))}</td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                                statusLabels[order.status]?.className || statusLabels.pending.className
                              }`}
                            >
                              {statusLabels[order.status]?.label || order.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("fa-IR")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="glass-surface rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">پرفروش‌ترین‌ها</h2>
                <Link href="/admin/products">
                  <Button variant="ghost" size="sm" className="text-primary">
                    همه
                    <ChevronLeft className="w-4 h-4 mr-1" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {topProducts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">محصولی یافت نشد</p>
                ) : (
                  topProducts.map((product: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.title_fa}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales_count} فروش
                        </p>
                      </div>
                      <p className="text-sm font-medium text-primary">
                        {formatPrice(Number(product.price) * product.sales_count)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
