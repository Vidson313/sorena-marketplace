import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
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

  let dbQuery = supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      technologies:product_technologies(
        technology:technologies(*)
      )
    `, { count: "exact" })
    .eq("is_active", true);

  // Full-text search
  if (query) {
    dbQuery = dbQuery.or(`title_fa.ilike.%${query}%,title.ilike.%${query}%,description_fa.ilike.%${query}%`);
  }

  // Category filter
  if (category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();
    
    if (categoryData) {
      dbQuery = dbQuery.eq("category_id", categoryData.id);
    }
  }

  // Difficulty filter
  if (difficulty) {
    dbQuery = dbQuery.eq("difficulty_level", difficulty);
  }

  // Price filter
  if (minPrice) {
    dbQuery = dbQuery.gte("price", parseFloat(minPrice));
  }
  if (maxPrice) {
    dbQuery = dbQuery.lte("price", parseFloat(maxPrice));
  }

  // Sorting
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

  // Pagination
  const offset = (page - 1) * limit;
  dbQuery = dbQuery.range(offset, offset + limit - 1);

  const { data, error, count } = await dbQuery;

  if (error) {
    return NextResponse.json(
      { error: "خطا در جستجو" },
      { status: 500 }
    );
  }

  // Transform data
  const products = data?.map((product: any) => ({
    ...product,
    technologies: product.technologies?.map((pt: any) => pt.technology) || [],
  })) || [];

  // Filter by technology (needs to be done after fetch due to junction table)
  let filteredProducts = products;
  if (technology) {
    filteredProducts = products.filter((product: any) =>
      product.technologies?.some((tech: any) => tech.slug === technology)
    );
  }

  return NextResponse.json({
    products: filteredProducts,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}
