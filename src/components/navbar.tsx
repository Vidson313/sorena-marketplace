import Link from 'next/link'
import { createClient } from '../../supabase/server'
import { Button } from './ui/button'
import { ShoppingCart, Search, Menu, User, Heart } from 'lucide-react'
import UserProfile from './user-profile'
import { ThemeSwitcher } from './theme-switcher'

export default async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()

  const categories = [
    { name: 'وب اپلیکیشن', href: '/products?category=web-applications' },
    { name: 'موبایل', href: '/products?category=mobile-apps' },
    { name: 'وردپرس', href: '/products?category=wordpress' },
    { name: 'فروشگاهی', href: '/products?category=ecommerce' },
    { name: 'داشبورد', href: '/products?category=dashboard-admin' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full glass-surface-strong border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">س</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">سورنا</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجوی پروژه..."
                className="w-full h-10 pr-10 pl-4 rounded-full bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            
            {user ? (
              <>
                <Link href="/favorites">
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                      0
                    </span>
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm" className="hidden sm:flex">
                    داشبورد
                  </Button>
                </Link>
                <UserProfile />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    ورود
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                    ثبت‌نام
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
