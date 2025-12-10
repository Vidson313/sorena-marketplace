'use client'

import Link from 'next/link'
import { createClient } from '../../supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { 
  UserCircle, 
  Home, 
  Package, 
  Download, 
  Heart, 
  MessageSquare, 
  Settings, 
  LogOut,
  ShoppingCart,
  Search
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ThemeSwitcher } from './theme-switcher'

export default function DashboardNavbar() {
  const supabase = createClient()
  const router = useRouter()

  const menuItems = [
    { name: 'داشبورد', href: '/dashboard', icon: Home },
    { name: 'خریدهای من', href: '/dashboard/purchases', icon: Package },
    { name: 'دانلودها', href: '/dashboard/downloads', icon: Download },
    { name: 'علاقه‌مندی‌ها', href: '/favorites', icon: Heart },
    { name: 'پشتیبانی', href: '/dashboard/support', icon: MessageSquare },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full glass-surface-strong border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">س</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">سورنا</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
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
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">حساب کاربری</p>
                  <p className="text-xs text-muted-foreground">مدیریت حساب</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    داشبورد
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/purchases" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    خریدهای من
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    تنظیمات
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    router.push('/')
                    router.refresh()
                  }}
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  خروج از حساب
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
