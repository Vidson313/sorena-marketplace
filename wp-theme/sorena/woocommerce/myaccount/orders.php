<?php
/**
 * My Account orders.
 */
defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_account_orders', isset( $has_orders ) ? $has_orders : false );

$customer_orders = wc_get_orders(
    apply_filters(
        'woocommerce_my_account_my_orders_query',
        array(
            'customer' => get_current_user_id(),
            'paginate' => true,
        )
    )
);

$has_orders = $customer_orders && $customer_orders->total > 0;
?>

<?php if ( $has_orders ) : ?>
    <div class="hidden lg:block">
        <div class="glass-surface rounded-3xl p-6">
            <table class="w-full text-sm">
                <thead>
                    <tr class="text-muted-foreground">
                        <?php foreach ( wc_get_account_orders_columns() as $column_id => $column_name ) : ?>
                            <th class="text-right font-medium pb-3"><?php echo esc_html( $column_name ); ?></th>
                        <?php endforeach; ?>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border/40">
                    <?php foreach ( $customer_orders->orders as $customer_order ) : ?>
                        <?php
                        $order = wc_get_order( $customer_order );
                        if ( ! $order ) {
                            continue;
                        }
                        ?>
                        <tr class="align-middle">
                            <?php foreach ( wc_get_account_orders_columns() as $column_id => $column_name ) : ?>
                                <td class="py-4 text-right">
                                    <?php if ( has_action( 'woocommerce_my_account_my_orders_column_' . $column_id ) ) : ?>
                                        <?php do_action( 'woocommerce_my_account_my_orders_column_' . $column_id, $order ); ?>
                                    <?php elseif ( 'order-number' === $column_id ) : ?>
                                        <a href="<?php echo esc_url( $order->get_view_order_url() ); ?>" class="font-semibold hover:text-primary">
                                            #<?php echo esc_html( $order->get_order_number() ); ?>
                                        </a>
                                    <?php elseif ( 'order-date' === $column_id ) : ?>
                                        <?php if ( $order->get_date_created() ) : ?>
                                            <time datetime="<?php echo esc_attr( $order->get_date_created()->date( 'c' ) ); ?>">
                                                <?php echo esc_html( wc_format_datetime( $order->get_date_created() ) ); ?>
                                            </time>
                                        <?php else : ?>
                                            <span>-</span>
                                        <?php endif; ?>
                                    <?php elseif ( 'order-status' === $column_id ) : ?>
                                        <span class="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs">
                                            <?php echo esc_html( wc_get_order_status_name( $order->get_status() ) ); ?>
                                        </span>
                                    <?php elseif ( 'order-total' === $column_id ) : ?>
                                        <?php echo wp_kses_post( $order->get_formatted_order_total() ); ?>
                                    <?php elseif ( 'order-actions' === $column_id ) : ?>
                                        <div class="flex flex-wrap gap-2">
                                            <?php
                                            $actions = wc_get_account_orders_actions( $order );
                                            if ( $actions ) :
                                                foreach ( $actions as $key => $action ) :
                                                    ?>
                                                    <a href="<?php echo esc_url( $action['url'] ); ?>" class="inline-flex items-center rounded-full px-3 py-1.5 text-xs border border-border/50 hover:bg-muted/60">
                                                        <?php echo esc_html( $action['name'] ); ?>
                                                    </a>
                                                <?php
                                                endforeach;
                                            endif;
                                            ?>
                                        </div>
                                    <?php else : ?>
                                        <?php echo esc_html( $order->get_meta( $column_id ) ); ?>
                                    <?php endif; ?>
                                </td>
                            <?php endforeach; ?>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="grid gap-4 lg:hidden">
        <?php foreach ( $customer_orders->orders as $customer_order ) : ?>
            <?php
            $order = wc_get_order( $customer_order );
            if ( ! $order ) {
                continue;
            }
            ?>
            <div class="glass-surface rounded-2xl p-5 space-y-4">
                <div class="flex items-center justify-between">
                    <a href="<?php echo esc_url( $order->get_view_order_url() ); ?>" class="font-semibold">
                        <?php echo esc_html__( 'سفارش', 'sorena' ); ?> #<?php echo esc_html( $order->get_order_number() ); ?>
                    </a>
                    <span class="text-xs rounded-full bg-muted/60 px-3 py-1">
                        <?php echo esc_html( wc_get_order_status_name( $order->get_status() ) ); ?>
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-muted-foreground"><?php echo esc_html__( 'تاریخ', 'sorena' ); ?></p>
                        <p><?php echo esc_html( wc_format_datetime( $order->get_date_created() ) ); ?></p>
                    </div>
                    <div>
                        <p class="text-muted-foreground"><?php echo esc_html__( 'مبلغ', 'sorena' ); ?></p>
                        <p><?php echo wp_kses_post( $order->get_formatted_order_total() ); ?></p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2">
                    <?php
                    $actions = wc_get_account_orders_actions( $order );
                    if ( $actions ) :
                        foreach ( $actions as $key => $action ) :
                            ?>
                            <a href="<?php echo esc_url( $action['url'] ); ?>" class="inline-flex items-center rounded-full px-3 py-1.5 text-xs border border-border/50 hover:bg-muted/60">
                                <?php echo esc_html( $action['name'] ); ?>
                            </a>
                        <?php
                        endforeach;
                    endif;
                    ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <?php if ( $customer_orders->max_num_pages > 1 ) : ?>
        <?php
        $current_page = max( 1, get_query_var( 'paged' ) );
        $pagination   = paginate_links(
            array(
                'base'      => esc_url_raw( wc_get_endpoint_url( 'orders', '%#%' ) ),
                'format'    => '',
                'current'   => $current_page,
                'total'     => $customer_orders->max_num_pages,
                'prev_text' => '‹',
                'next_text' => '›',
                'type'      => 'list',
            )
        );
        ?>
        <?php if ( $pagination ) : ?>
            <nav class="woocommerce-pagination mt-6">
                <?php echo wp_kses_post( $pagination ); ?>
            </nav>
        <?php endif; ?>
    <?php endif; ?>
<?php else : ?>
    <?php
    get_template_part(
        'template-parts/account/empty-state',
        null,
        array(
            'icon'        => 'shopping-cart',
            'title'       => esc_html__( 'هنوز سفارشی ثبت نکرده‌اید', 'sorena' ),
            'description' => esc_html__( 'با اولین خرید، سفارش‌های شما اینجا نمایش داده می‌شود.', 'sorena' ),
            'action_url'  => wc_get_page_permalink( 'shop' ),
            'action_label'=> esc_html__( 'رفتن به فروشگاه', 'sorena' ),
        )
    );
    ?>
<?php endif; ?>

<?php do_action( 'woocommerce_after_account_orders', $has_orders ); ?>
