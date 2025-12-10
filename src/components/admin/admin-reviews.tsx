"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  Settings,
  Search,
  Star,
  CheckCircle,
  XCircle,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { approveReview, answerQuestion } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";

interface AdminReviewsClientProps {
  user: User;
  reviews: any[];
  questions: any[];
}

const sidebarItems = [
  { name: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { name: "محصولات", href: "/admin/products", icon: Package },
  { name: "سفارشات", href: "/admin/orders", icon: ShoppingCart },
  { name: "کاربران", href: "/admin/users", icon: Users },
  { name: "آمار و گزارش", href: "/admin/analytics", icon: BarChart3 },
  { name: "نظرات", href: "/admin/reviews", icon: Star },
  { name: "پشتیبانی", href: "/admin/support", icon: MessageSquare },
  { name: "تنظیمات", href: "/admin/settings", icon: Settings },
];

export default function AdminReviewsClient({ user, reviews, questions }: AdminReviewsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [answerText, setAnswerText] = useState<Record<string, string>>({});

  const pendingReviews = reviews.filter((r: any) => !r.is_approved);
  const approvedReviews = reviews.filter((r: any) => r.is_approved);
  const unansweredQuestions = questions.filter((q: any) => !q.answer);

  const handleApproveReview = async (reviewId: string, approved: boolean) => {
    startTransition(async () => {
      const result = await approveReview(reviewId, approved);
      if (result.error) {
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: approved ? "تأیید شد" : "رد شد",
          description: approved ? "نظر تأیید و منتشر شد" : "نظر رد شد",
        });
        router.refresh();
      }
    });
  };

  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerText[questionId];
    if (!answer?.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً پاسخ را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.set("questionId", questionId);
    formData.set("answer", answer);

    startTransition(async () => {
      const result = await answerQuestion(formData);
      if (result.error) {
        toast({
          title: "خطا",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "ثبت شد",
          description: "پاسخ با موفقیت ثبت شد",
        });
        setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col glass-surface-strong border-l border-border/40 fixed h-full">
        <div className="p-6 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">س</span>
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">سورنا</span>
              <p className="text-xs text-muted-foreground">پنل مدیریت</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  item.href === "/admin/reviews" ? "bg-primary/10 text-primary" : ""
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">مدیر</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:mr-64">
        <header className="sticky top-0 z-40 glass-surface-strong border-b border-border/40">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">نظرات و پرسش‌ها</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-surface rounded-2xl p-5">
              <p className="text-2xl font-bold">{reviews.length}</p>
              <p className="text-sm text-muted-foreground">کل نظرات</p>
            </div>
            <div className="glass-surface rounded-2xl p-5">
              <p className="text-2xl font-bold text-yellow-500">{pendingReviews.length}</p>
              <p className="text-sm text-muted-foreground">در انتظار تأیید</p>
            </div>
            <div className="glass-surface rounded-2xl p-5">
              <p className="text-2xl font-bold">{questions.length}</p>
              <p className="text-sm text-muted-foreground">کل پرسش‌ها</p>
            </div>
            <div className="glass-surface rounded-2xl p-5">
              <p className="text-2xl font-bold text-orange-500">{unansweredQuestions.length}</p>
              <p className="text-sm text-muted-foreground">بدون پاسخ</p>
            </div>
          </div>

          <Tabs defaultValue="reviews" className="space-y-6">
            <TabsList className="glass-surface">
              <TabsTrigger value="reviews" className="gap-2">
                <Star className="w-4 h-4" />
                نظرات ({pendingReviews.length} در انتظار)
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                پرسش‌ها ({unansweredQuestions.length} بدون پاسخ)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              {pendingReviews.length === 0 && approvedReviews.length === 0 ? (
                <div className="text-center py-12 glass-surface rounded-2xl">
                  <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">نظری ثبت نشده است</p>
                </div>
              ) : (
                <>
                  {pendingReviews.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-yellow-500">در انتظار تأیید</h3>
                      {pendingReviews.map((review: any) => (
                        <div key={review.id} className="glass-surface rounded-2xl p-5 border-l-4 border-yellow-500">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{review.user?.name || review.user?.email || "کاربر"}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                {review.is_verified_purchase && (
                                  <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                                    خریدار تأیید شده
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium mb-1">{review.title}</p>
                              <p className="text-sm text-muted-foreground mb-2">{review.content}</p>
                              <Link href={`/products/${review.product?.slug}`} className="text-xs text-primary hover:underline">
                                {review.product?.title_fa}
                              </Link>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-500 border-green-500 hover:bg-green-500/10"
                                onClick={() => handleApproveReview(review.id, true)}
                                disabled={isPending}
                              >
                                <CheckCircle className="w-4 h-4 ml-1" />
                                تأیید
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-500/10"
                                onClick={() => handleApproveReview(review.id, false)}
                                disabled={isPending}
                              >
                                <XCircle className="w-4 h-4 ml-1" />
                                رد
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {approvedReviews.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <h3 className="font-semibold text-green-500">تأیید شده</h3>
                      {approvedReviews.slice(0, 10).map((review: any) => (
                        <div key={review.id} className="glass-surface rounded-2xl p-5 opacity-75">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.user?.name || "کاربر"}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              {questions.length === 0 ? (
                <div className="text-center py-12 glass-surface rounded-2xl">
                  <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">پرسشی ثبت نشده است</p>
                </div>
              ) : (
                <>
                  {unansweredQuestions.map((question: any) => (
                    <div key={question.id} className="glass-surface rounded-2xl p-5 border-l-4 border-orange-500">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{question.user?.name || question.user?.email || "کاربر"}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(question.created_at).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{question.question}</p>
                        <Link href={`/products/${question.product?.slug}`} className="text-xs text-primary hover:underline">
                          {question.product?.title_fa}
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <textarea
                          placeholder="پاسخ خود را بنویسید..."
                          value={answerText[question.id] || ""}
                          onChange={(e) => setAnswerText((prev) => ({ ...prev, [question.id]: e.target.value }))}
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAnswerQuestion(question.id)}
                          disabled={isPending || !answerText[question.id]?.trim()}
                        >
                          {isPending ? <Loader2 className="w-4 h-4 animate-spin ml-1" /> : null}
                          ارسال پاسخ
                        </Button>
                      </div>
                    </div>
                  ))}

                  {questions.filter((q: any) => q.answer).map((question: any) => (
                    <div key={question.id} className="glass-surface rounded-2xl p-5 opacity-75">
                      <div className="mb-2">
                        <span className="font-medium">{question.user?.name || "کاربر"}: </span>
                        <span className="text-sm">{question.question}</span>
                      </div>
                      <div className="bg-primary/5 rounded-xl p-3">
                        <span className="text-xs text-primary font-medium">پاسخ: </span>
                        <span className="text-sm">{question.answer}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
