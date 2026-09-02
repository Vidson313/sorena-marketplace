import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "../../../../supabase/server";
import AdminProductsPage from "@/components/admin/admin-products";
import { getProducts, getCategories, getTechnologies, isUserAdmin } from "@/lib/queries";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let user: any = { id: "admin-demo", email: "admin@sorena.dev" };
  let products: any[] = MOCK_PRODUCTS;

  const [categories, technologies] = await Promise.all([
    getCategories(),
    getTechnologies(),
  ]);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return redirect("/sign-in");
      user = data.user;
      const isAdmin = await isUserAdmin(user.id);
      if (!isAdmin) return redirect("/dashboard");

      const { data: dbProducts } = await supabase
        .from("products")
        .select(`*, category:categories(*), technologies:product_technologies(technology:technologies(*))`)
        .order("created_at", { ascending: false });
      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts;
      }
    } catch {}
  }

  return (
    <AdminProductsPage
      user={user}
      initialProducts={products}
      categories={categories}
      technologies={technologies}
    />
  );
}
