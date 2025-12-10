import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, Lock, ArrowLeft } from "lucide-react";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-background px-4 py-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-2xl">س</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold">ورود به سورنا</h1>
            <p className="text-muted-foreground mt-2">
              به حساب کاربری خود وارد شوید
            </p>
          </div>

          <div className="glass-surface rounded-2xl p-8">
            <form className="flex flex-col space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    ایمیل
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      className="w-full pr-10 h-11 rounded-xl"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium">
                      رمز عبور
                    </Label>
                    <Link
                      className="text-xs text-primary hover:underline transition-all"
                      href="/forgot-password"
                    >
                      فراموشی رمز عبور
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      className="w-full pr-10 h-11 rounded-xl"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <SubmitButton
                className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 text-white"
                pendingText="در حال ورود..."
                formAction={signInAction}
              >
                ورود به حساب
                <ArrowLeft className="w-4 h-4 mr-2" />
              </SubmitButton>

              <FormMessage message={message} />
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">حساب کاربری ندارید؟</span>{" "}
              <Link
                className="text-primary font-medium hover:underline transition-all"
                href="/sign-up"
              >
                ثبت‌نام کنید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
