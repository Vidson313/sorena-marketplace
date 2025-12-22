<?php
/**
 * My account navigation.
 */
defined( 'ABSPATH' ) || exit;

$menu_items = wc_get_account_menu_items();
$icon_map   = array(
    'dashboard'        => 'sparkles',
    'orders'           => 'shopping-cart',
    'downloads'        => 'download',
    'edit-address'     => 'map-pin',
    'payment-methods'  => 'tag',
    'edit-account'     => 'users',
    'customer-logout'  => 'arrow-left',
);
?>
<nav class="space-y-4" aria-label="<?php echo esc_attr__( 'ناوبری حساب کاربری', 'sorena' ); ?>">
    <div class="lg:hidden">
        <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            <?php foreach ( $menu_items as $endpoint => $label ) : ?>
                <?php
                $classes   = wc_get_account_menu_item_classes( $endpoint );
                $is_active = strpos( $classes, 'is-active' ) !== false;
                $tab_class = $is_active
                    ? 'bg-primary text-white'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted';
                ?>
                <a
                    class="inline-flex items-center rounded-full px-4 py-2 text-xs whitespace-nowrap <?php echo esc_attr( $tab_class ); ?>"
                    href="<?php echo esc_url( wc_get_account_endpoint_url( $endpoint ) ); ?>"
                    <?php echo $is_active ? 'aria-current="page"' : ''; ?>
                >
                    <?php echo esc_html( $label ); ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="hidden lg:block glass-surface rounded-3xl p-4">
        <p class="text-xs text-muted-foreground mb-4"><?php echo esc_html__( 'منوی حساب', 'sorena' ); ?></p>
        <ul class="space-y-2">
            <?php foreach ( $menu_items as $endpoint => $label ) : ?>
                <?php
                $classes   = wc_get_account_menu_item_classes( $endpoint );
                $is_active = strpos( $classes, 'is-active' ) !== false;
                $link_class = $is_active
                    ? 'bg-primary/15 text-foreground border border-primary/40'
                    : 'bg-muted/40 text-muted-foreground border border-transparent hover:border-border hover:text-foreground';
                $icon_name = isset( $icon_map[ $endpoint ] ) ? $icon_map[ $endpoint ] : 'chevron-left';
                ?>
                <li class="<?php echo esc_attr( $classes ); ?>">
                    <a
                        class="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm transition-colors <?php echo esc_attr( $link_class ); ?>"
                        href="<?php echo esc_url( wc_get_account_endpoint_url( $endpoint ) ); ?>"
                        <?php echo $is_active ? 'aria-current="page"' : ''; ?>
                    >
                        <span class="inline-flex items-center gap-3">
                            <?php echo sorena_icon( $icon_name, 'w-4 h-4' ); ?>
                            <?php echo esc_html( $label ); ?>
                        </span>
                        <?php echo sorena_icon( 'chevron-left', 'w-4 h-4' ); ?>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</nav>
