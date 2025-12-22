<?php
$categories = get_terms( array(
    'taxonomy'   => 'product_cat',
    'hide_empty' => false,
    'number'     => 4,
) );
$icons = array( 'code2', 'zap', 'award', 'trending-up' );
?>
<section class="py-16 bg-muted/30">
    <div class="container mx-auto px-4">
        <div class="text-center mb-10">
            <h2 class="text-2xl md:text-3xl font-bold mb-3"><?php echo esc_html__( 'دسته‌بندی‌ها', 'sorena' ); ?></h2>
            <p class="text-muted-foreground"><?php echo esc_html__( 'با انتخاب دسته‌بندی مناسب، سریع‌تر محصول مورد نظر خود را پیدا کنید.', 'sorena' ); ?></p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <?php foreach ( $categories as $index => $category ) : ?>
                <a href="<?php echo esc_url( get_term_link( $category ) ); ?>" class="glass-surface rounded-2xl p-6 card-hover text-center group">
                    <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <?php echo sorena_icon( $icons[ $index % count( $icons ) ], 'w-7 h-7 text-primary' ); ?>
                    </div>
                    <h3 class="font-semibold mb-1"><?php echo esc_html( $category->name ); ?></h3>
                    <p class="text-sm text-muted-foreground"><?php echo esc_html( $category->count ); ?> <?php echo esc_html__( 'محصول', 'sorena' ); ?></p>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>
