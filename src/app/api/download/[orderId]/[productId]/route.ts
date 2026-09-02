import { createClient, isSupabaseConfigured } from "../../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string; productId: string } }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      message: "فایل آزمایشی آماده است",
      download_available: false,
      note: "پروژه در حالت دموی آفلاین اجرا شده است.",
    });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const { orderId, productId } = params;

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

    if (order.status !== "completed" || order.payment_status !== "paid") {
      return NextResponse.json(
        { error: "پرداخت این سفارش تکمیل نشده است" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      license_key: orderItem.license_key,
      download_available: false,
    });
  } catch {
    return NextResponse.json({ error: "خطا در دانلود فایل" }, { status: 500 });
  }
}
