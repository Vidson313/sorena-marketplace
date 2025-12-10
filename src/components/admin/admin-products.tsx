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
  Plus,
  Search,
  Bell,
  UserCircle,
  Menu,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  Loader2,
} from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { deleteProduct, createProduct, updateProduct } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";

interface AdminProductsPageProps {
  user: User;
  initialProducts: any[];
  categories: any[];
  technologies: any[];
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

export default function AdminProductsPage({ 
  user, 
  initialProducts,
  categories,
  technologies 
}: AdminProductsPageProps) {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProducts = products.filter((product: any) =>
    product.title_fa.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (productId: string) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;

    setDeletingId(productId);
    const result = await deleteProduct(productId);
    setDeletingId(null);

    if (result.error) {
      toast({
        title: "خطا",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast({
        title: "حذف شد",
        description: "محصول با موفقیت حذف شد",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, formData);
      } else {
        result = await createProduct(formData);
      }

      if (result.error) {
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: editingProduct ? "به‌روزرسانی شد" : "ایجاد شد",
          description: editingProduct 
            ? "محصول با موفقیت به‌روزرسانی شد"
            : "محصول با موفقیت ایجاد شد",
        });
        setShowAddModal(false);
        setEditingProduct(null);
        router.refresh();
      }
    });
  };

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
                  item.href === "/admin/products" ? "bg-primary/10 text-primary" : ""
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
                  placeholder="جستجوی محصول..."
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
              <h1 className="text-2xl font-bold mb-1">مدیریت محصولات</h1>
              <p className="text-muted-foreground">لیست تمام محصولات فروشگاه</p>
            </div>
            <Link href="/admin/products/new">
              <Button className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                افزودن محصول
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="glass-surface rounded-2xl p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <select className="h-10 px-4 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">همه دسته‌بندی‌ها</option>
                <option value="web">وب اپلیکیشن</option>
                <option value="mobile">موبایل</option>
                <option value="dashboard">داشبورد</option>
              </select>
              <select className="h-10 px-4 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
              </select>
              <select className="h-10 px-4 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">مرتب‌سازی</option>
                <option value="newest">جدیدترین</option>
                <option value="sales">پرفروش‌ترین</option>
                <option value="price_high">گران‌ترین</option>
                <option value="price_low">ارزان‌ترین</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="glass-surface rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-right text-sm text-muted-foreground border-b border-border bg-muted/30">
                    <th className="p-4 font-medium">محصول</th>
                    <th className="p-4 font-medium">دسته‌بندی</th>
                    <th className="p-4 font-medium">قیمت</th>
                    <th className="p-4 font-medium">فروش</th>
                    <th className="p-4 font-medium">امتیاز</th>
                    <th className="p-4 font-medium">وضعیت</th>
                    <th className="p-4 font-medium">تاریخ</th>
                    <th className="p-4 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.thumbnail_url}
                              alt={product.title_fa}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{product.title_fa}</p>
                            <p className="text-xs text-muted-foreground">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{product.category}</td>
                      <td className="p-4">
                        <div>
                          {product.discount_price ? (
                            <>
                              <p className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </p>
                              <p className="text-sm font-medium text-primary">
                                {formatPrice(product.discount_price)}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm">{formatPrice(product.sales_count)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{product.rating_average}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                              product.is_active
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {product.is_active ? "فعال" : "غیرفعال"}
                          </span>
                          {product.is_featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                              ویژه
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{product.created_at}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="w-4 h-4" />
                              مشاهده
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              ویرایش
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                نمایش ۱ تا ۴ از ۴ محصول
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  قبلی
                </Button>
                <Button variant="default" size="sm" className="w-9">
                  ۱
                </Button>
                <Button variant="outline" size="sm">
                  بعدی
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
