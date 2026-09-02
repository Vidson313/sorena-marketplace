import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Code2,
  Shield,
  Zap,
  Users,
  Star,
  Download,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import Link from "next/link";
import { getFeaturedProducts, getCategories } from "@/lib/queries";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

const defaultCategories = [
  { name: "وب اپلیکیشن", icon: Code2, count: 45, href: "/products?category=web-applications" },
  { name: "موبایل", icon: Zap, count: 28, href: "/products?category=mobile-apps" },
  { name: "وردپرس", icon: Award, count: 62, href: "/products?category=wordpress" },
  { name: "فروشگاهی", icon: TrendingUp, count: 34, href: "/products?category=ecommerce" },
];

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(4);
  const products = featuredProducts.length > 0 ? featuredProducts : MOCK_PRODUCTS.slice(0, 4);

  const dbCategories = await getCategories();
  const categories = dbCategories.length > 0
    ? dbCategories.map((cat, index) => ({
        name: cat.name_fa,
        icon: [Code2, Zap, Award, TrendingUp][index % 4],
        count: 10 + index * 8,
        href: `/products?category=${cat.slug}`
      }))
    : defaultCategories;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">دسته‌بندی پروژه‌ها</h2>
            <p className="text-muted-foreground">پروژه مورد نظر خود را در دسته‌بندی‌های مختلف پیدا کنید</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.href} href={category.href}>
                <div className="glass-surface rounded-2xl p-6 card-hover text-center group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <category.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} پروژه</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">پروژه‌های ویژه</h2>
              <p className="text-muted-foreground">محبوب‌ترین و پرفروش‌ترین پروژه‌ها</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="rounded-full gap-2">
                مشاهده همه
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "۲,۵۰۰+", label: "مشتری راضی" },
              { icon: Download, value: "۱۵,۰۰۰+", label: "دانلود موفق" },
              { icon: Star, value: "۴.۸", label: "میانگین امتیاز" },
              { icon: Code2, value: "۱۵۰+", label: "پروژه آماده" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">چرا سورنا؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ما بهترین تجربه خرید پروژه‌های آماده را برای شما فراهم می‌کنیم
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "پرداخت امن",
                description: "پرداخت از طریق درگاه‌های معتبر بانکی با رمزنگاری کامل"
              },
              {
                icon: Download,
                title: "دانلود فوری",
                description: "بلافاصله پس از پرداخت، فایل‌ها برای دانلود آماده می‌شوند"
              },
              {
                icon: Zap,
                title: "پشتیبانی ۶ ماهه",
                description: "پشتیبانی رایگان برای رفع مشکلات و سوالات فنی"
              },
              {
                icon: Code2,
                title: "سورس‌کد کامل",
                description: "دسترسی کامل به سورس‌کد بدون هیچ محدودیتی"
              },
              {
                icon: CheckCircle2,
                title: "مستندات جامع",
                description: "راهنمای نصب و استفاده به همراه هر پروژه"
              },
              {
                icon: Sparkles,
                title: "آپدیت رایگان",
                description: "دریافت آپدیت‌های جدید به صورت رایگان"
              },
            ].map((feature, index) => (
              <div key={index} className="glass-surface rounded-2xl p-6 card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">نظرات مشتریان</h2>
            <p className="text-muted-foreground">آنچه مشتریان ما درباره سورنا می‌گویند</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "علی محمدی",
                role: "توسعه‌دهنده فرانت‌اند",
                content: "کیفیت کدها عالی بود و پشتیبانی سریع پاسخ داد. قطعاً دوباره خرید می‌کنم.",
                rating: 5,
              },
              {
                name: "سارا احمدی",
                role: "مدیر پروژه",
                content: "پروژه‌ها کاملاً مستند هستند و راه‌اندازی خیلی آسان بود. توصیه می‌کنم.",
                rating: 5,
              },
              {
                name: "محمد رضایی",
                role: "فریلنسر",
                content: "با خرید از سورنا، زمان توسعه پروژه‌هایم به نصف کاهش یافت.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <div key={index} className="glass-surface rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-surface rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">آماده شروع هستید؟</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                همین حالا پروژه مورد نظر خود را پیدا کنید و توسعه را شروع کنید
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white gap-2">
                    مشاهده پروژه‌ها
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    ثبت‌نام رایگان
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
