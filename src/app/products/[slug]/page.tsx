import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Heart,
  ShoppingCart,
  Download,
  FileText,
  Video,
  Database,
  Code2,
  Shield,
  Clock,
  CheckCircle2,
  ExternalLink,
  Eye,
  Share2,
  ChevronLeft,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";

// Mock product data
const product = {
  id: "1",
  title: "E-commerce Dashboard",
  title_fa: "داشبورد فروشگاه آنلاین",
  slug: "ecommerce-dashboard",
  description_fa: `
    این داشبورد فروشگاهی یک راه‌حل کامل برای مدیریت فروشگاه آنلاین شماست. 
    با استفاده از React و Next.js ساخته شده و شامل تمام امکانات مورد نیاز برای مدیریت محصولات، سفارشات، مشتریان و گزارش‌های فروش است.
    
    این پروژه شامل:
    - داشبورد تحلیلی با نمودارهای پیشرفته
    - مدیریت محصولات با قابلیت آپلود تصاویر
    - سیستم مدیریت سفارشات
    - مدیریت مشتریان و کاربران
    - گزارش‌های فروش و درآمد
    - سیستم احراز هویت کامل
    - طراحی ریسپانسیو برای موبایل
    - حالت تاریک و روشن
  `,
  short_description_fa: "داشبورد مدیریت فروشگاه با React و Next.js",
  price: 2500000,
  discount_price: 1750000,
  difficulty_level: "intermediate" as const,
  thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  preview_images: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
  ],
  demo_url: "https://demo.example.com",
  rating_average: 4.9,
  rating_count: 128,
  sales_count: 450,
  view_count: 2340,
  is_featured: true,
  is_active: true,
  version: "2.0.0",
  support_duration_months: 6,
  includes_source_code: true,
  includes_documentation: true,
  includes_database: true,
  includes_video_tutorial: true,
  created_at: "2024-01-15",
  updated_at: "2024-03-20",
  technologies: [
    { id: "1", name: "React", slug: "react", created_at: "" },
    { id: "2", name: "Next.js", slug: "nextjs", created_at: "" },
    { id: "3", name: "Tailwind CSS", slug: "tailwindcss", created_at: "" },
    { id: "4", name: "TypeScript", slug: "typescript", created_at: "" },
    { id: "5", name: "Supabase", slug: "supabase", created_at: "" },
  ],
  category: {
    id: "1",
    name: "Dashboard & Admin",
    name_fa: "داشبورد و پنل مدیریت",
    slug: "dashboard-admin",
    created_at: "",
    updated_at: "",
  },
};

const reviews = [
  {
    id: "1",
    user: { name: "علی محمدی", avatar: null },
    rating: 5,
    title: "عالی بود!",
    content: "کیفیت کد بسیار بالاست و مستندات کامل است. پشتیبانی هم سریع پاسخ داد.",
    created_at: "2024-03-15",
    helpful_count: 12,
  },
  {
    id: "2",
    user: { name: "سارا احمدی", avatar: null },
    rating: 5,
    title: "توصیه می‌کنم",
    content: "راه‌اندازی خیلی آسان بود و همه چیز طبق مستندات کار کرد.",
    created_at: "2024-03-10",
    helpful_count: 8,
  },
  {
    id: "3",
    user: { name: "محمد رضایی", avatar: null },
    rating: 4,
    title: "خوب ولی نیاز به بهبود دارد",
    content: "در کل راضی هستم ولی بعضی قسمت‌ها می‌توانست بهتر باشد.",
    created_at: "2024-03-05",
    helpful_count: 3,
  },
];

