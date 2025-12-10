import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { forgotPasswordAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-background px-4 py-8">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold">بازیابی رمز عبور</h1>
            <p className="text-muted-foreground mt-2">
              ایمیل خود را وارد کنید تا لینک بازیابی برایتان ارسال شود
            </p>
          </div>

          <div className="glass-surface rounded-2xl p-8">
            <UrlProvider>
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
                </div>

                <SubmitButton
                  formAction={forgotPasswordAction}
                  pendingText="در حال ارسال..."
                  className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 text-white"
                >
                  ارسال لینک بازیابی
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </SubmitButton>

                <FormMessage message={searchParams} />
              </form>
            </UrlProvider>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">رمز عبور را به یاد آوردید؟</span>{" "}
              <Link
                className="text-primary font-medium hover:underline transition-all"
                href="/sign-in"
              >
                وارد شوید
              </Link>
            </div>
          </div>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
