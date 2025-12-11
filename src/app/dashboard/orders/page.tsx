import { createClient } from "@/../../supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getUserOrders } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Download, 
  Eye, 
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">تکمیل شده</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">در انتظار پرداخت</Badge>;
    case "processing":
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">در حال پردازش</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">لغو شده</Badge>;
    case "refunded":
      return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">بازگشت وجه</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "pending":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case "processing":
      return <AlertCircle className="w-5 h-5 text-blue-500" />;
    case "cancelled":
    case "refunded":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Package className="w-5 h-5" />;
  }
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const orders = await getUserOrders(user.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">خانه</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/dashboard" className="hover:text-primary">داشبورد</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">سفارشات</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">سفارشات من</h1>
          <Badge variant="outline" className="text-sm">
            {orders.length} سفارش
          </Badge>
        </div>

        {orders.length === 0 ? (
          <div className="glass-surface rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">هنوز سفارشی ندارید</h2>
            <p className="text-muted-foreground mb-6">
              با خرید اولین پروژه، سفارشات شما اینجا نمایش داده می‌شود
            </p>
            <Link href="/products">
              <Button className="rounded-full px-6">مشاهده پروژه‌ها</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="glass-surface rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{order.order_number}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-primary">
                      {formatPrice(order.total)} تومان
                    </div>
                    {order.discount_amount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        تخفیف: {formatPrice(order.discount_amount)} تومان
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-border pt-4">
                  <div className="space-y-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                            {item.product?.thumbnail_url && (
                              <img 
                                src={item.product.thumbnail_url} 
                                alt={item.product.title_fa}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <Link 
                              href={`/products/${item.product?.slug}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {item.product?.title_fa}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.price)} تومان
                            </p>
                          </div>
                        </div>
                        {order.status === "completed" && item.product?.files?.length > 0 && (
                          <a 
                            href={item.product.files.find((f: any) => f.is_main)?.file_url || item.product.files[0]?.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className="gap-2 rounded-full">
                              <Download className="w-4 h-4" />
                              دانلود
                            </Button>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="border-t border-border pt-4 mt-4 flex justify-end gap-2">
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      جزئیات
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
