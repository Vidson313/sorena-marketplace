"use client";

import Link from "next/link";
import { Star, Eye, ShoppingCart, Heart, Code2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Product, Technology } from "@/types/database";
import { useState, useTransition } from "react";
import { addToCart, toggleFavorite } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "horizontal" | "mini";
}

const difficultyLabels = {
  beginner: { label: "مبتدی", className: "badge-difficulty-beginner" },
  intermediate: { label: "متوسط", className: "badge-difficulty-intermediate" },
  advanced: { label: "پیشرفته", className: "badge-difficulty-advanced" },
};

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.price) - Number(product.discount_price!)) / Number(product.price)) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    const result = await addToCart(product.id);
    setIsAddingToCart(false);

    if (result.error) {
      if (result.error.includes("وارد شوید")) {
        router.push("/sign-in");
      }
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

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await toggleFavorite(product.id);
      if (result.error) {
        if (result.error.includes("وارد شوید")) {
          router.push("/sign-in");
        }
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

  if (variant === "horizontal") {
    return (
      <div className="glass-surface rounded-2xl p-4 card-hover flex gap-4">
        <div className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={product.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80"}
            alt={product.title_fa}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{product.title_fa}</h3>
          <p className="text-xs text-muted-foreground truncate mt-1">
            {product.short_description_fa}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs">{product.rating_average}</span>
            </div>
            <div className="text-left">
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through ml-2">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-sm font-bold text-primary">
                {formatPrice(hasDiscount ? product.discount_price! : product.price)} تومان
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "mini") {
    return (
      <Link href={`/products/${product.slug}`}>
        <div className="glass-surface rounded-xl p-3 card-hover">
          <div className="aspect-video rounded-lg overflow-hidden mb-2">
            <img
              src={product.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80"}
              alt={product.title_fa}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-medium text-sm truncate">{product.title_fa}</h3>
          <p className="text-xs text-primary font-semibold mt-1">
            {formatPrice(hasDiscount ? product.discount_price! : product.price)} تومان
          </p>
        </div>
      </Link>
    );
  }

  return (
    <div className="glass-surface rounded-2xl overflow-hidden card-hover-enhanced group">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={product.thumbnail_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"}
          alt={product.title_fa}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <Button size="sm" variant="secondary" className="flex-1 rounded-full text-xs">
              <Eye className="w-3 h-3 ml-1" />
              پیش‌نمایش
            </Button>
            <Button size="sm" variant="secondary" className="rounded-full">
              <Code2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="badge-discount">{discountPercent}٪ تخفیف</span>
          )}
          {product.is_featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary text-white">
              ویژه
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          onClick={handleToggleFavorite}
          disabled={isPending}
          className={`absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors ${
            isFavorite ? "bg-red-500/80" : "bg-white/20"
          }`}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Heart className={`w-4 h-4 text-white ${isFavorite ? "fill-white" : ""}`} />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Description */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-base mb-1 hover:text-primary transition-colors line-clamp-1">
            {product.title_fa}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
          {product.short_description_fa || product.title}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.technologies?.slice(0, 3).map((tech) => (
            <span key={tech.id} className="badge-tech">
              {tech.name}
            </span>
          ))}
          {(product.technologies?.length || 0) > 3 && (
            <span className="badge-tech">+{(product.technologies?.length || 0) - 3}</span>
          )}
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className={difficultyLabels[product.difficulty_level].className}>
            {difficultyLabels[product.difficulty_level].label}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{product.rating_average}</span>
            <span className="text-muted-foreground">({product.rating_count})</span>
          </div>
          <span>{formatPrice(product.sales_count)} فروش</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div className="text-right">
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through block">
                {formatPrice(product.price)} تومان
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              {formatPrice(hasDiscount ? product.discount_price! : product.price)} تومان
            </span>
          </div>
          <Button 
            size="sm" 
            className="rounded-full px-4 bg-primary hover:bg-primary/90 text-white"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <Loader2 className="w-4 h-4 ml-1 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4 ml-1" />
            )}
            خرید
          </Button>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader
export function ProductCardSkeleton() {
  return (
    <div className="glass-surface rounded-2xl overflow-hidden">
      <div className="aspect-video shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 shimmer rounded" />
        <div className="h-4 w-full shimmer rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 shimmer rounded-full" />
          <div className="h-5 w-16 shimmer rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-24 shimmer rounded" />
          <div className="h-8 w-20 shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}
