import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { isUserAdmin } from "@/lib/queries";
import AdminReviewsClient from "@/components/admin/admin-reviews";

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return redirect("/dashboard");
  }

  // Get all reviews with product and user info
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      product:products(title_fa, slug),
      user:users(name, email)
    `)
    .order("created_at", { ascending: false });

  // Get all questions with product and user info
  const { data: questions } = await supabase
    .from("product_questions")
    .select(`
      *,
      product:products(title_fa, slug),
      user:users(name, email)
    `)
    .order("created_at", { ascending: false });

  return (
    <AdminReviewsClient 
      user={user} 
      reviews={reviews || []} 
      questions={questions || []}
    />
  );
}
