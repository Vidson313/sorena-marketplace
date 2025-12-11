import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-9xl font-bold gradient-text mb-4">۴۰۴</div>
          <h1 className="text-2xl font-bold mb-2">صفحه مورد نظر یافت نشد</h1>
          <p className="text-muted-foreground">
            متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 rounded-full px-6">
              <Home className="w-4 h-4" />
              صفحه اصلی
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="gap-2 rounded-full px-6">
              <Search className="w-4 h-4" />
              جستجوی پروژه‌ها
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 glass-surface rounded-2xl">
          <p className="text-sm text-muted-foreground mb-4">
            شاید این لینک‌ها به شما کمک کنند:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/products?category=web-applications" className="text-sm text-primary hover:underline">
              وب اپلیکیشن
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/products?category=mobile-apps" className="text-sm text-primary hover:underline">
              موبایل
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/products?category=wordpress" className="text-sm text-primary hover:underline">
              وردپرس
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/sign-up" className="text-sm text-primary hover:underline">
              ثبت‌نام
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
