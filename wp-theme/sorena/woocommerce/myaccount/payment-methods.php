<?php
/**
 * My Account payment methods.
 */
defined( 'ABSPATH' ) || exit;

$user_id = get_current_user_id();
$saved_methods = ( $user_id && function_exists( 'wc_get_customer_saved_methods_list' ) )
    ? wc_get_customer_saved_methods_list( $user_id )
    : array();
$has_methods   = ! empty( $saved_methods );
$available_gateways = ( function_exists( 'WC' ) && WC()->payment_gateways() )
    ? WC()->payment_gateways()->get_available_payment_gateways()
    : array();
?>

<div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-lg font-semibold"><?php echo esc_html__( 'روش‌های پرداخت', 'sorena' ); ?></h2>
        <?php if ( $available_gateways ) : ?>
            <a href="<?php echo esc_url( wc_get_endpoint_url( 'add-payment-method' ) ); ?>" class="inline-flex items-center rounded-full px-4 py-2 bg-primary text-white text-sm">
                <?php echo esc_html__( 'افزودن روش پرداخت', 'sorena' ); ?>
            </a>
        <?php endif; ?>
    </div>

    <?php if ( $has_methods ) : ?>
        <div class="grid md:grid-cols-2 gap-4">
            <?php foreach ( $saved_methods as $gateway_id => $methods ) : ?>
                <?php foreach ( $methods as $method ) : ?>
                    <?php
                    $method_data = isset( $method['method'] ) ? $method['method'] : array();
                    $brand = isset( $method_data['brand'] ) ? $method_data['brand'] : '';
                    $last4 = isset( $method_data['last4'] ) ? $method_data['last4'] : '';
                    $gateway_id = isset( $method_data['gateway_id'] ) ? $method_data['gateway_id'] : '';
                    ?>
                    <div class="glass-surface rounded-2xl p-5 space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-muted-foreground"><?php echo esc_html__( 'روش', 'sorena' ); ?></p>
                                <p class="font-semibold">
                                    <?php echo esc_html( $last4 ? $brand : $gateway_id ); ?>
                                </p>
                            </div>
                            <?php if ( $last4 ) : ?>
                                <span class="text-xs bg-muted/60 rounded-full px-3 py-1">
                                    •••• <?php echo esc_html( $last4 ); ?>
                                </span>
                            <?php endif; ?>
                        </div>

                        <?php if ( ! empty( $method['expires'] ) ) : ?>
                            <p class="text-xs text-muted-foreground">
                                <?php echo esc_html__( 'تاریخ انقضا:', 'sorena' ); ?>
                                <?php echo esc_html( $method['expires'] ); ?>
                            </p>
                        <?php endif; ?>

                        <div class="flex flex-wrap gap-2">
                            <?php
                            $actions = wc_get_account_payment_methods_actions( $method );
                            if ( $actions ) :
                                foreach ( $actions as $key => $action ) :
                                    ?>
                                    <a href="<?php echo esc_url( $action['url'] ); ?>" class="inline-flex items-center rounded-full px-3 py-1.5 text-xs border border-border/50 hover:bg-muted/60">
                                        <?php echo esc_html( $action['name'] ); ?>
                                    </a>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endforeach; ?>
        </div>
    <?php else : ?>
        <?php
        get_template_part(
            'template-parts/account/empty-state',
            null,
            array(
                'icon'        => 'tag',
                'title'       => esc_html__( 'روش پرداختی ذخیره نشده', 'sorena' ),
                'description' => esc_html__( 'برای پرداخت سریع‌تر، می‌توانید یک روش پرداخت ذخیره کنید.', 'sorena' ),
                'action_url'  => $available_gateways ? wc_get_endpoint_url( 'add-payment-method' ) : '',
                'action_label'=> $available_gateways ? esc_html__( 'افزودن روش پرداخت', 'sorena' ) : '',
            )
        );
        ?>
    <?php endif; ?>

    <?php do_action( 'woocommerce_after_account_payment_methods' ); ?>
</div>
