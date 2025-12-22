<?php
/**
 * Template Name: Favorites
 */
get_header();

if ( ! is_user_logged_in() ) : ?>
    <main class="container mx-auto px-4 py-16">
        <div class="glass-surface rounded-3xl p-10 text-center">
            <h1 class="text-2xl font-bold mb-4"><?php echo esc_html__( 'برای مشاهده علاقه‌مندی‌ها وارد حساب خود شوید.', 'sorena' ); ?></h1>
            <a href="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>" class="inline-flex items-center rounded-full px-6 py-3 bg-primary text-white"><?php echo esc_html__( 'ورود / ثبت‌نام', 'sorena' ); ?></a>
        </div>
    </main>
<?php
    get_footer();
    return;
endif;

$user_id   = get_current_user_id();
$favorites = (array) get_user_meta( $user_id, '_sorena_favorites', true );
$products  = $favorites ? wc_get_products( array( 'include' => $favorites, 'limit' => -1 ) ) : array();
?>
<main class="container mx-auto px-4 py-12">
    <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2"><?php echo esc_html__( 'علاقه‌مندی‌های من', 'sorena' ); ?></h1>
        <p class="text-muted-foreground"><?php echo esc_html__( 'محصولاتی که برای بعد ذخیره کرده‌اید اینجا نمایش داده می‌شوند.', 'sorena' ); ?></p>
    </div>

    <?php if ( $products ) : ?>
        <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <?php foreach ( $products as $product ) : ?>
                <?php $GLOBALS['sorena_product'] = $product; ?>
                <?php get_template_part( 'template-parts/components/product-card' ); ?>
            <?php endforeach; ?>
        </div>
    <?php else : ?>
        <div class="text-center py-16">
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <?php echo sorena_icon( 'heart', 'w-12 h-12 text-muted-foreground' ); ?>
            </div>
            <h2 class="text-xl font-semibold mb-2"><?php echo esc_html__( 'هنوز چیزی به علاقه‌مندی‌ها اضافه نکرده‌اید', 'sorena' ); ?></h2>
            <p class="text-muted-foreground mb-6"><?php echo esc_html__( 'محصولات مورد علاقه خود را ذخیره کنید تا سریع‌تر به آن‌ها دسترسی داشته باشید.', 'sorena' ); ?></p>
            <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="inline-flex items-center rounded-full px-8 py-3 bg-primary text-white">
                <?php echo esc_html__( 'مشاهده فروشگاه', 'sorena' ); ?>
            </a>
        </div>
    <?php endif; ?>
</main>
<?php
get_footer();
