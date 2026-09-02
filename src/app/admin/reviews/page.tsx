import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "../../../../supabase/server";
import { isUserAdmin } from "@/lib/queries";
import AdminReviewsClient from "@/components/admin/admin-reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  let user: any = { id: "admin-demo", email: "admin@sorena.dev" };
  let reviews: any[] = [];
  let questions: any[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return redirect("/sign-in");
      user = data.user;
      const isAdmin = await isUserAdmin(user.id);
      if (!isAdmin) return redirect("/dashboard");

      const [{ data: dbReviews }, { data: dbQuestions }] = await Promise.all([
        supabase.from("reviews").select(`*, product:products(title_fa, slug), user:users(name, email)`).order("created_at", { ascending: false }),
        supabase.from("product_questions").select(`*, product:products(title_fa, slug), user:users(name, email)`).order("created_at", { ascending: false }),
      ]);
      reviews = dbReviews || [];
      questions = dbQuestions || [];
    } catch {}
  }

  return (
    <AdminReviewsClient
      user={user}
      reviews={reviews}
      questions={questions}
    />
  );
}
