import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  Shield,
  Download,
  Zap,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

// Mock cart data
const cartItems = [
  {
    id: "1",
    product: {
      id: "1",
      title_fa: "داشبورد فروشگاه آنلاین",
      slug: "ecommerce-dashboard",
      thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&q=80",
      price: 2500000,
      discount_price: 1750000,
    },
  },
  {
    id: "2",
    product: {
      id: "2",
      title_fa: "پلتفرم بلاگ حرفه‌ای",
      slug: "blog-platform",
      thumbnail_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&q=80",
      price: 1800000,
      discount_price: null,
    },
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

export default function CartPage() {
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product.discount_price || item.product.price);
  }, 0);

  const discount = cartItems.reduce((acc, item) => {
    if (item.product.discount_price) {
      return acc + (item.product.price - item.product.discount_price);
    }
    return acc;
  }, 0);

  const total = subtotal;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            خانه
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">سبد خرید</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8">سبد خرید</h1>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-surface rounded-2xl p-4 flex gap-4"
                >
                  <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.thumbnail_url}
                      alt={item.product.title_fa}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors">
                        {item.product.title_fa}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      {item.product.discount_price ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.product.price)} تومان
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(item.product.discount_price)} تومان
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(item.product.price)} تومان
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link href="/products">
                <Button variant="outline" className="w-full rounded-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  ادامه خرید
                </Button>
              </Link>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Discount Code */}
              <div className="glass-surface rounded-2xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  کد تخفیف
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="کد تخفیف را وارد کنید"
                    className="flex-1 h-10 px-4 rounded-full bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button className="rounded-full px-6">اعمال</Button>
                </div>
              </div>

              {/* Summary */}
              <div className="glass-surface rounded-2xl p-6">
                <h3 className="font-semibold mb-4">خلاصه سفارش</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">جمع کل</span>
                    <span>{formatPrice(subtotal + discount)} تومان</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>تخفیف</span>
                      <span>-{formatPrice(discount)} تومان</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                    <span>مبلغ قابل پرداخت</span>
                    <span className="text-primary">{formatPrice(total)} تومان</span>
                  </div>
                </div>

                <Button className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white mt-6 gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  ادامه و پرداخت
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="glass-surface rounded-2xl p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-500" />
                    </div>
                    <span>پرداخت امن با درگاه‌های معتبر</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Download className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>دانلود فوری پس از پرداخت</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span>پشتیبانی ۶ ماهه رایگان</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">سبد خرید شما خالی است</h2>
            <p className="text-muted-foreground mb-6">
              پروژه‌های مورد نظر خود را به سبد خرید اضافه کنید
            </p>
            <Link href="/products">
              <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white gap-2">
                مشاهده پروژه‌ها
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