const relatedProducts = [
  {
    id: "2",
    title: "Blog Platform",
    title_fa: "پلتفرم بلاگ حرفه‌ای",
    slug: "blog-platform",
    short_description_fa: "سیستم مدیریت محتوا با Laravel و Vue.js",
    price: 1800000,
    discount_price: undefined,
    difficulty_level: "beginner" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    rating_average: 4.7,
    rating_count: 89,
    sales_count: 320,
    is_featured: true,
    is_active: true,
    version: "1.5.0",
    view_count: 0,
    support_duration_months: 6,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: true,
    includes_video_tutorial: false,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "4", name: "Laravel", slug: "laravel", created_at: "" },
      { id: "5", name: "Vue.js", slug: "vuejs", created_at: "" },
    ],
  },
  {
    id: "4",
    title: "Admin Panel",
    title_fa: "پنل مدیریت پیشرفته",
    slug: "admin-panel",
    short_description_fa: "پنل ادمین با امکانات کامل",
    price: 2100000,
    discount_price: undefined,
    difficulty_level: "intermediate" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    rating_average: 4.6,
    rating_count: 72,
    sales_count: 195,
    is_featured: false,
    is_active: true,
    version: "1.8.0",
    view_count: 0,
    support_duration_months: 6,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: true,
    includes_video_tutorial: false,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "1", name: "React", slug: "react", created_at: "" },
      { id: "8", name: "Node.js", slug: "nodejs", created_at: "" },
    ],
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">خانه</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary">پروژه‌ها</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href={`/products?category=${product.category?.slug}`} className="hover:text-primary">
            {product.category?.name_fa}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">{product.title_fa}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="glass-surface rounded-2xl overflow-hidden">
              <div className="aspect-video">
                <img
                  src={product.thumbnail_url}
                  alt={product.title_fa}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex gap-3 overflow-x-auto">
                {product.preview_images?.map((img, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 ${
                      index === 0 ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="glass-surface rounded-2xl p-6">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="description">توضیحات</TabsTrigger>
                <TabsTrigger value="specs">مشخصات</TabsTrigger>
                <TabsTrigger value="reviews">نظرات ({product.rating_count})</TabsTrigger>
                <TabsTrigger value="qa">پرسش و پاسخ</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description_fa}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h4 className="font-medium mb-3">تکنولوژی‌ها</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.technologies?.map((tech) => (
                        <span key={tech.id} className="badge-tech">
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h4 className="font-medium mb-3">اطلاعات فنی</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">نسخه</span>
                        <span>{product.version}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">آخرین بروزرسانی</span>
                        <span>{product.updated_at}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">سطح دشواری</span>
                        <span>
                          {product.difficulty_level === "beginner" && "مبتدی"}
                          {product.difficulty_level === "intermediate" && "متوسط"}
                          {product.difficulty_level === "advanced" && "پیشرفته"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {/* Rating Summary */}
                <div className="flex items-center gap-6 p-4 rounded-xl bg-muted/50">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{product.rating_average}</div>
                    <div className="flex items-center gap-1 justify-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.rating_average)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      از {product.rating_count} نظر
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {review.user.name[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.user.name}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {review.created_at}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                          <ThumbsUp className="w-3 h-3" />
                          مفید بود ({review.helpful_count})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="qa">
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">
                    سوالی دارید؟ از ما بپرسید
                  </p>
                  <Button>ارسال سوال</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="glass-surface rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">{product.title_fa}</h1>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Rating & Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{product.rating_average}</span>
                  <span className="text-muted-foreground">({product.rating_count})</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">{formatPrice(product.sales_count)} فروش</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">{formatPrice(product.view_count)} بازدید</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground line-through">
                      {formatPrice(product.price)} تومان
                    </span>
                    <span className="badge-discount">{discountPercent}٪ تخفیف</span>
                  </div>
                )}
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(hasDiscount ? product.discount_price! : product.price)} تومان
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <Button className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  افزودن به سبد خرید
                </Button>
                {product.demo_url && (
                  <Button variant="outline" className="w-full h-12 rounded-full gap-2">
                    <Eye className="w-5 h-5" />
                    مشاهده دمو
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* What's Included */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4">شامل می‌شود:</h3>
                <ul className="space-y-3">
                  {product.includes_source_code && (
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-green-500" />
                      </div>
                      <span>سورس‌کد کامل</span>
                    </li>
                  )}
                  {product.includes_documentation && (
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-500" />
                      </div>
                      <span>مستندات کامل</span>
                    </li>
                  )}
                  {product.includes_database && (
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Database className="w-4 h-4 text-purple-500" />
                      </div>
                      <span>فایل دیتابیس</span>
                    </li>
                  )}
                  {product.includes_video_tutorial && (
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <Video className="w-4 h-4 text-red-500" />
                      </div>
                      <span>آموزش ویدیویی</span>
                    </li>
                  )}
                  <li className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span>پشتیبانی {product.support_duration_months} ماهه</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Download className="w-4 h-4 text-cyan-500" />
                    </div>
                    <span>آپدیت رایگان</span>
                  </li>
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-border pt-6 mt-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>پرداخت امن با درگاه‌های معتبر</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">پروژه‌های مشابه</h2>
            <Link href="/products">
              <Button variant="outline" className="rounded-full">
                مشاهده همه
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
