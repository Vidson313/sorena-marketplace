"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, Send } from "lucide-react";
import { submitQuestion } from "@/app/actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface QuestionFormProps {
  productId: string;
  isLoggedIn: boolean;
}

export default function QuestionForm({
  productId,
  isLoggedIn,
}: QuestionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [question, setQuestion] = useState("");

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

    if (question.trim().length < 10) {
      toast({
        title: "خطا",
        description: "سؤال باید حداقل ۱۰ کاراکتر باشد",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.set("productId", productId);
    formData.set("question", question);

    startTransition(async () => {
      const result = await submitQuestion(formData);
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
        setQuestion("");
        router.refresh();
      }
    });
  };

  return (
    <div className="glass-surface rounded-2xl p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        سؤال خود را بپرسید
      </h3>
      
      {!isLoggedIn ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">
            برای ثبت سؤال ابتدا وارد شوید
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
          <div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="سؤال خود را درباره این محصول بنویسید..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="rounded-full gap-2"
            disabled={isPending || question.trim().length < 10}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            ارسال سؤال
          </Button>
        </form>
      )}
    </div>
  );
}
