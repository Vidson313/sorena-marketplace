"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { submitReview } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  productId: string;
  isLoggedIn: boolean;
  hasPurchased: boolean;
}

export default function ReviewForm({
  productId,
  isLoggedIn,
  hasPurchased,
}: ReviewFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast({
        title: "ورود لازم است",
        description: "لطفاً ابتدا وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    if (rating === 0) {
      toast({
        title: "خطا",
        description: "لطفاً امتیاز خود را انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.set("productId", productId);
    formData.set("rating", rating.toString());
    formData.set("title", title);
    formData.set("content", content);

    startTransition(async () => {
      const result = await submitReview(formData);
      if (result.error) {
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "ثبت شد",
          description: result.message,
        });
        setRating(0);
        setTitle("");
        setContent("");
        router.refresh();
      }
    });
  };

  return (
    <div className="glass-surface rounded-2xl p-6">
      <h3 className="font-semibold mb-4">ثبت نظر</h3>
      
      {!isLoggedIn ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">
            برای ثبت نظر ابتدا وارد شوید
          </p>
          <Button
            className="rounded-full"
            onClick={() => router.push("/sign-in")}
          >
            ورود به حساب
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium block mb-2">امتیاز شما</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium block mb-2">عنوان نظر</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="خلاصه نظر شما"
              className="w-full h-10 px-4 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium block mb-2">متن نظر</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="نظر کامل خود را بنویسید..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {hasPurchased && (
            <p className="text-xs text-green-500 flex items-center gap-1">
              <Star className="w-3 h-3 fill-green-500" />
              خریدار تأیید شده
            </p>
          )}

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isPending || rating === 0}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : null}
            ثبت نظر
          </Button>
        </form>
      )}
    </div>
  );
}
