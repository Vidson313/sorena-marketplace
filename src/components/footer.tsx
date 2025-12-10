import Link from 'next/link';
import { Twitter, Linkedin, Github, Instagram, Send, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'وب اپلیکیشن', href: '/products?category=web-applications' },
    { name: 'موبایل', href: '/products?category=mobile-apps' },
    { name: 'وردپرس', href: '/products?category=wordpress' },
    { name: 'فروشگاهی', href: '/products?category=ecommerce' },
    { name: 'داشبورد', href: '/products?category=dashboard-admin' },
  ];

  const support = [
    { name: 'مرکز راهنما', href: '/help' },
    { name: 'سوالات متداول', href: '/faq' },
    { name: 'تماس با ما', href: '/contact' },
    { name: 'پشتیبانی', href: '/support' },
  ];

  const company = [
    { name: 'درباره ما', href: '/about' },
    { name: 'بلاگ', href: '/blog' },
    { name: 'همکاری با ما', href: '/careers' },
    { name: 'قوانین و مقررات', href: '/terms' },
    { name: 'حریم خصوصی', href: '/privacy' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="glass-surface rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-right">
              <h3 className="text-xl font-bold mb-2">عضویت در خبرنامه</h3>
              <p className="text-muted-foreground text-sm">
                از جدیدترین پروژه‌ها و تخفیف‌های ویژه باخبر شوید
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 lg:w-80 h-12 px-5 rounded-full bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-white">
                <Send className="w-4 h-4 ml-2" />
                عضویت
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">س</span>
              </div>
              <span className="text-xl font-bold gradient-text">سورنا</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              پلتفرم فروش پروژه‌های آماده برنامه‌نویسی با کیفیت بالا و پشتیبانی کامل
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">پشتیبانی</h4>
            <ul className="space-y-2">
              {support.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">سورنا</h4>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">تماس با ما</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@sorena.ir</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>تهران، خیابان ولیعصر</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} سورنا. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&q=80" alt="Payment" className="h-8 rounded opacity-70" />
              <span className="text-xs text-muted-foreground">پرداخت امن با درگاه‌های معتبر</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
