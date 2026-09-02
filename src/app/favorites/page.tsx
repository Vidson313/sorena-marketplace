import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "../../../supabase/server";
import { getFavorites } from "@/lib/queries";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  let favoriteProducts: any[] = MOCK_PRODUCTS.slice(0, 2);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const favorites = await getFavorites(data.user.id);
        if (favorites.length > 0) {
          favoriteProducts = favorites.map((fav: any) => fav.product);
        }
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
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
            <p className="text-muted-foreground">{favoriteProducts.length} پروژه در لیست علاقه‌مندی‌ها</p>
          </div>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">لیست علاقه‌مندی‌ها خالی است</h2>
            <p className="text-muted-foreground mb-6">پروژه‌های مورد علاقه خود را به این لیست اضافه کنید</p>
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
