"use client";

import Link from "next/link";
import { ArrowLeft, Code2, Sparkles, Zap, Shield, Star, Download, Users } from 'lucide-react';
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">پلتفرم فروش پروژه‌های آماده</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-display font-bold mb-6 leading-tight">
                <span className="gradient-text">پروژه آماده،</span>
                <br />
                <span className="text-foreground">دیپلوی آماده</span>
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 glass-surface rounded-3xl p-6 h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">پلتفرم فروش پروژه‌های آماده</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-display font-bold mb-6 leading-tight">
              <span className="gradient-text">پروژه آماده،</span>
              <br />
              <span className="text-foreground">دیپلوی آماده</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
              با سورنا، پروژه‌های حرفه‌ای و آماده استفاده را کشف کنید. 
              صرفه‌جویی در زمان توسعه، کیفیت تضمین شده و پشتیبانی کامل.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/products">
                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white gap-2">
                  مشاهده پروژه‌ها
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/products?featured=true">
                <Button size="lg" variant="outline" className="rounded-full px-8 gap-2">
                  <Code2 className="w-4 h-4" />
                  پروژه‌های ویژه
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>پرداخت امن</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-500" />
                <span>دانلود فوری</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>پشتیبانی ۶ ماهه</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Large Card - Featured Project */}
            <div className="col-span-2 glass-surface rounded-3xl p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">فروشگاه آنلاین React</h3>
                    <p className="text-xs text-muted-foreground">Next.js + Supabase</p>
                  </div>
                </div>
                <span className="badge-discount">۳۰٪ تخفیف</span>
              </div>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-muted to-muted/50 mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" 
                  alt="Project Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">۴.۹</span>
                  <span className="text-xs text-muted-foreground">(۱۲۸ نظر)</span>
                </div>
                <div className="text-left">
                  <span className="text-xs text-muted-foreground line-through">۲,۵۰۰,۰۰۰</span>
                  <span className="text-lg font-bold text-primary mr-2">۱,۷۵۰,۰۰۰ تومان</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="glass-surface rounded-2xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm text-muted-foreground">مشتریان راضی</span>
              </div>
              <p className="text-3xl font-bold">۲,۵۰۰+</p>
            </div>

            {/* Downloads Card */}
            <div className="glass-surface rounded-2xl p-5 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm text-muted-foreground">دانلود موفق</span>
              </div>
              <p className="text-3xl font-bold">۱۵,۰۰۰+</p>
            </div>

            {/* AI Recommendation Badge */}
            <div className="col-span-2 glass-surface rounded-2xl p-4 card-hover border-primary/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse-glow">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">پیشنهاد هوشمند</h4>
                  <p className="text-xs text-muted-foreground">پروژه‌های متناسب با نیاز شما را پیدا کنید</p>
                </div>
                <Button size="sm" variant="ghost" className="mr-auto text-primary">
                  شروع کنید
                  <ArrowLeft className="w-3 h-3 mr-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
