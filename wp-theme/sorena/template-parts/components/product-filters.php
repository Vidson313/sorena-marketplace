<?php
/**
 * Product filters component.
 */
$categories   = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
$technologies = get_terms( array( 'taxonomy' => 'product_tech', 'hide_empty' => false ) );
$difficulties = array(
    'beginner'     => 'U.U,O_U.OO¦UO',
    'intermediate' => 'U.O¦U^O3Oú',
    'advanced'     => 'O-OñU?UØƒ?OOUO',
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
<div class="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_16px_60px_rgba(0,0,0,0.45)] p-5 lg:p-6 sticky top-24 space-y-6">
    <div class="flex items-start justify-between gap-3">
        <div>
            <p class="text-xs text-primary/80 uppercase tracking-[0.15em] mb-1"><?php echo esc_html__( 'Filters', 'sorena' ); ?></p>
            <h3 class="font-semibold text-white"><?php echo esc_html__( 'Refine results', 'sorena' ); ?></h3>
        </div>
        <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="text-xs text-white/60 hover:text-white transition-colors">
            <?php echo esc_html__( 'Reset', 'sorena' ); ?>
        </a>
    </div>

    <form method="get" action="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="space-y-6">
        <input type="hidden" name="post_type" value="product" />

        <div class="relative">
            <span class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50">
                <?php echo sorena_icon( 'search' ); ?>
            </span>
            <input
                type="text"
                name="s"
                placeholder="<?php echo esc_attr__( 'Search products...', 'sorena' ); ?>"
                value="<?php echo esc_attr( $current['search'] ); ?>"
                class="w-full h-11 pr-10 pl-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
        </div>

        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <h4 class="text-sm font-medium text-white"><?php echo esc_html__( 'Categories', 'sorena' ); ?></h4>
                <span class="text-xs text-white/50"><?php echo esc_html( count( $categories ) ); ?></span>
            </div>
            <div class="flex flex-wrap gap-2">
                <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs cursor-pointer transition-colors <?php echo '' === $current['category'] ? 'ring-1 ring-primary/50 text-white' : 'hover:border-primary/40 hover:text-primary'; ?>">
                    <input type="radio" name="category" value="" <?php checked( $current['category'], '' ); ?> class="hidden" />
                    <?php echo esc_html__( 'All', 'sorena' ); ?>
                </label>
                <?php foreach ( $categories as $category ) : ?>
                    <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs cursor-pointer transition-colors <?php echo $current['category'] === $category->slug ? 'ring-1 ring-primary/50 text-white' : 'hover:border-primary/40 hover:text-primary'; ?>">
                        <input type="radio" name="category" value="<?php echo esc_attr( $category->slug ); ?>" <?php checked( $current['category'], $category->slug ); ?> class="hidden" />
                        <?php echo esc_html( $category->name ); ?>
                    </label>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <h4 class="text-sm font-medium text-white"><?php echo esc_html__( 'Tech stack', 'sorena' ); ?></h4>
                <span class="text-xs text-white/50"><?php echo esc_html( count( $technologies ) ); ?></span>
            </div>
            <div class="flex flex-wrap gap-2">
                <?php foreach ( $technologies as $tech ) : ?>
                    <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs cursor-pointer transition-colors <?php echo $current['technology'] === $tech->slug ? 'ring-1 ring-primary/50 text-white' : 'hover:border-primary/40 hover:text-primary'; ?>">
                        <input type="radio" name="technology" value="<?php echo esc_attr( $tech->slug ); ?>" class="hidden" <?php checked( $current['technology'], $tech->slug ); ?> />
                        <?php echo esc_html( $tech->name ); ?>
                    </label>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="space-y-3">
            <h4 class="text-sm font-medium text-white"><?php echo esc_html__( 'Difficulty', 'sorena' ); ?></h4>
            <div class="grid grid-cols-1 gap-2">
                <?php foreach ( $difficulties as $slug => $label ) : ?>
                    <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 cursor-pointer transition-colors <?php echo $current['difficulty'] === $slug ? 'ring-1 ring-primary/50' : 'hover:border-primary/40'; ?>">
                        <input type="radio" name="difficulty" value="<?php echo esc_attr( $slug ); ?>" <?php checked( $current['difficulty'], $slug ); ?> class="w-4 h-4 text-primary border-white/30 focus:ring-primary" />
                        <span class="text-sm text-white/80"><?php echo esc_html( $label ); ?></span>
                    </label>
                <?php endforeach; ?>
            </div>
        </div>

        <div class="space-y-3">
            <h4 class="text-sm font-medium text-white"><?php echo esc_html__( 'Price range', 'sorena' ); ?></h4>
            <div class="flex gap-2">
                <input
                    type="number"
                    name="minPrice"
                    placeholder="<?php echo esc_attr__( 'Min', 'sorena' ); ?>"
                    value="<?php echo esc_attr( $current['minPrice'] ); ?>"
                    class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="<?php echo esc_attr__( 'Max', 'sorena' ); ?>"
                    value="<?php echo esc_attr( $current['maxPrice'] ); ?>"
                    class="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
            </div>
            <button type="submit" class="w-full h-11 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors">
                <?php echo esc_html__( 'Apply filters', 'sorena' ); ?>
            </button>
        </div>
    </form>
</div>
