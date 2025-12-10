"use client";

import { useState, useTransition } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  UserCircle,
  Menu,
  MoreVertical,
  Shield,
  Star,
  Loader2,
} from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { updateUserRole } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";

interface AdminUsersClientProps {
  currentUser: User;
  users: any[];
  totalOrders: number;
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

const roleLabels: Record<string, { label: string; className: string }> = {
  customer: { label: "مشتری", className: "bg-gray-500/10 text-gray-500" },
  admin: { label: "مدیر", className: "bg-blue-500/10 text-blue-500" },
  super_admin: { label: "مدیر ارشد", className: "bg-purple-500/10 text-purple-500" },
};

export default function AdminUsersClient({ 
  currentUser, 
  users,
  totalOrders 
}: AdminUsersClientProps) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const filteredUsers = users.filter((user: any) =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) {
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "به‌روزرسانی شد",
          description: "نقش کاربر با موفقیت تغییر کرد",
        });
        setShowRoleModal(false);
        router.refresh();
      }
    });
  };

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
                  item.href === "/admin/users" ? "bg-primary/10 text-primary" : ""
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
                {currentUser.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.email}</p>
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
                  placeholder="جستجوی کاربران..."
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
              <h1 className="text-2xl font-bold mb-1">مدیریت کاربران</h1>
              <p className="text-muted-foreground">{users.length} کاربر ثبت‌نام شده</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-surface rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-muted-foreground">کل کاربران</p>
            </div>
            <div className="glass-surface rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">
                {users.filter((u: any) => u.user_role?.role === "admin" || u.user_role?.role === "super_admin").length}
              </p>
              <p className="text-sm text-muted-foreground">مدیران</p>
            </div>
            <div className="glass-surface rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">{totalOrders}</p>
              <p className="text-sm text-muted-foreground">کل سفارشات</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-surface rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-right text-sm text-muted-foreground border-b border-border bg-muted/30">
                    <th className="p-4 font-medium">کاربر</th>
                    <th className="p-4 font-medium">ایمیل</th>
                    <th className="p-4 font-medium">نقش</th>
                    <th className="p-4 font-medium">تاریخ عضویت</th>
                    <th className="p-4 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-bold">
                              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name || user.full_name || "بدون نام"}</p>
                            <p className="text-xs text-muted-foreground">{user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{user.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                          roleLabels[user.user_role?.role || "customer"]?.className || roleLabels.customer.className
                        }`}>
                          {roleLabels[user.user_role?.role || "customer"]?.label || roleLabels.customer.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("fa-IR")}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRoleModal(true);
                              }}
                            >
                              <Shield className="w-4 h-4 ml-2" />
                              تغییر نقش
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Role Change Modal */}
      <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغییر نقش کاربر</DialogTitle>
            <DialogDescription>
              نقش جدید برای {selectedUser?.email} انتخاب کنید
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {["customer", "admin", "super_admin"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(selectedUser?.id, role)}
                disabled={isPending}
                className={`w-full p-3 rounded-xl border text-right transition-colors ${
                  selectedUser?.user_role?.role === role
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${roleLabels[role].className}`}>
                  {roleLabels[role].label}
                </span>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleModal(false)}>
              انصراف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
