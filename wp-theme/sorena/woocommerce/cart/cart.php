<?php
/**
 * Cart template.
 */
defined( 'ABSPATH' ) || exit;

$cart = WC()->cart;
?>
<?php if ( $cart && $cart->is_empty() ) : ?>
    <main class="container mx-auto px-4 py-16">
        <div class="text-center">
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <?php echo sorena_icon( 'shopping-cart', 'w-12 h-12 text-muted-foreground' ); ?>
            </div>
            <h2 class="text-xl font-semibold mb-2"><?php echo esc_html__( 'سبد خرید شما خالی است', 'sorena' ); ?></h2>
            <p class="text-muted-foreground mb-6"><?php echo esc_html__( 'برای مشاهده محصولات جدید و افزودن به سبد خرید، به فروشگاه سر بزنید.', 'sorena' ); ?></p>
            <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="inline-flex items-center rounded-full px-8 py-3 bg-primary text-white">
                <?php echo esc_html__( 'بازگشت به فروشگاه', 'sorena' ); ?>
            </a>
        </div>
    </main>
<?php return; endif; ?>

<main class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-8"><?php echo esc_html__( 'سبد خرید', 'sorena' ); ?></h1>
    <form class="cart-form" action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
        <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
                <?php foreach ( $cart->get_cart() as $cart_item_key => $cart_item ) : ?>
                    <?php
                    $product = $cart_item['data'];
                    if ( ! $product || ! $product->exists() ) {
                        continue;
                    }
                    ?>
                    <div class="glass-surface rounded-2xl p-4 flex items-center gap-4">
                        <div class="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <?php echo $product->get_image( 'woocommerce_thumbnail', array( 'class' => 'w-full h-full object-cover' ) ); ?>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-semibold text-sm truncate"><?php echo esc_html( $product->get_name() ); ?></h3>
                            <p class="text-xs text-muted-foreground"><?php echo wp_kses_post( $product->get_price_html() ); ?></p>
                        </div>
                        <div class="text-left">
                            <?php echo wc_get_formatted_cart_item_data( $cart_item ); ?>
                            <?php
                            $subtotal = apply_filters(
                                'woocommerce_cart_item_subtotal',
                                $cart->get_product_subtotal( $product, $cart_item['quantity'] ),
                                $cart_item,
                                $cart_item_key
                            );
                            echo wp_kses_post( $subtotal );
                            ?>
                        </div>
                        <div>
                            <?php echo wc_get_cart_remove_link( $cart_item_key, $product->get_id() ); ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="space-y-6">
                <div class="glass-surface rounded-2xl p-6 sticky top-24">
                    <h3 class="font-semibold mb-4"><?php echo esc_html__( 'خلاصه سفارش', 'sorena' ); ?></h3>
                    <div class="space-y-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground"><?php echo esc_html__( 'جمع جزء', 'sorena' ); ?></span>
                            <span><?php echo wp_kses_post( $cart->get_cart_subtotal() ); ?></span>
                        </div>
                        <div class="border-t border-border pt-3 flex justify-between font-semibold text-base">
                            <span><?php echo esc_html__( 'مبلغ قابل پرداخت', 'sorena' ); ?></span>
                            <span class="text-primary"><?php echo wp_kses_post( $cart->get_total() ); ?></span>
                        </div>
                    </div>
                    <a href="<?php echo esc_url( wc_get_checkout_url() ); ?>" class="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center mt-6">
                        <?php echo esc_html__( 'ادامه فرایند پرداخت', 'sorena' ); ?>
                    </a>
                </div>
                <div class="glass-surface rounded-2xl p-6">
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 text-sm">
                            <div class="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <?php echo sorena_icon( 'shield', 'w-4 h-4 text-green-500' ); ?>
                            </div>
                            <span><?php echo esc_html__( 'پرداخت امن با درگاه‌های معتبر', 'sorena' ); ?></span>
                        </div>
                        <div class="flex items-center gap-3 text-sm">
                            <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <?php echo sorena_icon( 'download', 'w-4 h-4 text-blue-500' ); ?>
                            </div>
                            <span><?php echo esc_html__( 'دانلود فوری پس از پرداخت', 'sorena' ); ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php wp_nonce_field( 'woocommerce-cart', 'woocommerce-cart-nonce' ); ?>
        <button type="submit" name="update_cart" value="<?php esc_attr_e( 'Update cart', 'sorena' ); ?>" class="hidden" aria-hidden="true"></button>
    </form>
</main>
