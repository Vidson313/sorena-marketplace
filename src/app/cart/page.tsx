import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "../../../supabase/server";
import { getCartItems } from "@/lib/queries";
import CartClient from "@/components/cart-client";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  let cartItems: any[] = [];
  let user: any = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data?.user;
      if (user) {
        cartItems = await getCartItems(user.id);
      }
    } catch {}
  }

  const subtotal = cartItems.reduce((acc: number, item: any) => {
    return acc + Number(item.product.discount_price || item.product.price);
  }, 0);

  const originalTotal = cartItems.reduce((acc: number, item: any) => {
    return acc + Number(item.product.price);
  }, 0);

  const discount = originalTotal - subtotal;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            خانه
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-foreground">سبد خرید</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8">سبد خرید</h1>

        {cartItems.length > 0 ? (
          <CartClient initialCartItems={cartItems} subtotal={subtotal} discount={discount} />
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">سبد خرید شما خالی است</h2>
            <p className="text-muted-foreground mb-6">پروژه‌های مورد نظر خود را به سبد خرید اضافه کنید</p>
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
