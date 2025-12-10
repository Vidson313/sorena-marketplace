import { createClient } from "../../supabase/server";
import type { Product, Category, Technology, ProductFilters } from "@/types/database";

// Get all products with filters
export async function getProducts(filters?: ProductFilters) {
  const supabase = await createClient();
  
  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      technologies:product_technologies(
        technology:technologies(*)
      )
    `)
    .eq("is_active", true);

  if (filters?.category) {
    query = query.eq("category.slug", filters.category);
  }

  if (filters?.difficulty) {
    query = query.eq("difficulty_level", filters.difficulty);
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters?.search) {
    query = query.or(`title_fa.ilike.%${filters.search}%,title.ilike.%${filters.search}%`);
  }

  // Sorting
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

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  // Transform the data to flatten technologies
  return data?.map((product: any) => ({
    ...product,
    technologies: product.technologies?.map((pt: any) => pt.technology) || [],
  })) || [];
}

// Get featured products
export async function getFeaturedProducts(limit = 4) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      technologies:product_technologies(
        technology:technologies(*)
      )
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sales_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return data?.map((product: any) => ({
    ...product,
    technologies: product.technologies?.map((pt: any) => pt.technology) || [],
  })) || [];
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      technologies:product_technologies(
        technology:technologies(*)
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return {
    ...data,
    technologies: data.technologies?.map((pt: any) => pt.technology) || [],
  };
}

// Get all categories
export async function getCategories() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name_fa");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

// Get all technologies
export async function getTechnologies() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("technologies")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching technologies:", error);
    return [];
  }

  return data || [];
}

// Get product reviews
export async function getProductReviews(productId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      user:users(name, avatar_url)
    `)
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data || [];
}

// Get user's cart items
export async function getCartItems(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      product:products(*)
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }

  return data || [];
}

// Get user's favorites
export async function getFavorites(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("favorites")
    .select(`
      *,
      product:products(
        *,
        technologies:product_technologies(
          technology:technologies(*)
        )
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return data?.map((fav: any) => ({
    ...fav,
    product: {
      ...fav.product,
      technologies: fav.product.technologies?.map((pt: any) => pt.technology) || [],
    },
  })) || [];
}

// Get user's orders
export async function getUserOrders(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data || [];
}

// Check if user is admin
export async function isUserAdmin(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error) {
    return false;
  }

  return data?.role === "admin" || data?.role === "super_admin";
}
