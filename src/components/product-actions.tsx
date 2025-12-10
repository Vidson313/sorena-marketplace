"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Loader2, Share2 } from "lucide-react";
import { addToCart, toggleFavorite } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  productId: string;
  isFavorite: boolean;
  isLoggedIn: boolean;
  hasPurchased: boolean;
}

export default function ProductActions({
  productId,
  isFavorite: initialIsFavorite,
  isLoggedIn,
  hasPurchased,
}: ProductActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast({
        title: "ورود لازم است",
        description: "لطفاً ابتدا وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    setIsAddingToCart(true);
    const result = await addToCart(productId);
    setIsAddingToCart(false);

    if (result.error) {
      toast({
        title: "خطا",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "اضافه شد",
        description: result.message,
      });
      router.refresh();
    }
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast({
        title: "ورود لازم است",
        description: "لطفاً ابتدا وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    startTransition(async () => {
      const result = await toggleFavorite(productId);
      if (result.error) {
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setIsFavorite(result.isFavorite!);
        toast({
          title: result.isFavorite ? "اضافه شد" : "حذف شد",
          description: result.isFavorite
            ? "به علاقه‌مندی‌ها اضافه شد"
            : "از علاقه‌مندی‌ها حذف شد",
        });
      }
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "کپی شد",
        description: "لینک محصول در کلیپبورد کپی شد",
      });
    }
  };

  return (
    <div className="space-y-4">
      {hasPurchased ? (
        <Button className="w-full h-12 rounded-full bg-green-600 hover:bg-green-700 text-white gap-2">
          <ShoppingCart className="w-5 h-5" />
          دانلود محصول
        </Button>
      ) : (
        <Button
          className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white gap-2"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ShoppingCart className="w-5 h-5" />
          )}
          افزودن به سبد خرید
        </Button>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          className={`flex-1 rounded-full gap-2 ${
            isFavorite ? "border-red-500 text-red-500" : ""
          }`}
          onClick={handleToggleFavorite}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500" : ""}`} />
          )}
          {isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
