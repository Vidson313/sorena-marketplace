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
}

// Mock data
const stats = [
  {
    label: "درآمد کل",
    value: "۱۲۵,۰۰۰,۰۰۰",
    unit: "تومان",
    change: "+۱۲٪",
    trend: "up",
    icon: DollarSign,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "سفارشات",
    value: "۱,۲۳۴",
    unit: "",
    change: "+۸٪",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "کاربران",
    value: "۲,۵۶۷",
    unit: "",
    change: "+۱۵٪",
    trend: "up",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    label: "بازدید",
    value: "۴۵,۶۷۸",
    unit: "",
    change: "-۳٪",
    trend: "down",
    icon: Eye,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const recentOrders = [
  {
    id: "SRN-20240315-1234",
    customer: "علی محمدی",
    product: "داشبورد فروشگاه آنلاین",
    amount: 1750000,
    status: "completed",
    date: "۱۴۰۲/۱۲/۲۵",
  },
  {
    id: "SRN-20240315-1235",
    customer: "سارا احمدی",
    product: "پلتفرم بلاگ حرفه‌ای",
    amount: 1800000,
    status: "pending",
    date: "۱۴۰۲/۱۲/۲۵",
  },
  {
    id: "SRN-20240315-1236",
    customer: "محمد رضایی",
    product: "قالب اپلیکیشن موبایل",
    amount: 2400000,
    status: "completed",
    date: "۱۴۰۲/۱۲/۲۴",
  },
  {
    id: "SRN-20240315-1237",
    customer: "زهرا کریمی",
    product: "پنل مدیریت پیشرفته",
    amount: 2100000,
    status: "processing",
    date: "۱۴۰۲/۱۲/۲۴",
  },
];

const topProducts = [
  { name: "داشبورد فروشگاه آنلاین", sales: 450, revenue: 787500000 },
  { name: "قالب وردپرس فروشگاهی", sales: 890, revenue: 1068000000 },
  { name: "پلتفرم بلاگ حرفه‌ای", sales: 320, revenue: 576000000 },
  { name: "کیت استارتر SaaS", sales: 145, revenue: 652500000 },
];

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

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const supabase = createClient();
  const router = useRouter();

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
                <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
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
            <Link href="/admin/products/new">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                افزودن محصول
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="glass-surface rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span
                    className={`text-xs font-medium flex items-center gap-1 ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </span>
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
                      <th className="pb-3 font-medium">محصول</th>
                      <th className="pb-3 font-medium">مبلغ</th>
                      <th className="pb-3 font-medium">وضعیت</th>
                      <th className="pb-3 font-medium">تاریخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 last:border-0">
                        <td className="py-4 text-sm font-mono">{order.id}</td>
                        <td className="py-4 text-sm">{order.customer}</td>
                        <td className="py-4 text-sm truncate max-w-[150px]">{order.product}</td>
                        <td className="py-4 text-sm font-medium">{formatPrice(order.amount)}</td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                              statusLabels[order.status].className
                            }`}
                          >
                            {statusLabels[order.status].label}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">{order.date}</td>
                      </tr>
                    ))}
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
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(product.sales)} فروش
                      </p>
                    </div>
                    <p className="text-sm font-medium text-primary">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
