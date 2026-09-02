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
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { getProducts, getCategories, getTechnologies } from "@/lib/queries";
import ProductFilters from "@/components/product-filters";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    technology?: string;
    difficulty?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    sortBy?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const currentPage = parseInt(searchParams.page || "1");
  
  const filters = {
    category: searchParams.category,
    technology: searchParams.technology,
    difficulty: searchParams.difficulty as any,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    search: searchParams.search,
    sortBy: searchParams.sortBy as any,
  };

  const [productsResult, categories, technologies] = await Promise.all([
    getProducts(filters, currentPage),
    getCategories(),
    getTechnologies(),
  ]);

  const { products, totalCount, totalPages } = productsResult;

  const activeFilters: { key: string; label: string }[] = [];
  if (searchParams.category) {
    const cat = categories.find((c: any) => c.slug === searchParams.category);
    if (cat) activeFilters.push({ key: 'category', label: cat.name_fa });
  }
  if (searchParams.technology) {
    const tech = technologies.find((t: any) => t.slug === searchParams.technology);
    if (tech) activeFilters.push({ key: 'technology', label: tech.name });
  }
  if (searchParams.difficulty) {
    const diffLabels: Record<string, string> = {
      beginner: 'مبتدی',
      intermediate: 'متوسط',
      advanced: 'پیشرفته'
    };
    activeFilters.push({ key: 'difficulty', label: diffLabels[searchParams.difficulty] || searchParams.difficulty });
  }
  if (searchParams.search) {
    activeFilters.push({ key: 'search', label: `جستجو: ${searchParams.search}` });
  }

  const sortOptions = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'popular', label: 'پرفروش‌ترین' },
    { value: 'price_low', label: 'ارزان‌ترین' },
    { value: 'price_high', label: 'گران‌ترین' },
    { value: 'rating', label: 'بالاترین امتیاز' },
  ];

  const difficulties = [
    { name: "مبتدی", slug: "beginner" },
    { name: "متوسط", slug: "intermediate" },
    { name: "پیشرفته", slug: "advanced" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">پروژه‌های آماده</h1>
          <p className="text-muted-foreground">
            {totalCount} پروژه آماده با کیفیت بالا و پشتیبانی کامل
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <ProductFilters 
              categories={categories}
              technologies={technologies}
              difficulties={difficulties}
              currentFilters={searchParams}
            />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                نمایش <span className="font-medium text-foreground">{products.length}</span> پروژه
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
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilters.map((filter) => (
                  <Link
                    key={filter.key}
                    href="/products"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                  >
                    {filter.label}
                    <X className="h-3 w-3" />
                  </Link>
                ))}
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border text-muted-foreground text-sm hover:bg-muted transition-colors"
                >
                  پاک کردن همه
                </Link>
              </div>
            )}

            {products.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Link
                      href={{
                        pathname: "/products",
                        query: { ...searchParams, page: Math.max(1, currentPage - 1) },
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    >
                      <Button variant="outline" size="icon" disabled={currentPage <= 1}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Link
                          key={pageNum}
                          href={{
                            pathname: "/products",
                            query: { ...searchParams, page: pageNum },
                          }}
                        >
                          <Button
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="icon"
                          >
                            {pageNum}
                          </Button>
                        </Link>
                      );
                    })}

                    <Link
                      href={{
                        pathname: "/products",
                        query: { ...searchParams, page: Math.min(totalPages, currentPage + 1) },
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    >
                      <Button variant="outline" size="icon" disabled={currentPage >= totalPages}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">محصولی یافت نشد</h2>
                <p className="text-muted-foreground mb-6">
                  با تغییر فیلترها دوباره جستجو کنید
                </p>
                <Link href="/products">
                  <Button className="rounded-full px-8">
                    مشاهده همه پروژه‌ها
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
