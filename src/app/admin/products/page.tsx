import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import AdminProductsPage from "@/components/admin/admin-products";

export default async function ProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <AdminProductsPage user={user} />;
}
