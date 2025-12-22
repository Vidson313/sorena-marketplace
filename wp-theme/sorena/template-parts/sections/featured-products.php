<?php
$featured_products = array();
if ( function_exists( 'wc_get_products' ) ) {
    $featured_products = wc_get_products( array( 'limit' => 4, 'featured' => true ) );
    if ( empty( $featured_products ) ) {
        $featured_products = wc_get_products( array( 'limit' => 4 ) );
    }
}
?>
<section class="py-16">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-10">
            <div>
                <h2 class="text-2xl md:text-3xl font-bold mb-2"><?php echo esc_html__( 'پروژه‌های ویژه', 'sorena' ); ?></h2>
                <p class="text-muted-foreground"><?php echo esc_html__( 'منتخب‌های تیم سورنا برای شروع سریع و حرفه‌ای', 'sorena' ); ?></p>
            </div>
            <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="inline-flex items-center rounded-full gap-2 border border-border px-4 py-2">
                <?php echo esc_html__( 'مشاهده همه', 'sorena' ); ?>
                <?php echo sorena_icon( 'arrow-left', 'w-4 h-4' ); ?>
            </a>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <?php foreach ( $featured_products as $product ) : ?>
                <?php
                $GLOBALS['sorena_product'] = $product;
                get_template_part( 'template-parts/components/product-card' );
                ?>
            <?php endforeach; ?>
        </div>
    </div>
</section>
