"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Tag,
  Shield,
  Download,
  Zap,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeFromCart, validateDiscountCode, createOrder, processPayment } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";

interface CartClientProps {
  initialCartItems: any[];
  subtotal: number;
  discount: number;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fa-IR").format(price);
};

export default function CartClient({
  initialCartItems,
  subtotal,
  discount,
}: CartClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
    description?: string;
  } | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const currentSubtotal = cartItems.reduce((acc: number, item: any) => {
    return acc + Number(item.product.discount_price || item.product.price);
  }, 0);

  const currentOriginalTotal = cartItems.reduce((acc: number, item: any) => {
    return acc + Number(item.product.price);
  }, 0);

  const currentDiscount = currentOriginalTotal - currentSubtotal + (appliedDiscount?.amount || 0);
  const total = currentSubtotal - (appliedDiscount?.amount || 0);

  const handleRemoveItem = async (productId: string) => {
    startTransition(async () => {
      const result = await removeFromCart(productId);
      if (result.error) {
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
        toast({
          title: "حذف شد",
          description: "محصول از سبد خرید حذف شد",
        });
        router.refresh();
      }
    });
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsApplyingDiscount(true);
    const result = await validateDiscountCode(discountCode, currentSubtotal);
    setIsApplyingDiscount(false);

    if (result.error) {
      toast({
        title: "کد تخفیف نامعتبر",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.discount) {
      setAppliedDiscount({
        code: result.discount.code,
        amount: result.discount.discountAmount,
        description: result.discount.description,
      });
      toast({
        title: "کد تخفیف اعمال شد",
        description: `${formatPrice(result.discount.discountAmount)} تومان تخفیف`,
      });
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    const result = await createOrder(appliedDiscount?.code);

    if (result.error) {
      toast({
        title: "خطا در ایجاد سفارش",
        description: result.error,
        variant: "destructive",
      });
      setIsCheckingOut(false);
      return;
    }

    // Simulate payment gateway redirect (in production, redirect to actual gateway)
    toast({
      title: "در حال انتقال به درگاه پرداخت...",
      description: `مبلغ: ${formatPrice(total)} تومان`,
    });

    // Simulate payment success after 2 seconds
    setTimeout(async () => {
      const paymentResult = await processPayment(result.orderId!, `PAY-${Date.now()}`);
      
      if (paymentResult.error) {
        toast({
          title: "خطا در پرداخت",
          description: paymentResult.error,
          variant: "destructive",
        });
        setIsCheckingOut(false);
      } else {
        toast({
          title: "پرداخت موفق",
          description: "سفارش شما با موفقیت ثبت شد",
        });
        router.push(`/dashboard?order=${result.orderNumber}`);
      }
    }, 2000);
  };

  if (cartItems.length === 0) {
    router.refresh();
    return null;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item: any) => (
          <div
            key={item.id}
            className="glass-surface rounded-2xl p-4 flex gap-4"
          >
            <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={item.product.thumbnail_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&q=80"}
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
                      {formatPrice(Number(item.product.price))} تومان
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(Number(item.product.discount_price))} تومان
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(Number(item.product.price))} تومان
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending}
              onClick={() => handleRemoveItem(item.product_id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
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
          {appliedDiscount ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  {appliedDiscount.code}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAppliedDiscount(null)}
                className="text-destructive hover:text-destructive h-auto p-1"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="کد تخفیف را وارد کنید"
                className="flex-1 h-10 px-4 rounded-full bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button
                className="rounded-full px-6"
                onClick={handleApplyDiscount}
                disabled={isApplyingDiscount || !discountCode.trim()}
              >
                {isApplyingDiscount ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "اعمال"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="glass-surface rounded-2xl p-6">
          <h3 className="font-semibold mb-4">خلاصه سفارش</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">جمع کل</span>
              <span>{formatPrice(currentOriginalTotal)} تومان</span>
            </div>
            {currentOriginalTotal - currentSubtotal > 0 && (
              <div className="flex justify-between text-green-500">
                <span>تخفیف محصولات</span>
                <span>-{formatPrice(currentOriginalTotal - currentSubtotal)} تومان</span>
              </div>
            )}
            {appliedDiscount && (
              <div className="flex justify-between text-green-500">
                <span>کد تخفیف ({appliedDiscount.code})</span>
                <span>-{formatPrice(appliedDiscount.amount)} تومان</span>
              </div>
            )}
            <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-primary">{formatPrice(total)} تومان</span>
            </div>
          </div>

          <Button
            className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white mt-6 gap-2"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال پردازش...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                ادامه و پرداخت
              </>
            )}
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
  );
}
