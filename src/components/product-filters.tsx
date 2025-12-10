"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  categories: any[];
  technologies: any[];
  difficulties: { name: string; slug: string }[];
  currentFilters: {
    category?: string;
    technology?: string;
    difficulty?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    sortBy?: string;
  };
}

export default function ProductFilters({
  categories,
  technologies,
  difficulties,
  currentFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(currentFilters.search || "");
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || "");

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", search || undefined);
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  return (
    <div className="glass-surface rounded-2xl p-5 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">فیلترها</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={clearAllFilters}
        >
          پاک کردن
        </Button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pr-10 pl-4 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </form>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">دسته‌بندی</h4>
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={!currentFilters.category}
                onChange={() => updateFilter("category", undefined)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                همه
              </span>
            </div>
          </label>
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={currentFilters.category === category.slug}
                  onChange={() => updateFilter("category", category.slug)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span className="text-sm group-hover:text-primary transition-colors">
                  {category.name_fa}
                </span>
              </div>
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
              onClick={() =>
                updateFilter(
                  "technology",
                  currentFilters.technology === tech.slug ? undefined : tech.slug
                )
              }
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                currentFilters.technology === tech.slug
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary hover:text-primary"
              }`}
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
                checked={currentFilters.difficulty === diff.slug}
                onChange={() =>
                  updateFilter(
                    "difficulty",
                    currentFilters.difficulty === diff.slug ? undefined : diff.slug
                  )
                }
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
        <h4 className="text-sm font-medium mb-3">محدوده قیمت (تومان)</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="از"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="number"
            placeholder="تا"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={handlePriceFilter}
        >
          اعمال
        </Button>
      </div>
    </div>
  );
}
