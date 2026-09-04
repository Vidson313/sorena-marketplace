import { createClient, isSupabaseConfigured } from "../../../../../supabase/server";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const technology = searchParams.get("technology");
  const difficulty = searchParams.get("difficulty");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  if (!isSupabaseConfigured()) {
    let filtered = [...MOCK_PRODUCTS];
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(q) || (p.title_fa ?? "").includes(query) || (p.description_fa ?? "").includes(query)
      );
    }
    if (category) filtered = filtered.filter((p) => p.category?.slug === category);
    if (difficulty) filtered = filtered.filter((p) => p.difficulty_level === difficulty);
    if (minPrice) filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
    if (technology) {
      filtered = filtered.filter((p) => p.technologies?.some((t) => t.slug === technology));
    }
    if (sortBy === "price_low") filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_high") filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === "popular") filtered.sort((a, b) => b.sales_count - a.sales_count);
    else if (sortBy === "rating") filtered.sort((a, b) => b.rating_average - a.rating_average);

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const products = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  try {
    const supabase = await createClient();
    let dbQuery = supabase
      .from("products")
      .select(
        `*, category:categories(*), technologies:product_technologies(technology:technologies(*))`,
        { count: "exact" }
      )
      .eq("is_active", true);

    if (query) {
      dbQuery = dbQuery.or(`title_fa.ilike.%${query}%,title.ilike.%${query}%,description_fa.ilike.%${query}%`);
    }
    if (difficulty) dbQuery = dbQuery.eq("difficulty_level", difficulty);
    if (minPrice) dbQuery = dbQuery.gte("price", parseFloat(minPrice));
    if (maxPrice) dbQuery = dbQuery.lte("price", parseFloat(maxPrice));

    switch (sortBy) {
      case "popular":
        dbQuery = dbQuery.order("sales_count", { ascending: false });
        break;
      case "price_low":
        dbQuery = dbQuery.order("price", { ascending: true });
        break;
      case "price_high":
        dbQuery = dbQuery.order("price", { ascending: false });
        break;
      case "rating":
        dbQuery = dbQuery.order("rating_average", { ascending: false });
        break;
      case "newest":
      default:
        dbQuery = dbQuery.order("created_at", { ascending: false });
    }

    const offset = (page - 1) * limit;
    dbQuery = dbQuery.range(offset, offset + limit - 1);
    const { data, error, count } = await dbQuery;

    if (error) throw error;

    const products = ((data as unknown[]) ?? []).map((product: unknown) => {
      const p = product as { technologies?: { technology: unknown }[] };
      return { ...(p as object), technologies: p.technologies?.map((pt) => pt.technology) ?? [] };
    });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (e) {
    console.error("Search API error:", e);
    return NextResponse.json({ products: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } });
  }
}
