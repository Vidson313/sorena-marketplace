<?php
/**
 * Checkout form.
 */
defined( 'ABSPATH' ) || exit;

$checkout = WC()->checkout();
?>
<main class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8"><?php echo esc_html__( 'تکمیل سفارش', 'sorena' ); ?></h1>
    <form name="checkout" method="post" class="checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">
        <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <div class="glass-surface rounded-2xl p-6">
                    <h2 class="text-lg font-semibold mb-4"><?php echo esc_html__( 'اطلاعات صورتحساب', 'sorena' ); ?></h2>
                    <?php do_action( 'woocommerce_checkout_billing' ); ?>
                </div>
                <div class="glass-surface rounded-2xl p-6">
                    <h2 class="text-lg font-semibold mb-4"><?php echo esc_html__( 'روش پرداخت', 'sorena' ); ?></h2>
                    <?php wc_get_template( 'checkout/payment.php', array( 'checkout' => $checkout ) ); ?>
                </div>
            </div>
            <div class="space-y-6">
                <div class="glass-surface rounded-2xl p-6 sticky top-24">
                    <h3 class="font-semibold mb-4"><?php echo esc_html__( 'خلاصه سفارش', 'sorena' ); ?></h3>
                    <?php wc_get_template( 'checkout/review-order.php', array( 'checkout' => $checkout ) ); ?>
                </div>
            </div>
        </div>
    </form>
</main>
