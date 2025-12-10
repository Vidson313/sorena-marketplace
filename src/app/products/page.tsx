import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  ChevronDown,
  X
} from "lucide-react";
import Link from "next/link";

// Mock products data
const mockProducts = [
  {
    id: "1",
    title: "E-commerce Dashboard",
    title_fa: "داشبورد فروشگاه آنلاین",
    slug: "ecommerce-dashboard",
    short_description_fa: "داشبورد مدیریت فروشگاه با React و Next.js",
    price: 2500000,
    discount_price: 1750000,
    difficulty_level: "intermediate" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    rating_average: 4.9,
    rating_count: 128,
    sales_count: 450,
    is_featured: true,
    is_active: true,
    version: "2.0.0",
    view_count: 0,
    support_duration_months: 6,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: true,
    includes_video_tutorial: true,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "1", name: "React", slug: "react", created_at: "" },
      { id: "2", name: "Next.js", slug: "nextjs", created_at: "" },
      { id: "3", name: "Tailwind", slug: "tailwind", created_at: "" },
    ],
  },
  {
    id: "2",
    title: "Blog Platform",
    title_fa: "پلتفرم بلاگ حرفه‌ای",
    slug: "blog-platform",
    short_description_fa: "سیستم مدیریت محتوا با Laravel و Vue.js",
    price: 1800000,
    discount_price: undefined,
    difficulty_level: "beginner" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    rating_average: 4.7,
    rating_count: 89,
    sales_count: 320,
    is_featured: true,
    is_active: true,
    version: "1.5.0",
    view_count: 0,
    support_duration_months: 6,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: true,
    includes_video_tutorial: false,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "4", name: "Laravel", slug: "laravel", created_at: "" },
      { id: "5", name: "Vue.js", slug: "vuejs", created_at: "" },
    ],
  },
  {
    id: "3",
    title: "Mobile App Template",
    title_fa: "قالب اپلیکیشن موبایل",
    slug: "mobile-app-template",
    short_description_fa: "اپلیکیشن موبایل با React Native",
    price: 3200000,
    discount_price: 2400000,
    difficulty_level: "advanced" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    rating_average: 4.8,
    rating_count: 156,
    sales_count: 280,
    is_featured: true,
    is_active: true,
    version: "3.0.0",
    view_count: 0,
    support_duration_months: 6,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: false,
    includes_video_tutorial: true,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "6", name: "React Native", slug: "react-native", created_at: "" },
      { id: "7", name: "TypeScript", slug: "typescript", created_at: "" },
    ],
  },
  {
    id: "4",
    title: "Admin Panel",
    title_fa: "پنل مدیریت پیشرفته",
    slug: "admin-panel",
    short_description_fa: "پنل ادمین با امکانات کامل",
    price: 2100000,
    discount_price: undefined,
    difficulty_level: "intermediate" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    rating_average: 4.6,
    rating_count: 72,
    sales_count: 195,
    is_featured: false,
    is_active: true,
    version: "1.8.0",
    view_count: 0,
    support_duration_months: 6,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: true,
    includes_video_tutorial: false,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "1", name: "React", slug: "react", created_at: "" },
      { id: "8", name: "Node.js", slug: "nodejs", created_at: "" },
    ],
  },
  {
    id: "5",
    title: "WordPress Theme",
    title_fa: "قالب وردپرس فروشگاهی",
    slug: "wordpress-theme",
    short_description_fa: "قالب حرفه‌ای وردپرس برای فروشگاه",
    price: 1500000,
    discount_price: 1200000,
    difficulty_level: "beginner" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    rating_average: 4.5,
    rating_count: 234,
    sales_count: 890,
    is_featured: false,
    is_active: true,
    version: "2.5.0",
    view_count: 0,
    support_duration_months: 6,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: false,
    includes_video_tutorial: true,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "9", name: "WordPress", slug: "wordpress", created_at: "" },
      { id: "10", name: "PHP", slug: "php", created_at: "" },
    ],
  },
  {
    id: "6",
    title: "SaaS Starter Kit",
    title_fa: "کیت استارتر SaaS",
    slug: "saas-starter-kit",
    short_description_fa: "شروع سریع پروژه SaaS با Next.js",
    price: 4500000,
    discount_price: undefined,
    difficulty_level: "advanced" as const,
    thumbnail_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    rating_average: 4.9,
    rating_count: 67,
    sales_count: 145,
    is_featured: true,
    is_active: true,
    version: "1.0.0",
    view_count: 0,
    support_duration_months: 12,
    includes_source_code: true,
    includes_documentation: true,
    includes_database: true,
    includes_video_tutorial: true,
    created_at: "",
    updated_at: "",
    technologies: [
      { id: "2", name: "Next.js", slug: "nextjs", created_at: "" },
      { id: "11", name: "Supabase", slug: "supabase", created_at: "" },
      { id: "12", name: "Stripe", slug: "stripe", created_at: "" },
    ],
  },
];

const categories = [
  { name: "همه", slug: "all", count: 150 },
  { name: "وب اپلیکیشن", slug: "web-applications", count: 45 },
  { name: "موبایل", slug: "mobile-apps", count: 28 },
  { name: "وردپرس", slug: "wordpress", count: 62 },
  { name: "فروشگاهی", slug: "ecommerce", count: 34 },
  { name: "داشبورد", slug: "dashboard-admin", count: 25 },
];

const technologies = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Vue.js", slug: "vuejs" },
  { name: "Laravel", slug: "laravel" },
  { name: "Node.js", slug: "nodejs" },
  { name: "WordPress", slug: "wordpress" },
  { name: "React Native", slug: "react-native" },
  { name: "Flutter", slug: "flutter" },
];

const difficulties = [
  { name: "مبتدی", slug: "beginner" },
  { name: "متوسط", slug: "intermediate" },
  { name: "پیشرفته", slug: "advanced" },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">پروژه‌های آماده</h1>
          <p className="text-muted-foreground">
            بیش از ۱۵۰ پروژه آماده با کیفیت بالا و پشتیبانی کامل
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="glass-surface rounded-2xl p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">فیلترها</h3>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  پاک کردن
                </Button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  className="w-full h-10 pr-10 pl-4 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">دسته‌بندی</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.slug}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          className="w-4 h-4 text-primary border-border focus:ring-primary"
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{category.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">تکنولوژی</h4>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <button
                      key={tech.slug}
                      className="px-3 py-1.5 text-xs rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      {tech.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">سطح دشواری</h4>
                <div className="space-y-2">
                  {difficulties.map((diff) => (
                    <label
                      key={diff.slug}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors">
                        {diff.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-medium mb-3">محدوده قیمت</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="از"
                    className="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    type="number"
                    placeholder="تا"
                    className="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                نمایش <span className="font-medium text-foreground">۶</span> از{" "}
                <span className="font-medium text-foreground">۱۵۰</span> پروژه
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  جدیدترین
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                React
                <X className="h-3 w-3 cursor-pointer" />
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                متوسط
                <X className="h-3 w-3 cursor-pointer" />
              </span>
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button variant="outline" size="sm" disabled>
                قبلی
              </Button>
              <Button variant="default" size="sm" className="w-9">
                ۱
              </Button>
              <Button variant="outline" size="sm" className="w-9">
                ۲
              </Button>
              <Button variant="outline" size="sm" className="w-9">
                ۳
              </Button>
              <span className="px-2 text-muted-foreground">...</span>
              <Button variant="outline" size="sm" className="w-9">
                ۱۰
              </Button>
              <Button variant="outline" size="sm">
                بعدی
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
