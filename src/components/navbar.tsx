"use client";

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { ShoppingCart, Search, Menu, User, Heart, X } from 'lucide-react'
import { ThemeSwitcher } from './theme-switcher'
import { useState, useEffect } from 'react'
import { createClient } from '../../supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { name: 'وب اپلیکیشن', href: '/products?category=web-applications' },
    { name: 'موبایل', href: '/products?category=mobile-apps' },
    { name: 'وردپرس', href: '/products?category=wordpress' },
    { name: 'فروشگاهی', href: '/products?category=ecommerce' },
    { name: 'داشبورد', href: '/products?category=dashboard-admin' },
  ]

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        fetchCartCount(user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCartCount(session.user.id)
      } else {
        setCartCount(0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchCartCount = async (userId: string) => {
    const supabase = createClient()
    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
    
    if (!error) {
      setCartCount(count || 0)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
    <nav className="sticky top-0 z-50 w-full glass-surface-strong border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/images/logo-icon.webp" 
              alt="سورنا" 
              width={40} 
              height={40} 
              className="w-10 h-10 dark:invert"
            />
            <Image 
              src="/images/logo-type-farsi.webp" 
              alt="سورنا" 
              width={80} 
              height={24} 
              className="h-6 w-auto hidden sm:block dark:invert"
            />
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
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی پروژه..."
                className="w-full h-10 pr-10 pl-4 rounded-full bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </form>

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
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm" className="hidden sm:flex">
                    داشبورد
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
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

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div 
          className="fixed inset-0 bg-black/50" 
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="fixed right-0 top-0 h-full w-72 bg-background border-l border-border shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-bold text-lg">منو</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="p-4 border-b border-border">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی پروژه..."
                className="w-full h-10 pr-10 pl-4 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </form>

          {/* Mobile Categories */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-3">دسته‌بندی‌ها</p>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Auth */}
          {!user && (
            <div className="p-4 border-t border-border mt-auto">
              <div className="space-y-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">ورود</Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">ثبت‌نام</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}
