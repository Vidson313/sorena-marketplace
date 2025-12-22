<?php
/**
 * Product filters component.
 */
$categories = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
$technologies = get_terms( array( 'taxonomy' => 'product_tech', 'hide_empty' => false ) );
$difficulties = array(
    'beginner'     => 'مقدماتی',
    'intermediate' => 'متوسط',
    'advanced'     => 'حرفه‌ای',
);

$current = array(
    'category'   => isset( $_GET['category'] ) ? sanitize_text_field( wp_unslash( $_GET['category'] ) ) : '',
    'technology' => isset( $_GET['technology'] ) ? sanitize_text_field( wp_unslash( $_GET['technology'] ) ) : '',
    'difficulty' => isset( $_GET['difficulty'] ) ? sanitize_text_field( wp_unslash( $_GET['difficulty'] ) ) : '',
    'minPrice'   => isset( $_GET['minPrice'] ) ? sanitize_text_field( wp_unslash( $_GET['minPrice'] ) ) : '',
    'maxPrice'   => isset( $_GET['maxPrice'] ) ? sanitize_text_field( wp_unslash( $_GET['maxPrice'] ) ) : '',
    'search'     => isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '',
);
?>
<div class="glass-surface rounded-2xl p-5 sticky top-24">
    <div class="flex items-center justify-between mb-5">
        <h3 class="font-semibold"><?php echo esc_html__( 'فیلترها', 'sorena' ); ?></h3>
        <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="text-xs text-muted-foreground"><?php echo esc_html__( 'حذف فیلترها', 'sorena' ); ?></a>
    </div>

    <form method="get" action="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>">
        <input type="hidden" name="post_type" value="product" />
        <div class="relative mb-7">
            <span class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                <?php echo sorena_icon( 'search' ); ?>
            </span>
            <input
                type="text"
                name="s"
                placeholder="<?php echo esc_attr__( 'جستجو...', 'sorena' ); ?>"
                value="<?php echo esc_attr( $current['search'] ); ?>"
                class="w-full h-10 pr-10 pl-4 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
        </div>

        <div class="mb-7">
            <h4 class="text-sm font-medium mb-3"><?php echo esc_html__( 'دسته‌بندی', 'sorena' ); ?></h4>
            <div class="space-y-3">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" value="" <?php checked( $current['category'], '' ); ?> class="w-4 h-4 text-primary border-border focus:ring-primary" />
                    <span class="text-sm"><?php echo esc_html__( 'همه', 'sorena' ); ?></span>
                </label>
                <?php foreach ( $categories as $category ) : ?>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="category" value="<?php echo esc_attr( $category->slug ); ?>" <?php checked( $current['category'], $category->slug ); ?> class="w-4 h-4 text-primary border-border focus:ring-primary" />
                        <span class="text-sm"><?php echo esc_html( $category->name ); ?></span>
                    </label>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="mb-7">
            <h4 class="text-sm font-medium mb-3"><?php echo esc_html__( 'تکنولوژی', 'sorena' ); ?></h4>
            <div class="flex flex-wrap gap-2">
                <?php foreach ( $technologies as $tech ) : ?>
                    <label class="px-3 py-1.5 text-xs rounded-full border transition-colors <?php echo $current['technology'] === $tech->slug ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary hover:text-primary'; ?>">
                        <input type="radio" name="technology" value="<?php echo esc_attr( $tech->slug ); ?>" class="hidden" <?php checked( $current['technology'], $tech->slug ); ?> />
                        <?php echo esc_html( $tech->name ); ?>
                    </label>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="mb-7">
            <h4 class="text-sm font-medium mb-3"><?php echo esc_html__( 'سطح دشواری', 'sorena' ); ?></h4>
            <div class="space-y-3">
                <?php foreach ( $difficulties as $slug => $label ) : ?>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="difficulty" value="<?php echo esc_attr( $slug ); ?>" <?php checked( $current['difficulty'], $slug ); ?> class="w-4 h-4 text-primary border-border focus:ring-primary" />
                        <span class="text-sm"><?php echo esc_html( $label ); ?></span>
                    </label>
                <?php endforeach; ?>
            </div>
        </div>

        <div>
            <h4 class="text-sm font-medium mb-3"><?php echo esc_html__( 'بازه قیمت (تومان)', 'sorena' ); ?></h4>
            <div class="flex gap-2 mb-3">
                <input
                    type="number"
                    name="minPrice"
                    placeholder="<?php echo esc_attr__( 'حداقل', 'sorena' ); ?>"
                    value="<?php echo esc_attr( $current['minPrice'] ); ?>"
                    class="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="<?php echo esc_attr__( 'حداکثر', 'sorena' ); ?>"
                    value="<?php echo esc_attr( $current['maxPrice'] ); ?>"
                    class="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>
            <button type="submit" class="w-full h-10 rounded-full bg-primary hover:bg-primary/90 text-white text-xs">
                <?php echo esc_html__( 'اعمال فیلتر', 'sorena' ); ?>
            </button>
        </div>
    </form>
</div>
