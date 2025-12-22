<?php
/**
 * Footer component.
 */
$categories = get_terms( array(
    'taxonomy'   => 'product_cat',
    'hide_empty' => false,
    'number'     => 5,
) );
?>
<footer class="bg-card border-t border-border">
    <div class="border-b border-border">
        <div class="container mx-auto px-4 py-12">
            <div class="glass-surface rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div class="text-center lg:text-right">
                    <h3 class="text-xl font-bold mb-2"><?php echo esc_html( sorena_get_option( 'newsletter_title' ) ); ?></h3>
                    <p class="text-muted-foreground text-sm">
                        <?php echo esc_html( sorena_get_option( 'newsletter_description' ) ); ?>
                    </p>
                </div>
                <form class="flex gap-3 w-full lg:w-auto" method="post" action="#">
                    <input
                        type="email"
                        name="newsletter_email"
                        placeholder="<?php echo esc_attr( sorena_get_option( 'newsletter_placeholder' ) ); ?>"
                        class="flex-1 lg:w-80 h-12 px-5 rounded-full bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button type="submit" class="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-white">
                        <?php echo esc_html( sorena_get_option( 'newsletter_button' ) ); ?>
                    </button>
                </form>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div class="col-span-2 md:col-span-4 lg:col-span-1">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-2 mb-4">
                    <?php if ( has_custom_logo() ) : ?>
                        <span class="block site-logo">
                            <?php the_custom_logo(); ?>
                        </span>
                    <?php else : ?>
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span class="text-white font-bold text-xl">س</span>
                        </div>
                        <span class="text-xl font-bold gradient-text"><?php echo esc_html__( 'سورنا', 'sorena' ); ?></span>
                    <?php endif; ?>
                </a>
                <p class="text-sm text-muted-foreground mb-4 leading-relaxed">
                    <?php echo esc_html__( 'سورنا پلتفرم حرفه‌ای فروش پروژه‌های آماده است که به تیم‌ها کمک می‌کند سریع‌تر بسازند و بهتر رشد کنند.', 'sorena' ); ?>
                </p>
                <div class="flex gap-3">
                    <a href="<?php echo esc_url( sorena_get_option( 'footer_instagram' ) ); ?>" class="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                        <?php echo sorena_icon( 'instagram', 'w-4 h-4' ); ?>
                    </a>
                    <a href="<?php echo esc_url( sorena_get_option( 'footer_twitter' ) ); ?>" class="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                        <?php echo sorena_icon( 'twitter', 'w-4 h-4' ); ?>
                    </a>
                    <a href="<?php echo esc_url( sorena_get_option( 'footer_linkedin' ) ); ?>" class="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                        <?php echo sorena_icon( 'linkedin', 'w-4 h-4' ); ?>
                    </a>
                    <a href="<?php echo esc_url( sorena_get_option( 'footer_github' ) ); ?>" class="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                        <?php echo sorena_icon( 'github', 'w-4 h-4' ); ?>
                    </a>
                </div>
            </div>

            <div>
                <h4 class="font-semibold mb-4"><?php echo esc_html__( 'دسته‌بندی‌ها', 'sorena' ); ?></h4>
                <ul class="space-y-2">
                    <?php if ( ! empty( $categories ) && ! is_wp_error( $categories ) ) : ?>
                        <?php foreach ( $categories as $category ) : ?>
                            <li>
                                <a href="<?php echo esc_url( get_term_link( $category ) ); ?>" class="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    <?php echo esc_html( $category->name ); ?>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </ul>
            </div>

            <div>
                <h4 class="font-semibold mb-4"><?php echo esc_html__( 'پشتیبانی', 'sorena' ); ?></h4>
                <?php
                wp_nav_menu(
                    array(
                        'theme_location' => 'footer_support',
                        'container'      => false,
                        'fallback_cb'    => false,
                        'menu_class'     => 'space-y-2 text-sm text-muted-foreground',
                        'items_wrap'     => '<ul class="space-y-2">%3$s</ul>',
                    )
                );
                ?>
            </div>

            <div>
                <h4 class="font-semibold mb-4"><?php echo esc_html__( 'شرکت', 'sorena' ); ?></h4>
                <?php
                wp_nav_menu(
                    array(
                        'theme_location' => 'footer_company',
                        'container'      => false,
                        'fallback_cb'    => false,
                        'menu_class'     => 'space-y-2 text-sm text-muted-foreground',
                        'items_wrap'     => '<ul class="space-y-2">%3$s</ul>',
                    )
                );
                ?>
            </div>

            <div>
                <h4 class="font-semibold mb-4"><?php echo esc_html__( 'راه‌های ارتباطی', 'sorena' ); ?></h4>
                <ul class="space-y-3">
                    <li class="flex items-center gap-2 text-sm text-muted-foreground">
                        <?php echo sorena_icon( 'mail', 'w-4 h-4' ); ?>
                        <span><?php echo esc_html( sorena_get_option( 'footer_email' ) ); ?></span>
                    </li>
                    <li class="flex items-center gap-2 text-sm text-muted-foreground">
                        <?php echo sorena_icon( 'phone', 'w-4 h-4' ); ?>
                        <span dir="ltr"><?php echo esc_html( sorena_get_option( 'footer_phone' ) ); ?></span>
                    </li>
                    <li class="flex items-start gap-2 text-sm text-muted-foreground">
                        <?php echo sorena_icon( 'map-pin', 'w-4 h-4 mt-0.5' ); ?>
                        <span><?php echo esc_html( sorena_get_option( 'footer_address' ) ); ?></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="border-t border-border">
        <div class="container mx-auto px-4 py-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-sm text-muted-foreground">© <?php echo esc_html( date( 'Y' ) ); ?> <?php echo esc_html__( 'سورنا. تمامی حقوق محفوظ است.', 'sorena' ); ?></p>
                <div class="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&q=80" alt="Payment" class="h-8 rounded opacity-70" />
                    <span class="text-xs text-muted-foreground"><?php echo esc_html__( 'پرداخت امن با درگاه‌های معتبر', 'sorena' ); ?></span>
                </div>
            </div>
        </div>
    </div>
</footer>
