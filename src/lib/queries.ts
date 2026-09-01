import { createClient, isSupabaseConfigured } from "@/../../supabase/server";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "./mock-data";
import type { Product, Category, Technology, ProductFilters } from "@/types/database";

const ITEMS_PER_PAGE = 12;

function filterMocks(products: Product[], filters?: ProductFilters): Product[] {
  let out = [...products];
  if (filters?.category) out = out.filter((p) => p.category?.slug === filters.category);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    out = out.filter((p) => p.title.toLowerCase().includes(q) || p.title_fa.includes(q));
  }
  if (filters?.difficulty) out = out.filter((p) => p.difficulty_level === filters.difficulty);
  if (filters?.minPrice !== undefined) out = out.filter((p) => p.price >= filters.minPrice!);
  if (filters?.maxPrice !== undefined) out = out.filter((p) => p.price <= filters.maxPrice!);
  if (filters?.sortBy === "price_low") out.sort((a, b) => a.price - b.price);
  else if (filters?.sortBy === "price_high") out.sort((a, b) => b.price - a.price);
  else if (filters?.sortBy === "popular") out.sort((a, b) => b.sales_count - a.sales_count);
  else if (filters?.sortBy === "rating") out.sort((a, b) => b.rating_average - a.rating_average);
  else out.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return out;
}

export async function getProducts(filters?: ProductFilters, page: number = 1) {
  if (!isSupabaseConfigured()) {
    const filtered = filterMocks(MOCK_PRODUCTS, filters);
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const from = (page - 1) * ITEMS_PER_PAGE;
    return { products: filtered.slice(from, from + ITEMS_PER_PAGE), totalCount, totalPages };
  }
  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select(`*, category:categories(*), technologies:product_technologies(technology:technologies(*))`, { count: "exact" })
      .eq("is_active", true);
    if (filters?.category) query = query.eq("category.slug", filters.category);
    if (filters?.difficulty) query = query.eq("difficulty_level", filters.difficulty);
    if (filters?.minPrice) query = query.gte("price", filters.minPrice);
    if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);
    if (filters?.search) query = query.or(`title_fa.ilike.%${filters.search}%,title.ilike.%${filters.search}%`);
    switch (filters?.sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "popular":
        query = query.order("sales_count", { ascending: false });
        break;
      case "price_low":
        query = query.order("price", { ascending: true });
        break;
      case "price_high":
        query = query.order("price", { ascending: false });
        break;
      case "rating":
        query = query.order("rating_average", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }
    const from = (page - 1) * ITEMS_PER_PAGE;
    query = query.range(from, from + ITEMS_PER_PAGE - 1);
    const { data, error, count } = await query;
    if (error) throw error;
    const products = ((data as unknown[]) ?? []).map((product: unknown) => {
      const p = product as { technologies?: { technology: Technology }[] };
      return { ...(p as object), technologies: p.technologies?.map((pt) => pt.technology) ?? [] } as Product;
    });
    return { products, totalCount: count ?? 0, totalPages: Math.ceil((count ?? 0) / ITEMS_PER_PAGE) };
  } catch (e) {
    console.error("getProducts fallback to mock:", e);
    const filtered = filterMocks(MOCK_PRODUCTS, filters);
    const from = (page - 1) * ITEMS_PER_PAGE;
    return {
      products: filtered.slice(from, from + ITEMS_PER_PAGE),
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / ITEMS_PER_PAGE),
    };
  }
}

export async function getFeaturedProducts(limit = 4) {
  if (!isSupabaseConfigured()) return MOCK_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(`*, category:categories(*), technologies:product_technologies(technology:technologies(*))`)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sales_count", { ascending: false })
      .limit(limit);
    if (error) throw error;
    if (!data || (data as unknown[]).length === 0) return MOCK_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
    return ((data as unknown[]) ?? []).map((product: unknown) => {
      const p = product as { technologies?: { technology: Technology }[] };
      return { ...(p as object), technologies: p.technologies?.map((pt) => pt.technology) ?? [] } as Product;
    });
  } catch (e) {
    console.error("getFeaturedProducts fallback:", e);
    return MOCK_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
  }
}

export async function getProductBySlug(slug: string) {
  if (!isSupabaseConfigured()) return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(`*, category:categories(*), technologies:product_technologies(technology:technologies(*))`)
      .eq("slug", slug)
      .single();
    if (error) throw error;
    const p = data as unknown as { technologies?: { technology: Technology }[] };
    return { ...(p as object), technologies: p.technologies?.map((pt) => pt.technology) ?? [] } as Product;
  } catch (e) {
    console.error("getProductBySlug fallback:", e);
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return MOCK_CATEGORIES;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("*").order("name_fa");
    if (error) throw error;
    if (!data || (data as unknown[]).length === 0) return MOCK_CATEGORIES;
    return data as Category[];
  } catch (e) {
    console.error("getCategories fallback:", e);
    return MOCK_CATEGORIES;
  }
}

export async function getTechnologies(): Promise<Technology[]> {
  if (!isSupabaseConfigured()) {
    const seen = new Map<string, Technology>();
    for (const p of MOCK_PRODUCTS) for (const t of p.technologies ?? []) seen.set(t.slug, t);
    return Array.from(seen.values());
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("technologies").select("*").order("name");
    if (error) throw error;
    return (data as Technology[]) ?? [];
  } catch {
    return [];
  }
}

export async function getProductReviews(productId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(`*, user:users(name, avatar_url)`)
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getCartItems(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("cart_items").select(`*, product:products(*)`).eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getFavorites(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("favorites")
      .select(`*, product:products(*, technologies:product_technologies(technology:technologies(*)))`)
      .eq("user_id", userId);
    if (error) throw error;
    return ((data as unknown[]) ?? []).map((fav: unknown) => {
      const f = fav as { product: { technologies?: { technology: Technology }[] } };
      return {
        ...(f as object),
        product: { ...f.product, technologies: f.product.technologies?.map((pt) => pt.technology) ?? [] },
      };
    });
  } catch {
    return [];
  }
}

export async function getUserOrders(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select(`*, items:order_items(*, product:products(*, files:product_files(*)))`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function isUserAdmin(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).single();
    if (error) return false;
    return (data as { role: string })?.role === "admin" || (data as { role: string })?.role === "super_admin";
  } catch {
    return false;
  }
}

export async function getCartCount(userId: string) {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase.from("cart_items").select("*", { count: "exact", head: true }).eq("user_id", userId);
    if (error) throw error;
    return count ?? 0;
  } catch {
    return 0;
  }
}
