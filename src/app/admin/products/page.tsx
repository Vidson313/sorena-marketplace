import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import AdminProductsPage from "@/components/admin/admin-products";
import { getProducts, getCategories, getTechnologies } from "@/lib/queries";
import { isUserAdmin } from "@/lib/queries";

export default async function ProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if admin
  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return redirect("/dashboard");
  }

  // Fetch all products (including inactive)
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*),
      technologies:product_technologies(
        technology:technologies(*)
      )
    `)
    .order("created_at", { ascending: false });

  const [categories, technologies] = await Promise.all([
    getCategories(),
    getTechnologies(),
  ]);

  return (
    <AdminProductsPage 
      user={user} 
      initialProducts={products || []}
      categories={categories}
      technologies={technologies}
    />
  );
}
