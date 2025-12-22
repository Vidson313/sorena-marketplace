<?php
/**
 * My account dashboard.
 */
defined( 'ABSPATH' ) || exit;

$user_id      = get_current_user_id();
$is_logged_in = is_user_logged_in();

$order_count = $is_logged_in ? wc_get_customer_order_count( $user_id ) : 0;

$downloads      = ( $is_logged_in && function_exists( 'wc_get_customer_available_downloads' ) ) ? wc_get_customer_available_downloads( $user_id ) : array();
$download_count = is_array( $downloads ) ? count( $downloads ) : 0;

$billing_address  = $is_logged_in ? wc_get_account_formatted_address( 'billing' ) : '';
$shipping_address = $is_logged_in ? wc_get_account_formatted_address( 'shipping' ) : '';

$address_count = 0;
if ( $billing_address ) {
	$address_count++;
}
if ( $shipping_address && ! wc_ship_to_billing_address_only() ) {
	$address_count++;
}

$payment_count = 0;
if ( $is_logged_in && function_exists( 'wc_get_customer_saved_methods_list' ) ) {
	$payment_methods = wc_get_customer_saved_methods_list( $user_id );
	if ( is_array( $payment_methods ) ) {
		foreach ( $payment_methods as $methods ) {
			$payment_count += is_array( $methods ) ? count( $methods ) : 0;
		}
	}
}

$latest_orders = $is_logged_in
    ? wc_get_orders(
        array(
            'customer' => $user_id,
            'limit'    => 1,
        )
    )
    : array();
$latest_order = $latest_orders ? $latest_orders[0] : null;
?>
<div class="space-y-8">
    <div class="grid gap-4 lg:gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <?php
        get_template_part(
            'template-parts/account/card',
            null,
            array(
                'icon'        => 'shopping-cart',
                'label'       => esc_html__( 'سفارش‌ها', 'sorena' ),
                'value'       => (string) $order_count,
                'hint'        => esc_html__( 'مجموع سفارش‌های ثبت‌شده', 'sorena' ),
                'action_url'  => wc_get_account_endpoint_url( 'orders' ),
                'action_label'=> esc_html__( 'مشاهده', 'sorena' ),
            )
        );
        get_template_part(
            'template-parts/account/card',
            null,
            array(
                'icon'        => 'download',
                'label'       => esc_html__( 'دانلودها', 'sorena' ),
                'value'       => (string) $download_count,
                'hint'        => esc_html__( 'فایل‌های قابل دانلود', 'sorena' ),
                'action_url'  => wc_get_account_endpoint_url( 'downloads' ),
                'action_label'=> esc_html__( 'مدیریت', 'sorena' ),
            )
        );
        get_template_part(
            'template-parts/account/card',
            null,
            array(
                'icon'        => 'map-pin',
                'label'       => esc_html__( 'آدرس‌ها', 'sorena' ),
                'value'       => (string) $address_count,
                'hint'        => esc_html__( 'آدرس‌های ذخیره‌شده', 'sorena' ),
                'action_url'  => wc_get_account_endpoint_url( 'edit-address' ),
                'action_label'=> esc_html__( 'ویرایش', 'sorena' ),
            )
        );
        get_template_part(
            'template-parts/account/card',
            null,
            array(
                'icon'        => 'tag',
                'label'       => esc_html__( 'روش‌های پرداخت', 'sorena' ),
                'value'       => (string) $payment_count,
                'hint'        => esc_html__( 'کارت‌های ذخیره‌شده', 'sorena' ),
                'action_url'  => wc_get_account_endpoint_url( 'payment-methods' ),
                'action_label'=> esc_html__( 'مشاهده', 'sorena' ),
            )
        );
        ?>
    </div>

    <div class="glass-surface rounded-3xl p-6 md:p-8">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold"><?php echo esc_html__( 'آخرین سفارش', 'sorena' ); ?></h2>
            <a class="text-sm text-primary hover:text-primary/80" href="<?php echo esc_url( wc_get_account_endpoint_url( 'orders' ) ); ?>">
                <?php echo esc_html__( 'مشاهده همه', 'sorena' ); ?>
            </a>
        </div>

        <?php if ( $latest_order ) : ?>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p class="text-sm text-muted-foreground"><?php echo esc_html__( 'شماره سفارش', 'sorena' ); ?></p>
                    <p class="text-xl font-semibold">#<?php echo esc_html( $latest_order->get_order_number() ); ?></p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground"><?php echo esc_html__( 'تاریخ', 'sorena' ); ?></p>
                    <p class="text-sm font-medium">
                        <?php if ( $latest_order->get_date_created() ) : ?>
                            <time datetime="<?php echo esc_attr( $latest_order->get_date_created()->date( 'c' ) ); ?>">
                                <?php echo esc_html( wc_format_datetime( $latest_order->get_date_created() ) ); ?>
                            </time>
                        <?php else : ?>
                            <span>-</span>
                        <?php endif; ?>
                    </p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground"><?php echo esc_html__( 'وضعیت', 'sorena' ); ?></p>
                    <p class="text-sm font-medium"><?php echo esc_html( wc_get_order_status_name( $latest_order->get_status() ) ); ?></p>
                </div>
                <div>
                    <p class="text-sm text-muted-foreground"><?php echo esc_html__( 'مبلغ', 'sorena' ); ?></p>
                    <p class="text-sm font-medium"><?php echo wp_kses_post( $latest_order->get_formatted_order_total() ); ?></p>
                </div>
                <a href="<?php echo esc_url( $latest_order->get_view_order_url() ); ?>" class="inline-flex items-center rounded-full px-4 py-2 bg-primary text-white text-sm">
                    <?php echo esc_html__( 'جزئیات سفارش', 'sorena' ); ?>
                </a>
            </div>
        <?php else : ?>
            <?php
            get_template_part(
                'template-parts/account/empty-state',
                null,
                array(
                    'icon'        => 'shopping-cart',
                    'title'       => esc_html__( 'هنوز سفارشی ثبت نکرده‌اید', 'sorena' ),
                    'description' => esc_html__( 'از فروشگاه دیدن کنید و اولین سفارش خود را ثبت کنید.', 'sorena' ),
                    'action_url'  => wc_get_page_permalink( 'shop' ),
                    'action_label'=> esc_html__( 'رفتن به فروشگاه', 'sorena' ),
                )
            );
            ?>
        <?php endif; ?>
    </div>

    <?php do_action( 'woocommerce_account_dashboard' ); ?>
</div>
