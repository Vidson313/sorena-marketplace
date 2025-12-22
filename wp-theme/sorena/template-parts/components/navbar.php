<?php
/**
 * Navbar component.
 */
$categories = get_terms( array(
    'taxonomy'   => 'product_cat',
    'hide_empty' => false,
    'number'     => 6,
) );

$cart_count = 0;
if ( class_exists( 'WooCommerce' ) && WC()->cart ) {
    $cart_count = WC()->cart->get_cart_contents_count();
}
?>
<nav class="sticky top-0 z-50 w-full glass-surface-strong border-b border-border/40">
    <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo-wrap">
                <?php if ( has_custom_logo() ) : ?>
                    <span class="block site-logo">
                        <?php the_custom_logo(); ?>
                    </span>
                <?php else : ?>
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span class="text-white font-bold text-xl">س</span>
                    </div>
                    <span class="text-xl font-bold gradient-text hidden sm:block"><?php echo esc_html__( 'سورنا', 'sorena' ); ?></span>
                <?php endif; ?>
            </a>

            <div class="hidden lg:flex items-center gap-6 site-nav">
                <?php
                wp_nav_menu(
                    array(
                        'theme_location' => 'primary',
                        'container'      => false,
                        'fallback_cb'    => false,
                        'items_wrap'     => '<ul class="flex items-center gap-6 menu-primary">%3$s</ul>',
                    )
                );
                ?>
            </div>

            <form class="hidden md:flex flex-1 max-w-md mx-6 site-search" action="<?php echo esc_url( home_url( '/' ) ); ?>" method="get">
                <input type="hidden" name="post_type" value="product" />
                <div class="relative w-full">
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                        <?php echo sorena_icon( 'search' ); ?>
                    </span>
                    <input
                        type="search"
                        name="s"
                        placeholder="<?php echo esc_attr__( 'جستجوی محصولات...', 'sorena' ); ?>"
                        class="site-search-input w-full h-10 pr-10 pl-4 rounded-full bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        value="<?php echo esc_attr( get_search_query() ); ?>"
                    />
                </div>
            </form>

            <div class="flex items-center gap-2 site-actions">
                <button type="button" class="theme-toggle inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted/50 hover:bg-muted" aria-label="<?php echo esc_attr__( 'تغییر تم', 'sorena' ); ?>">
                    <?php echo sorena_icon( 'sparkles', 'w-5 h-5 text-primary' ); ?>
                </button>

                <a href="<?php echo esc_url( home_url( '/favorites' ) ); ?>" class="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted/50" aria-label="<?php echo esc_attr__( 'علاقه‌مندی‌ها', 'sorena' ); ?>">
                    <?php echo sorena_icon( 'heart', 'w-6 h-6' ); ?>
                </a>

                <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted/50 relative" aria-label="<?php echo esc_attr__( 'سبد خرید', 'sorena' ); ?>">
                    <?php echo sorena_icon( 'shopping-cart', 'w-6 h-6' ); ?>
                    <?php if ( $cart_count ) : ?>
                        <span class="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                            <?php echo esc_html( $cart_count ); ?>
                        </span>
                    <?php endif; ?>
                </a>

                <?php if ( is_user_logged_in() ) : ?>
                    <a href="<?php echo esc_url( wc_get_account_endpoint_url( 'dashboard' ) ); ?>" class="hidden sm:inline-flex items-center justify-center rounded-full px-4 py-2 bg-secondary text-sm">
                        <?php echo esc_html__( 'داشبورد', 'sorena' ); ?>
                    </a>
                <?php else : ?>
                    <a href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>" class="hidden sm:inline-flex items-center justify-center rounded-full px-4 py-2 bg-primary text-white">
                        <?php echo esc_html__( 'ورود / ثبت‌نام', 'sorena' ); ?>
                    </a>
                <?php endif; ?>

                <button type="button" class="mobile-menu-toggle inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted/50 lg:hidden" aria-label="<?php echo esc_attr__( 'باز کردن منو', 'sorena' ); ?>" aria-controls="mobile-menu" aria-expanded="false">
                    <?php echo sorena_icon( 'menu', 'w-6 h-6' ); ?>
                </button>
            </div>
        </div>
    </div>
    <div id="mobile-menu" class="mobile-menu hidden lg:hidden border-t border-border/40">
        <div class="container mx-auto px-4 py-4 flex flex-col gap-3 mobile-menu-scroll">
            <div class="rounded-2xl border border-border/40 p-4 bg-card/50">
                <h4 class="text-sm font-semibold mb-2"><?php echo esc_html__( 'دسته‌بندی محصولات', 'sorena' ); ?></h4>
                <div class="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <?php foreach ( $categories as $category ) : ?>
                        <a href="<?php echo esc_url( get_term_link( $category ) ); ?>" class="px-3 py-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
                            <?php echo esc_html( $category->name ); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php
            wp_nav_menu(
                array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'fallback_cb'    => false,
                    'items_wrap'     => '<ul class="space-y-3">%3$s</ul>',
                )
            );
            ?>
        </div>
    </div>
</nav>
