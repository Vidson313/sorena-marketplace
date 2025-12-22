<?php
/**
 * My addresses.
 */
defined( 'ABSPATH' ) || exit;

$customer_id = get_current_user_id();
$get_addresses = wc_ship_to_billing_address_only()
    ? array( 'billing' => __( 'Billing address', 'woocommerce' ) )
    : array(
        'billing'  => __( 'Billing address', 'woocommerce' ),
        'shipping' => __( 'Shipping address', 'woocommerce' ),
    );
?>
<div class="grid md:grid-cols-2 gap-6">
    <?php foreach ( $get_addresses as $name => $address_title ) : ?>
        <?php $address = wc_get_account_formatted_address( $name ); ?>
        <div class="glass-surface rounded-3xl p-6 space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold"><?php echo esc_html( $address_title ); ?></h3>
                <a href="<?php echo esc_url( wc_get_endpoint_url( 'edit-address', $name ) ); ?>" class="text-sm text-primary hover:text-primary/80">
                    <?php echo esc_html__( 'ویرایش', 'sorena' ); ?>
                </a>
            </div>
            <?php if ( $address ) : ?>
                <address class="not-italic text-sm text-muted-foreground leading-relaxed">
                    <?php echo wp_kses_post( $address ); ?>
                </address>
            <?php else : ?>
                <p class="text-sm text-muted-foreground">
                    <?php echo esc_html__( 'هنوز آدرسی برای این بخش ثبت نشده است.', 'sorena' ); ?>
                </p>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>
</div>
