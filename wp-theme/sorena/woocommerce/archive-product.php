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
    $active_filters[] = array( 'label' => esc_html__( 'Search', 'sorena' ) . ' ' . sanitize_text_field( wp_unslash( $_GET['s'] ) ), 'url' => wc_get_page_permalink( 'shop' ) );
}

$total_products = wc_get_loop_prop( 'total' );
?>
<main class="min-h-screen bg-background">
    <div class="max-w-7xl mx-auto w-full px-4 lg:px-6 py-10 space-y-8">
        <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/70 via-slate-900/50 to-slate-900/30 backdrop-blur-lg shadow-[0_18px_60px_rgba(0,0,0,0.45)] p-6 md:p-8 flex flex-col gap-4">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <p class="text-xs uppercase tracking-[0.2em] text-primary/80 mb-2"><?php echo esc_html__( 'Shop', 'sorena' ); ?></p>
                    <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
                        <?php echo esc_html__( 'Explore Products', 'sorena' ); ?>
                    </h1>
                    <p class="text-sm text-white/70 max-w-3xl">
                        <?php echo esc_html__( 'Curated digital products with refined UI engineering. Filter by category, stack, difficulty, and price to find the perfect match.', 'sorena' ); ?>
                    </p>
                </div>
                <div class="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    <div class="flex flex-col text-right">
                        <span class="text-xs text-white/60"><?php echo esc_html__( 'Total items', 'sorena' ); ?></span>
                        <span class="text-2xl font-bold text-white leading-tight"><?php echo esc_html( $total_products ); ?></span>
                    </div>
                    <div class="h-12 w-px bg-white/10"></div>
                    <div class="flex items-center gap-2 text-sm text-white/80">
                        <?php echo sorena_icon( 'sparkles', 'w-4 h-4 text-primary' ); ?>
                        <span><?php echo esc_html__( 'Updated live', 'sorena' ); ?></span>
                    </div>
                </div>
            </div>

            <?php if ( $active_filters ) : ?>
                <div class="flex flex-wrap gap-2">
                    <?php foreach ( $active_filters as $filter ) : ?>
                        <a href="<?php echo esc_url( $filter['url'] ); ?>" class="inline-flex items-center gap-2 rounded-full bg-primary/15 border border-primary/30 text-primary px-3 py-1 text-xs">
                            <span class="font-medium"><?php echo esc_html( $filter['label'] ); ?></span>
                            <?php echo sorena_icon( 'x', 'w-3 h-3' ); ?>
                        </a>
                    <?php endforeach; ?>
                    <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="inline-flex items-center gap-2 rounded-full border border-white/10 text-white/70 hover:text-white px-3 py-1 text-xs transition-colors">
                        <?php echo sorena_icon( 'rotate-ccw', 'w-3 h-3' ); ?>
                        <span><?php echo esc_html__( 'Reset filters', 'sorena' ); ?></span>
                    </a>
                </div>
            <?php endif; ?>
        </div>

        <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            <aside class="lg:col-span-3 mb-8 lg:mb-0">
                <?php get_template_part( 'template-parts/components/product-filters' ); ?>
            </aside>

            <div class="lg:col-span-9 min-w-0 space-y-6">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="text-sm text-white/70">
                        <?php echo esc_html__( 'Showing', 'sorena' ); ?>
                        <span class="font-semibold text-white"><?php echo esc_html( $total_products ); ?></span>
                        <?php echo esc_html__( 'products', 'sorena' ); ?>
                    </div>
                    <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                        <?php echo sorena_icon( 'grid', 'w-4 h-4 text-primary' ); ?>
                        <span><?php echo esc_html__( 'Grid layout', 'sorena' ); ?></span>
                    </div>
                </div>

                <?php if ( have_posts() ) : ?>
                    <div class="grid gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        <?php
                        while ( have_posts() ) :
                            the_post();
                            $product = wc_get_product( get_the_ID() );
                            $GLOBALS['sorena_product'] = $product;
                            get_template_part( 'template-parts/components/product-card' );
                        endwhile;
                        ?>
                    </div>

                    <div class="mt-10">
                        <?php woocommerce_pagination(); ?>
                    </div>
                <?php else : ?>
                    <div class="glass-surface rounded-3xl border border-white/10 p-10 text-center space-y-4">
                        <div class="mx-auto w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <?php echo sorena_icon( 'search', 'w-8 h-8 text-white/70' ); ?>
                        </div>
                        <h2 class="text-xl font-semibold text-white"><?php echo esc_html__( 'No products found', 'sorena' ); ?></h2>
                        <p class="text-white/65 max-w-2xl mx-auto"><?php echo esc_html__( 'Try adjusting your filters or browse the full catalog to discover our latest releases.', 'sorena' ); ?></p>
                        <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-white text-sm hover:bg-primary/90 transition-colors">
                            <?php echo sorena_icon( 'rotate-ccw', 'w-4 h-4' ); ?>
                            <span><?php echo esc_html__( 'Back to shop', 'sorena' ); ?></span>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>
<?php
get_footer();
