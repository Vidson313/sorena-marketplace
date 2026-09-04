"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/../../supabase/server";
import { revalidatePath } from "next/cache";

// ========== VALIDATION HELPERS ==========
function validateRequired(value: unknown, fieldName: string): string | null {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} الزامی است`;
  }
  return null;
}

function validateSlug(slug: string): string | null {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return "اسلاگ فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره باشد";
  }
  if (slug.length < 3 || slug.length > 100) {
    return "اسلاگ باید بین ۳ تا ۱۰۰ کاراکتر باشد";
  }
  return null;
}

function validatePrice(price: number): string | null {
  if (isNaN(price) || price < 0) {
    return "قیمت باید یک عدد مثبت باشد";
  }
  if (price > 100000000) {
    return "قیمت نمی‌تواند بیشتر از ۱۰۰ میلیون تومان باشد";
  }
  return null;
}

function validateTitle(title: string, fieldName: string): string | null {
  if (title.length < 3 || title.length > 200) {
    return `${fieldName} باید بین ۳ تا ۲۰۰ کاراکتر باشد`;
  }
  return null;
}

function validateDescription(desc: string, fieldName: string): string | null {
  if (desc && desc.length > 10000) {
    return `${fieldName} نمی‌تواند بیشتر از ۱۰۰۰۰ کاراکتر باشد`;
  }
  return null;
}

function validateUrl(url: string, fieldName: string): string | null {
  if (!url) return null;
  try {
    new URL(url);
    return null;
  } catch {
    return `${fieldName} باید یک URL معتبر باشد`;
  }
}

function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || '';
  if (!isSupabaseConfigured()) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "ثبت‌نام در حالت دمو آفلاین غیرفعال است — لطفاً Supabase را متصل کنید.",
    );
  }
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      }
    },
  });

  console.log("After signUp", error);


  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name: fullName,
          full_name: fullName,
          email: email,
          user_id: user.id,
          token_identifier: user.id,
          created_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating user profile:', updateError);
      }
    } catch (err) {
      console.error('Error in user profile creation:', err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!isSupabaseConfigured()) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "ورود در حالت دمو آفلاین غیرفعال است — لطفاً Supabase را متصل کنید.",
    );
  }
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  if (!isSupabaseConfigured()) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "بازیابی رمز عبور در حالت دمو آفلاین غیرفعال است.",
    );
  }
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  if (!isSupabaseConfigured()) {
    encodedRedirect("error", "/dashboard/reset-password", "تغییر رمز عبور در حالت دمو آفلاین غیرفعال است.");
  }
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// ========== CART ACTIONS ==========

export async function addToCart(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    return { error: "این محصول قبلاً در سبد خرید شماست" };
  }

  const { error } = await supabase
    .from("cart_items")
    .insert({ user_id: user.id, product_id: productId });

  if (error) {
    console.error("Error adding to cart:", error);
    return { error: "خطا در افزودن به سبد خرید" };
  }

  revalidatePath("/cart");
  return { success: true, message: "به سبد خرید اضافه شد" };
}

export async function removeFromCart(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) {
    return { error: "خطا در حذف از سبد خرید" };
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function clearCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    return { error: "خطا در پاک کردن سبد خرید" };
  }

  revalidatePath("/cart");
  return { success: true };
}

// ========== FAVORITES ACTIONS ==========

export async function addToFavorites(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    return { error: "این محصول در علاقه‌مندی‌های شماست" };
  }

  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, product_id: productId });

  if (error) {
    return { error: "خطا در افزودن به علاقه‌مندی‌ها" };
  }

  revalidatePath("/favorites");
  return { success: true, message: "به علاقه‌مندی‌ها اضافه شد" };
}

export async function removeFromFavorites(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) {
    return { error: "خطا در حذف از علاقه‌مندی‌ها" };
  }

  revalidatePath("/favorites");
  return { success: true };
}

export async function toggleFavorite(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید", isFavorite: false };
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    await removeFromFavorites(productId);
    return { success: true, isFavorite: false };
  } else {
    await addToFavorites(productId);
    return { success: true, isFavorite: true };
  }
}

// ========== REVIEWS ACTIONS ==========

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const productId = formData.get("productId") as string;
  const rating = parseInt(formData.get("rating") as string);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!productId || !rating || rating < 1 || rating > 5) {
    return { error: "اطلاعات نامعتبر" };
  }

  const { data: hasPurchased } = await supabase
    .from("order_items")
    .select("id, order:orders!inner(user_id, status)")
    .eq("product_id", productId)
    .eq("order.user_id", user.id)
    .eq("order.status", "completed")
    .single();

  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existingReview) {
    return { error: "شما قبلاً نظر داده‌اید" };
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    user_id: user.id,
    rating,
    title,
    content,
    is_verified_purchase: !!hasPurchased,
    is_approved: false,
  });

  if (error) {
    return { error: "خطا در ثبت نظر" };
  }

  revalidatePath(`/products`);
  return { success: true, message: "نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود" };
}

// ========== Q&A ACTIONS ==========

export async function submitQuestion(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const productId = formData.get("productId") as string;
  const question = formData.get("question") as string;

  if (!productId || !question || question.trim().length < 10) {
    return { error: "لطفاً سؤال خود را با حداقل ۱۰ کاراکتر بنویسید" };
  }

  const { error } = await supabase.from("product_questions").insert({
    product_id: productId,
    user_id: user.id,
    question: question.trim(),
    is_public: true,
  });

  if (error) {
    return { error: "خطا در ثبت سؤال" };
  }

  revalidatePath(`/products`);
  return { success: true, message: "سؤال شما ثبت شد" };
}

export async function answerQuestion(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole || (userRole.role !== "admin" && userRole.role !== "super_admin")) {
    return { error: "شما دسترسی لازم را ندارید" };
  }

  const questionId = formData.get("questionId") as string;
  const answer = formData.get("answer") as string;

  if (!questionId || !answer) {
    return { error: "اطلاعات نامعتبر" };
  }

  const { error } = await supabase
    .from("product_questions")
    .update({
      answer: answer.trim(),
      answered_by: user.id,
      answered_at: new Date().toISOString(),
    })
    .eq("id", questionId);

  if (error) {
    return { error: "خطا در ثبت پاسخ" };
  }

  revalidatePath("/admin/questions");
  return { success: true, message: "پاسخ ثبت شد" };
}

// ========== DISCOUNT CODE ACTIONS ==========

export async function validateDiscountCode(code: string, subtotal: number) {
  const supabase = await createClient();

  const { data: discountCode, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !discountCode) {
    return { error: "کد تخفیف نامعتبر است" };
  }

  const now = new Date();
  
  if (discountCode.valid_from && new Date(discountCode.valid_from) > now) {
    return { error: "کد تخفیف هنوز فعال نشده است" };
  }

  if (discountCode.valid_until && new Date(discountCode.valid_until) < now) {
    return { error: "کد تخفیف منقضی شده است" };
  }

  if (discountCode.usage_limit && discountCode.used_count >= discountCode.usage_limit) {
    return { error: "کد تخفیف به حد استفاده رسیده است" };
  }

  if (discountCode.min_purchase && subtotal < discountCode.min_purchase) {
    return { 
      error: `حداقل خرید برای این کد ${new Intl.NumberFormat("fa-IR").format(discountCode.min_purchase)} تومان است` 
    };
  }

  let discountAmount = 0;
  if (discountCode.discount_type === "percentage") {
    discountAmount = (subtotal * discountCode.discount_value) / 100;
    if (discountCode.max_discount && discountAmount > discountCode.max_discount) {
      discountAmount = discountCode.max_discount;
    }
  } else {
    discountAmount = discountCode.discount_value;
  }

  return {
    success: true,
    discount: {
      id: discountCode.id,
      code: discountCode.code,
      type: discountCode.discount_type,
      value: discountCode.discount_value,
      discountAmount,
      description: discountCode.description,
    },
  };
}

// ========== ORDER ACTIONS ==========

function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segments = 4;
  const segmentLength = 5;
  const parts: string[] = [];

  for (let i = 0; i < segments; i++) {
    let segment = "";
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(segment);
  }

  return parts.join("-");
}

export async function createOrder(discountCode?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select(`*, product:products(*)`)
    .eq("user_id", user.id);

  if (cartError || !cartItems || cartItems.length === 0) {
    return { error: "سبد خرید شما خالی است" };
  }

  let subtotal = 0;
  cartItems.forEach((item: any) => {
    subtotal += Number(item.product.discount_price || item.product.price);
  });

  let discountAmount = 0;
  let appliedDiscountCode = null;

  if (discountCode) {
    const discountResult = await validateDiscountCode(discountCode, subtotal);
    if (discountResult.success && discountResult.discount) {
      discountAmount = discountResult.discount.discountAmount;
      appliedDiscountCode = discountResult.discount.code;
    }
  }

  const total = subtotal - discountAmount;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      order_number: `SRN-${Date.now()}`,
      status: "pending",
      subtotal,
      discount_amount: discountAmount,
      total,
      payment_status: "pending",
      discount_code: appliedDiscountCode,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: "خطا در ایجاد سفارش" };
  }

  const orderItems = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    price: Number(item.product.price),
    discount_price: item.product.discount_price ? Number(item.product.discount_price) : null,
    license_key: generateLicenseKey(),
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: "خطا در ایجاد آیتم‌های سفارش" };
  }

  if (appliedDiscountCode) {
    // Increment used_count properly using raw SQL
    await supabase.rpc('increment_discount_usage', { discount_code: appliedDiscountCode });
  }

  return { 
    success: true, 
    orderId: order.id, 
    orderNumber: order.order_number,
    total: order.total 
  };
}

export async function processPayment(orderId: string, paymentReference: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  // TODO: Integrate with real payment gateway (Zarinpal, IDPay, etc.)
  // For now, this is a placeholder that should be replaced with actual payment verification
  // Example: const paymentVerified = await verifyZarinpalPayment(paymentReference);
  
  if (!paymentReference || paymentReference.length < 10) {
    await supabase
      .from("orders")
      .update({ payment_status: "failed" })
      .eq("id", orderId);
    return { error: "شماره پیگیری پرداخت نامعتبر است" };
  }

  // Verify the order belongs to the user and is in pending status
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, payment_status")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return { error: "سفارش یافت نشد" };
  }

  if (order.payment_status !== "pending") {
    return { error: "این سفارش قبلاً پردازش شده است" };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status: "completed",
      payment_status: "paid",
      payment_reference: paymentReference,
      payment_method: "zarinpal",
    })
    .eq("id", orderId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "خطا در پردازش پرداخت" };
  }

  await supabase.from("cart_items").delete().eq("user_id", user.id);

  revalidatePath("/cart");
  revalidatePath("/dashboard");
  return { success: true };
}

// ========== ADMIN ACTIONS ==========

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole || (userRole.role !== "admin" && userRole.role !== "super_admin")) {
    return { error: "شما دسترسی ندارید" };
  }

  const title = formData.get("title") as string;
  const title_fa = formData.get("title_fa") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const description_fa = formData.get("description_fa") as string;
  const short_description = formData.get("short_description") as string;
  const short_description_fa = formData.get("short_description_fa") as string;
  const price = parseFloat(formData.get("price") as string);
  const discount_price = formData.get("discount_price") ? parseFloat(formData.get("discount_price") as string) : null;
  const category_id = formData.get("category_id") as string;
  const difficulty_level = formData.get("difficulty_level") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const demo_url = formData.get("demo_url") as string;
  const is_featured = formData.get("is_featured") === "true";
  const is_active = formData.get("is_active") !== "false";
  const includes_source_code = formData.get("includes_source_code") === "true";
  const includes_documentation = formData.get("includes_documentation") === "true";
  const includes_database = formData.get("includes_database") === "true";
  const includes_video_tutorial = formData.get("includes_video_tutorial") === "true";
  const technologies = formData.getAll("technologies") as string[];

  // ========== VALIDATION ==========
  const errors: string[] = [];
  
  let err = validateRequired(title, "عنوان انگلیسی");
  if (err) errors.push(err);
  
  err = validateRequired(title_fa, "عنوان فارسی");
  if (err) errors.push(err);
  
  err = validateRequired(slug, "اسلاگ");
  if (err) errors.push(err);
  
  if (title) {
    err = validateTitle(title, "عنوان انگلیسی");
    if (err) errors.push(err);
  }
  
  if (title_fa) {
    err = validateTitle(title_fa, "عنوان فارسی");
    if (err) errors.push(err);
  }
  
  if (slug) {
    err = validateSlug(slug);
    if (err) errors.push(err);
  }
  
  err = validatePrice(price);
  if (err) errors.push(err);
  
  if (discount_price !== null) {
    err = validatePrice(discount_price);
    if (err) errors.push(err);
    if (discount_price >= price) {
      errors.push("قیمت تخفیف‌خورده باید کمتر از قیمت اصلی باشد");
    }
  }
  
  if (description) {
    err = validateDescription(description, "توضیحات انگلیسی");
    if (err) errors.push(err);
  }
  
  if (description_fa) {
    err = validateDescription(description_fa, "توضیحات فارسی");
    if (err) errors.push(err);
  }
  
  if (thumbnail_url) {
    err = validateUrl(thumbnail_url, "آدرس تصویر");
    if (err) errors.push(err);
  }
  
  if (demo_url) {
    err = validateUrl(demo_url, "آدرس دمو");
    if (err) errors.push(err);
  }
  
  if (difficulty_level && !["beginner", "intermediate", "advanced"].includes(difficulty_level)) {
    errors.push("سطح دشواری نامعتبر است");
  }
  
  if (errors.length > 0) {
    return { error: errors.join("، ") };
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      title,
      title_fa,
      slug,
      description,
      description_fa,
      short_description,
      short_description_fa,
      price,
      discount_price,
      discount_percent: discount_price ? Math.round(((price - discount_price) / price) * 100) : null,
      category_id: category_id || null,
      difficulty_level,
      thumbnail_url,
      demo_url,
      is_featured,
      is_active,
      includes_source_code,
      includes_documentation,
      includes_database,
      includes_video_tutorial,
      created_by: user.id,
    })
    .select()
    .single();

  if (error || !product) {
    return { error: "خطا در ایجاد محصول" };
  }

  if (technologies.length > 0) {
    const techInserts = technologies.map((techId) => ({
      product_id: product.id,
      technology_id: techId,
    }));
    await supabase.from("product_technologies").insert(techInserts);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true, productId: product.id };
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole || (userRole.role !== "admin" && userRole.role !== "super_admin")) {
    return { error: "شما دسترسی ندارید" };
  }

  const title = formData.get("title") as string;
  const title_fa = formData.get("title_fa") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const description_fa = formData.get("description_fa") as string;
  const short_description = formData.get("short_description") as string;
  const short_description_fa = formData.get("short_description_fa") as string;
  const price = parseFloat(formData.get("price") as string);
  const discount_price = formData.get("discount_price") ? parseFloat(formData.get("discount_price") as string) : null;
  const category_id = formData.get("category_id") as string;
  const difficulty_level = formData.get("difficulty_level") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const demo_url = formData.get("demo_url") as string;
  const is_featured = formData.get("is_featured") === "true";
  const is_active = formData.get("is_active") !== "false";
  const includes_source_code = formData.get("includes_source_code") === "true";
  const includes_documentation = formData.get("includes_documentation") === "true";
  const includes_database = formData.get("includes_database") === "true";
  const includes_video_tutorial = formData.get("includes_video_tutorial") === "true";
  const technologies = formData.getAll("technologies") as string[];

  // ========== VALIDATION ==========
  const errors: string[] = [];
  
  let err = validateRequired(title, "عنوان انگلیسی");
  if (err) errors.push(err);
  
  err = validateRequired(title_fa, "عنوان فارسی");
  if (err) errors.push(err);
  
  err = validateRequired(slug, "اسلاگ");
  if (err) errors.push(err);
  
  if (title) {
    err = validateTitle(title, "عنوان انگلیسی");
    if (err) errors.push(err);
  }
  
  if (title_fa) {
    err = validateTitle(title_fa, "عنوان فارسی");
    if (err) errors.push(err);
  }
  
  if (slug) {
    err = validateSlug(slug);
    if (err) errors.push(err);
  }
  
  err = validatePrice(price);
  if (err) errors.push(err);
  
  if (discount_price !== null) {
    err = validatePrice(discount_price);
    if (err) errors.push(err);
    if (discount_price >= price) {
      errors.push("قیمت تخفیف‌خورده باید کمتر از قیمت اصلی باشد");
    }
  }
  
  if (description) {
    err = validateDescription(description, "توضیحات انگلیسی");
    if (err) errors.push(err);
  }
  
  if (description_fa) {
    err = validateDescription(description_fa, "توضیحات فارسی");
    if (err) errors.push(err);
  }
  
  if (thumbnail_url) {
    err = validateUrl(thumbnail_url, "آدرس تصویر");
    if (err) errors.push(err);
  }
  
  if (demo_url) {
    err = validateUrl(demo_url, "آدرس دمو");
    if (err) errors.push(err);
  }
  
  if (difficulty_level && !["beginner", "intermediate", "advanced"].includes(difficulty_level)) {
    errors.push("سطح دشواری نامعتبر است");
  }
  
  if (errors.length > 0) {
    return { error: errors.join("، ") };
  }

  const { error } = await supabase
    .from("products")
    .update({
      title,
      title_fa,
      slug,
      description,
      description_fa,
      short_description,
      short_description_fa,
      price,
      discount_price,
      discount_percent: discount_price ? Math.round(((price - discount_price) / price) * 100) : null,
      category_id: category_id || null,
      difficulty_level,
      thumbnail_url,
      demo_url,
      is_featured,
      is_active,
      includes_source_code,
      includes_documentation,
      includes_database,
      includes_video_tutorial,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) {
    return { error: "خطا در به‌روزرسانی محصول" };
  }

  await supabase.from("product_technologies").delete().eq("product_id", productId);
  if (technologies.length > 0) {
    const techInserts = technologies.map((techId) => ({
      product_id: productId,
      technology_id: techId,
    }));
    await supabase.from("product_technologies").insert(techInserts);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole || (userRole.role !== "admin" && userRole.role !== "super_admin")) {
    return { error: "شما دسترسی ندارید" };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return { error: "خطا در حذف محصول" };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole || (userRole.role !== "admin" && userRole.role !== "super_admin")) {
    return { error: "شما دسترسی ندارید" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return { error: "خطا در به‌روزرسانی وضعیت سفارش" };
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function approveReview(reviewId: string, approved: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole || (userRole.role !== "admin" && userRole.role !== "super_admin")) {
    return { error: "شما دسترسی ندارید" };
  }

  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: approved })
    .eq("id", reviewId);

  if (error) {
    return { error: "خطا در به‌روزرسانی نظر" };
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole || userRole.role !== "super_admin") {
    return { error: "فقط مدیر ارشد می‌تواند نقش کاربران را تغییر دهد" };
  }

  const { data: existing } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("user_roles")
      .update({ role })
      .eq("user_id", userId);
    if (error) {
      return { error: "خطا در به‌روزرسانی نقش" };
    }
  } else {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role });
    if (error) {
      return { error: "خطا در ایجاد نقش" };
    }
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function createDiscountCode(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole || (userRole.role !== "admin" && userRole.role !== "super_admin")) {
    return { error: "شما دسترسی ندارید" };
  }

  const code = (formData.get("code") as string).toUpperCase();
  const description = formData.get("description") as string;
  const discount_type = formData.get("discount_type") as string;
  const discount_value = parseFloat(formData.get("discount_value") as string);
  const min_purchase = formData.get("min_purchase") ? parseFloat(formData.get("min_purchase") as string) : null;
  const max_discount = formData.get("max_discount") ? parseFloat(formData.get("max_discount") as string) : null;
  const usage_limit = formData.get("usage_limit") ? parseInt(formData.get("usage_limit") as string) : null;
  const valid_from = formData.get("valid_from") as string || null;
  const valid_until = formData.get("valid_until") as string || null;

  const { error } = await supabase.from("discount_codes").insert({
    code,
    description,
    discount_type,
    discount_value,
    min_purchase,
    max_discount,
    usage_limit,
    valid_from,
    valid_until,
    is_active: true,
  });

  if (error) {
    return { error: "خطا در ایجاد کد تخفیف" };
  }

  revalidatePath("/admin/discounts");
  return { success: true };
}

// ========== FILE UPLOAD FOR PRODUCTS ==========

export async function uploadProductFile(productId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "لطفاً ابتدا وارد شوید" };
  }

  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!userRole || (userRole.role !== "admin" && userRole.role !== "super_admin")) {
    return { error: "شما دسترسی ندارید" };
  }

  const file = formData.get("file") as File;
  const fileType = formData.get("fileType") as string;
  const isMain = formData.get("isMain") === "true";

  if (!file) {
    return { error: "فایلی انتخاب نشده" };
  }

  const fileName = `${productId}/${Date.now()}-${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("product-files")
    .upload(fileName, file);

  if (uploadError) {
    return { error: "خطا در آپلود فایل" };
  }

  const { data: { publicUrl } } = supabase.storage
    .from("product-files")
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase.from("product_files").insert({
    product_id: productId,
    file_name: file.name,
    file_type: fileType || file.type,
    file_size: file.size,
    file_url: publicUrl,
    is_main: isMain,
  });

  if (dbError) {
    return { error: "خطا در ذخیره اطلاعات فایل" };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { success: true, fileUrl: publicUrl };
}