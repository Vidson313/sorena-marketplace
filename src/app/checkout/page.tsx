import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Shield, Download, Zap, ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "../../../supabase/server";

export const dynamic = "force-dynamic";

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

export default async function CheckoutPage() {
  let userEmail = "demo@example.com";

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        userEmail = data.user.email;
      }
    } catch {}
  }

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
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            خانه
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/cart" className="hover:text-primary">
            سبد خرید
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">تکمیل خرید</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8">تکمیل خرید</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-surface rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">اطلاعات صورتحساب</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">نام</Label>
                  <Input id="firstName" placeholder="نام خود را وارد کنید" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input id="lastName" placeholder="نام خانوادگی خود را وارد کنید" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input id="email" type="email" defaultValue={userEmail} className="h-11 rounded-xl" dir="ltr" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">شماره موبایل</Label>
                  <Input id="phone" type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" className="h-11 rounded-xl" dir="ltr" />
                </div>
              </div>
            </div>

            <div className="glass-surface rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">روش پرداخت</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-primary bg-primary/5 cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-primary" />
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">درگاه پرداخت آنلاین</p>
                    <p className="text-xs text-muted-foreground">پرداخت امن با کارت‌های شتاب</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="glass-surface rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">محصولات سفارش</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.thumbnail_url}
                        alt={item.product.title_fa}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.product.title_fa}</h3>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-primary">
                        {formatPrice(item.product.discount_price || item.product.price)} تومان
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-surface rounded-2xl p-6 sticky top-24">
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
                <Lock className="w-5 h-5" />
                پرداخت و دانلود
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                با کلیک روی دکمه پرداخت، شرایط و قوانین سایت را می‌پذیرید
              </p>
            </div>

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
      </main>

      <Footer />
    </div>
  );
}
