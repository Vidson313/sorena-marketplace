import { createClient } from "../../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string; productId: string } }
) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "لطفاً ابتدا وارد شوید" },
      { status: 401 }
    );
  }

  const { orderId, productId } = params;

  // Check if user has purchased this product
  const { data: orderItem, error: orderError } = await supabase
    .from("order_items")
    .select(`
      id,
      license_key,
      order:orders!inner(id, user_id, status, payment_status)
    `)
    .eq("order_id", orderId)
    .eq("product_id", productId)
    .eq("order.user_id", user.id)
    .single();

  if (orderError || !orderItem) {
    return NextResponse.json(
      { error: "سفارش یافت نشد" },
      { status: 404 }
    );
  }

  const order = orderItem.order as any;

  // Check if order is completed and paid
  if (order.status !== "completed" || order.payment_status !== "paid") {
    return NextResponse.json(
      { error: "پرداخت این سفارش تکمیل نشده است" },
      { status: 403 }
    );
  }

  // Get product files
  const { data: files, error: filesError } = await supabase
    .from("product_files")
    .select("*")
    .eq("product_id", productId)
    .eq("is_main", true)
    .single();

  if (filesError || !files) {
    // If no file in database, return license key info
    return NextResponse.json({
      success: true,
      message: "فایل آماده دانلود است",
      license_key: orderItem.license_key,
      download_available: false,
      note: "فایل اصلی محصول هنوز آپلود نشده است. لطفاً با پشتیبانی تماس بگیرید.",
    });
  }

  // Generate signed URL for download (valid for 1 hour)
  const { data: signedUrl, error: signedError } = await supabase
    .storage
    .from("product-files")
    .createSignedUrl(files.file_url.replace(/^.*product-files\//, ""), 3600);

  if (signedError || !signedUrl) {
    return NextResponse.json(
      { error: "خطا در ایجاد لینک دانلود" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    download_url: signedUrl.signedUrl,
    file_name: files.file_name,
    file_size: files.file_size,
    license_key: orderItem.license_key,
    expires_in: 3600, // seconds
  });
}
