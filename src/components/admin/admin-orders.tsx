"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  Search,
  MoreVertical,
  Eye,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { updateOrderStatus } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";

interface AdminOrdersClientProps {
  user: User;
  orders: any[];
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

const statusLabels: Record<string, { label: string; className: string; icon: any }> = {
  pending: { label: "در انتظار پرداخت", className: "bg-yellow-500/10 text-yellow-500", icon: Clock },
  processing: { label: "در حال پردازش", className: "bg-blue-500/10 text-blue-500", icon: Loader2 },
  completed: { label: "تکمیل شده", className: "bg-green-500/10 text-green-500", icon: CheckCircle },
  cancelled: { label: "لغو شده", className: "bg-red-500/10 text-red-500", icon: XCircle },
  refunded: { label: "بازپرداخت شده", className: "bg-gray-500/10 text-gray-500", icon: XCircle },
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

export default function AdminOrdersClient({ user, orders }: AdminOrdersClientProps) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.error) {
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "به‌روزرسانی شد",
          description: "وضعیت سفارش تغییر کرد",
        });
        router.refresh();
      }
    });
  };

  // Calculate stats
  const totalRevenue = orders
    .filter((o: any) => o.payment_status === "paid")
    .reduce((acc: number, o: any) => acc + Number(o.total), 0);
  const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
  const completedOrders = orders.filter((o: any) => o.status === "completed").length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col glass-surface-strong border-l border-border/40 fixed h-full">
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

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  item.href === "/admin/orders" ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

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
        <header className="sticky top-0 z-40 glass-surface-strong border-b border-border/40">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="جستجوی سفارش..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-10 pr-10 pl-4 rounded-full bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">مدیریت سفارشات</h1>
              <p className="text-muted-foreground">{orders.length} سفارش ثبت شده</p>
            </div>
            <div className="flex gap-2">
              {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="rounded-full"
                >
                  {status === "all" ? "همه" : statusLabels[status]?.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-surface rounded-2xl p-5">
              <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
              <p className="text-sm text-muted-foreground">درآمد کل (تومان)</p>
            </div>
            <div className="glass-surface rounded-2xl p-5">
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-muted-foreground">کل سفارشات</p>
            </div>
            <div className="glass-surface rounded-2xl p-5">
              <p className="text-2xl font-bold text-yellow-500">{pendingOrders}</p>
              <p className="text-sm text-muted-foreground">در انتظار</p>
            </div>
            <div className="glass-surface rounded-2xl p-5">
              <p className="text-2xl font-bold text-green-500">{completedOrders}</p>
              <p className="text-sm text-muted-foreground">تکمیل شده</p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-surface rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-right text-sm text-muted-foreground border-b border-border bg-muted/30">
                    <th className="p-4 font-medium">شماره سفارش</th>
                    <th className="p-4 font-medium">مشتری</th>
                    <th className="p-4 font-medium">محصولات</th>
                    <th className="p-4 font-medium">مبلغ</th>
                    <th className="p-4 font-medium">وضعیت</th>
                    <th className="p-4 font-medium">تاریخ</th>
                    <th className="p-4 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order: any) => {
                    const StatusIcon = statusLabels[order.status]?.icon || Clock;
                    return (
                      <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                        <td className="p-4">
                          <span className="font-mono text-sm">{order.order_number}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{order.user?.name || "بدون نام"}</p>
                            <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex -space-x-2">
                            {order.items?.slice(0, 3).map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded-lg border-2 border-background overflow-hidden"
                              >
                                <img
                                  src={item.product?.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=50&q=60"}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {order.items?.length > 3 && (
                              <div className="w-8 h-8 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-xs">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">{formatPrice(Number(order.total))} تومان</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs ${
                            statusLabels[order.status]?.className
                          }`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusLabels[order.status]?.label}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")}>
                                در حال پردازش
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, "completed")}>
                                تکمیل شده
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(order.id, "cancelled")}
                                className="text-destructive"
                              >
                                لغو سفارش
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">سفارشی یافت نشد</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
