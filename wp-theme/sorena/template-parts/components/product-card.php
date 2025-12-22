<?php
/**
 * Product card component.
 */
$product = isset( $GLOBALS['sorena_product'] ) ? $GLOBALS['sorena_product'] : null;
if ( ! $product ) {
    return;
}

$product_id  = $product->get_id();
$price_html  = $product->get_price_html();
$rating      = $product->get_average_rating();
$rating_cnt  = $product->get_rating_count();
$difficulty  = sorena_get_product_meta( $product_id, '_sorena_difficulty', 'beginner' );
$tech_terms  = wp_get_post_terms( $product_id, 'product_tech' );
$is_featured = $product->is_featured();
$user_id     = get_current_user_id();
$favorites   = $user_id ? (array) get_user_meta( $user_id, '_sorena_favorites', true ) : array();
$is_fav      = in_array( $product_id, $favorites, true );
?>
<div class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 via-slate-900/60 to-slate-950/70 backdrop-blur-lg shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
    <div class="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/15 to-transparent pointer-events-none"></div>
    <div class="relative aspect-video overflow-hidden">
        <?php if ( $product->get_image_id() ) : ?>
            <?php echo wp_get_attachment_image( $product->get_image_id(), 'large', false, array( 'class' => 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' ) ); ?>
        <?php else : ?>
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" alt="<?php echo esc_attr( $product->get_name() ); ?>" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <?php endif; ?>

        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

        <div class="absolute top-3 right-3 flex flex-col gap-2 text-xs">
            <?php if ( $product->is_on_sale() ) : ?>
                <span class="inline-flex items-center px-2 py-1 rounded-full bg-rose-500/80 text-white font-semibold"><?php echo esc_html__( 'Sale', 'sorena' ); ?></span>
            <?php endif; ?>
            <?php if ( $is_featured ) : ?>
                <span class="inline-flex items-center px-2 py-1 rounded-full bg-primary text-white font-semibold"><?php echo esc_html__( 'Featured', 'sorena' ); ?></span>
            <?php endif; ?>
        </div>

        <button
            class="favorite-toggle absolute top-3 left-3 w-9 h-9 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/30 transition-colors <?php echo $is_fav ? 'bg-rose-500/80' : 'bg-white/15'; ?>"
            data-product-id="<?php echo esc_attr( $product_id ); ?>"
            data-is-favorite="<?php echo esc_attr( $is_fav ? '1' : '0' ); ?>"
            aria-label="<?php echo esc_attr__( 'Toggle favorite', 'sorena' ); ?>"
        >
            <?php echo sorena_icon( 'heart', 'w-4 h-4 text-white' ); ?>
        </button>
    </div>

    <div class="relative p-5 space-y-4">
        <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
                <a href="<?php echo esc_url( get_permalink( $product_id ) ); ?>">
                    <h3 class="text-base font-semibold text-white hover:text-primary transition-colors line-clamp-1">
                        <?php echo esc_html( $product->get_name() ); ?>
                    </h3>
                </a>
                <p class="text-sm text-white/60 line-clamp-2 mt-1">
                    <?php echo esc_html( wp_strip_all_tags( $product->get_short_description() ) ); ?>
                </p>
            </div>
            <div class="flex flex-col items-end">
                <span class="text-xs text-white/60 mb-1"><?php echo esc_html__( 'From', 'sorena' ); ?></span>
                <span class="text-lg font-bold text-primary leading-tight">
                    <?php echo wp_kses_post( $price_html ); ?>
                </span>
            </div>
        </div>

        <div class="flex flex-wrap gap-1.5">
            <?php foreach ( array_slice( $tech_terms, 0, 3 ) as $term ) : ?>
                <span class="badge-tech"><?php echo esc_html( $term->name ); ?></span>
            <?php endforeach; ?>
            <?php if ( count( $tech_terms ) > 3 ) : ?>
                <span class="badge-tech">+<?php echo esc_html( count( $tech_terms ) - 3 ); ?></span>
            <?php endif; ?>
        </div>

        <div class="flex items-center justify-between text-xs text-white/70">
            <span class="badge-difficulty-<?php echo esc_attr( $difficulty ); ?>">
                <?php echo esc_html( sorena_get_difficulty_label( $difficulty ) ); ?>
            </span>
            <div class="flex items-center gap-1">
                <?php echo sorena_icon( 'star', 'w-3 h-3 text-yellow-400' ); ?>
                <span class="font-semibold text-white"><?php echo esc_html( $rating ); ?></span>
                <span class="text-white/50">(<?php echo esc_html( $rating_cnt ); ?>)</span>
            </div>
        </div>

        <div class="flex items-center justify-between pt-2">
            <a href="<?php echo esc_url( get_permalink( $product_id ) ); ?>" class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:border-primary/50 hover:text-primary transition-colors">
                <?php echo sorena_icon( 'eye', 'w-4 h-4' ); ?>
                <span><?php echo esc_html__( 'View details', 'sorena' ); ?></span>
            </a>
            <a href="<?php echo esc_url( $product->add_to_cart_url() ); ?>" class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 transition-colors sorena-cta">
                <?php echo sorena_icon( 'shopping-cart', 'w-4 h-4' ); ?>
                <span><?php echo esc_html__( 'Add to cart', 'sorena' ); ?></span>
            </a>
        </div>
    </div>
</div>
