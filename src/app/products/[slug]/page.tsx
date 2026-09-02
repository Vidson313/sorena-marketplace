import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Download,
  FileText,
  Video,
  Database,
  Code2,
  Shield,
  Clock,
  ExternalLink,
  Eye,
  ChevronLeft,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getProductReviews } from "@/lib/queries";
import { createClient, isSupabaseConfigured } from "../../../../supabase/server";
import ProductActions from "@/components/product-actions";

export const dynamic = "force-dynamic";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let user: any = null;
  let hasPurchased = false;
  let isFavorite = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    } catch {}
  }

  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product.id);

  // Get related products (same category)
  const relatedResult = await getProducts({ category: product.category?.slug });
  const relatedProducts = relatedResult.products
    .filter((p: any) => p.id !== product.id)
    .slice(0, 3);

  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            خانه
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary">
            پروژه‌ها
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href={`/products?category=${product.category?.slug}`} className="hover:text-primary">
            {product.category?.name_fa || "دسته‌بندی"}
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
                <img src={product.thumbnail_url} alt={product.title_fa} className="w-full h-full object-cover" />
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
                      {product.technologies?.map((tech: any) => (
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
                        <span>{formatDate(product.updated_at)}</span>
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
                <div className="flex items-center gap-6 p-4 rounded-xl bg-muted/50">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{product.rating_average}</div>
                    <div className="flex items-center gap-1 justify-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.rating_average) ? "text-yellow-500 fill-yellow-500" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">از {product.rating_count} نظر</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="p-4 rounded-xl bg-muted/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">{review.user?.name?.[0] || "U"}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.user?.name || "کاربر"}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                          <ThumbsUp className="w-3 h-3" />
                          مفید بود ({review.helpful_count || 0})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="qa">
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">سوالی دارید؟ از ما بپرسید</p>
                  <Button>ارسال سوال</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-surface rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">{product.title_fa}</h1>
              </div>

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

              <div className="mb-6">
                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground line-through">{formatPrice(product.price)} تومان</span>
                    <span className="badge-discount">{discountPercent}٪ تخفیف</span>
                  </div>
                )}
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(hasDiscount ? product.discount_price! : product.price)} تومان
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <ProductActions
                  productId={product.id}
                  isFavorite={isFavorite}
                  isLoggedIn={!!user}
                  hasPurchased={hasPurchased}
                />
                {product.demo_url && (
                  <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full h-12 rounded-full gap-2">
                      <Eye className="w-5 h-5" />
                      مشاهده دمو
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}
              </div>

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
            {relatedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
