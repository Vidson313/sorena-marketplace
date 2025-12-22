<?php
/**
 * WooCommerce product archive.
 */
get_header();

$active_filters = array();
if ( ! empty( $_GET['category'] ) ) {
    $term = get_term_by( 'slug', sanitize_text_field( wp_unslash( $_GET['category'] ) ), 'product_cat' );
    if ( $term ) {
        $active_filters[] = array( 'label' => $term->name, 'url' => wc_get_page_permalink( 'shop' ) );
    }
}
if ( ! empty( $_GET['technology'] ) ) {
    $term = get_term_by( 'slug', sanitize_text_field( wp_unslash( $_GET['technology'] ) ), 'product_tech' );
    if ( $term ) {
        $active_filters[] = array( 'label' => $term->name, 'url' => wc_get_page_permalink( 'shop' ) );
    }
}
if ( ! empty( $_GET['difficulty'] ) ) {
    $active_filters[] = array( 'label' => sorena_get_difficulty_label( sanitize_text_field( wp_unslash( $_GET['difficulty'] ) ) ), 'url' => wc_get_page_permalink( 'shop' ) );
}
if ( ! empty( $_GET['s'] ) ) {
    $active_filters[] = array( 'label' => esc_html__( 'جستجو:', 'sorena' ) . ' ' . sanitize_text_field( wp_unslash( $_GET['s'] ) ), 'url' => wc_get_page_permalink( 'shop' ) );
}
?>
<main class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2"><?php echo esc_html__( 'فروشگاه', 'sorena' ); ?></h1>
            <p class="text-muted-foreground"><?php echo esc_html( wc_get_loop_prop( 'total' ) ); ?> <?php echo esc_html__( 'محصول در دسترس', 'sorena' ); ?></p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
            <aside class="w-full lg:w-64 flex-shrink-0">
                <?php get_template_part( 'template-parts/components/product-filters' ); ?>
            </aside>

            <div class="flex-1">
                <div class="flex items-center justify-between mb-6">
                    <p class="text-sm text-muted-foreground"><?php echo esc_html__( 'نمایش', 'sorena' ); ?> <span class="font-medium text-foreground"><?php echo esc_html( wc_get_loop_prop( 'total' ) ); ?></span> <?php echo esc_html__( 'محصول', 'sorena' ); ?></p>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-1 border border-border rounded-lg p-1">
                            <span class="inline-flex items-center justify-center h-8 w-8">
                                <?php echo sorena_icon( 'grid', 'h-4 w-4' ); ?>
                            </span>
                            <span class="inline-flex items-center justify-center h-8 w-8">
                                <?php echo sorena_icon( 'list', 'h-4 w-4' ); ?>
                            </span>
                        </div>
                    </div>
                </div>

                <?php if ( $active_filters ) : ?>
                    <div class="flex flex-wrap gap-2 mb-6">
                        <?php foreach ( $active_filters as $filter ) : ?>
                            <a href="<?php echo esc_url( $filter['url'] ); ?>" class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                <?php echo esc_html( $filter['label'] ); ?>
                                <?php echo sorena_icon( 'x', 'h-3 w-3' ); ?>
                            </a>
                        <?php endforeach; ?>
                        <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border text-muted-foreground text-sm"><?php echo esc_html__( 'حذف همه فیلترها', 'sorena' ); ?></a>
                    </div>
                <?php endif; ?>

                <?php if ( have_posts() ) : ?>
                    <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        <?php while ( have_posts() ) : the_post(); ?>
                            <?php $product = wc_get_product( get_the_ID() ); ?>
                            <?php $GLOBALS['sorena_product'] = $product; ?>
                            <?php get_template_part( 'template-parts/components/product-card' ); ?>
                        <?php endwhile; ?>
                    </div>

                    <div class="mt-10">
                        <?php woocommerce_pagination(); ?>
                    </div>
                <?php else : ?>
                    <div class="text-center py-16">
                        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                            <?php echo sorena_icon( 'search', 'w-12 h-12 text-muted-foreground' ); ?>
                        </div>
                        <h2 class="text-xl font-semibold mb-2"><?php echo esc_html__( 'محصولی پیدا نشد', 'sorena' ); ?></h2>
                        <p class="text-muted-foreground mb-6"><?php echo esc_html__( 'جستجو یا فیلترهای خود را تغییر دهید و دوباره تلاش کنید.', 'sorena' ); ?></p>
                        <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="inline-flex items-center rounded-full px-8 py-3 bg-primary text-white"><?php echo esc_html__( 'مشاهده همه محصولات', 'sorena' ); ?></a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>
<?php
get_footer();
