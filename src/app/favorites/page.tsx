import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

// Mock favorites data
const favoriteProducts = [
  {
    id: "1",
    title: "E-commerce Dashboard",
    title_fa: "داشبورد فروشگاه آنلاین",
    slug: "ecommerce-dashboard",
    short_description_fa: "داشبورد مدیریت فروشگاه با React و Next.js",
    price: 2500000,
    discount_price: 1750000,
    difficulty_level: "intermediate" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    rating_average: 4.9,
    rating_count: 128,
    sales_count: 450,
    is_featured: true,
    is_active: true,
    version: "2.0.0",
    view_count: 0,
    support_duration_months: 6,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: true,
    includes_video_tutorial: true,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "1", name: "React", slug: "react", created_at: "" },
      { id: "2", name: "Next.js", slug: "nextjs", created_at: "" },
    ],
  },
  {
    id: "3",
    title: "Mobile App Template",
    title_fa: "قالب اپلیکیشن موبایل",
    slug: "mobile-app-template",
    short_description_fa: "اپلیکیشن موبایل با React Native",
    price: 3200000,
    discount_price: 2400000,
    difficulty_level: "advanced" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    rating_average: 4.8,
    rating_count: 156,
    sales_count: 280,
    is_featured: true,
    is_active: true,
    version: "3.0.0",
    view_count: 0,
    support_duration_months: 6,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: false,
    includes_video_tutorial: true,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "6", name: "React Native", slug: "react-native", created_at: "" },
    ],
  },
];

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

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
          <span className="text-foreground">علاقه‌مندی‌ها</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">علاقه‌مندی‌های من</h1>
            <p className="text-muted-foreground">
              {favoriteProducts.length} پروژه در لیست علاقه‌مندی‌ها
            </p>
          </div>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">لیست علاقه‌مندی‌ها خالی است</h2>
            <p className="text-muted-foreground mb-6">
              پروژه‌های مورد علاقه خود را به این لیست اضافه کنید
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
