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
<div class="glass-surface rounded-2xl overflow-hidden card-hover-enhanced group">
    <div class="relative aspect-video overflow-hidden">
        <?php if ( $product->get_image_id() ) : ?>
            <?php echo wp_get_attachment_image( $product->get_image_id(), 'large', false, array( 'class' => 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' ) ); ?>
        <?php else : ?>
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" alt="<?php echo esc_attr( $product->get_name() ); ?>" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <?php endif; ?>

        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="absolute bottom-3 left-3 right-3 flex gap-2">
                <a href="<?php echo esc_url( get_permalink( $product_id ) ); ?>" class="inline-flex items-center justify-center flex-1 rounded-full text-xs bg-secondary text-foreground py-2 sorena-btn-secondary">
                    <?php echo sorena_icon( 'eye', 'w-3 h-3 ml-1' ); ?>
                    <?php echo esc_html__( 'مشاهده', 'sorena' ); ?>
                </a>
                <a href="<?php echo esc_url( get_permalink( $product_id ) ); ?>" class="inline-flex items-center justify-center rounded-full bg-secondary text-foreground w-9 h-9">
                    <?php echo sorena_icon( 'code2', 'w-3 h-3' ); ?>
                </a>
            </div>
        </div>

        <div class="absolute top-3 right-3 flex flex-col gap-2">
            <?php if ( $product->is_on_sale() ) : ?>
                <span class="badge-discount"><?php echo esc_html__( 'تخفیف', 'sorena' ); ?></span>
            <?php endif; ?>
            <?php if ( $is_featured ) : ?>
                <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary text-white"><?php echo esc_html__( 'ویژه', 'sorena' ); ?></span>
            <?php endif; ?>
        </div>

        <button
            class="favorite-toggle absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors <?php echo $is_fav ? 'bg-red-500/80' : 'bg-white/20'; ?>"
            data-product-id="<?php echo esc_attr( $product_id ); ?>"
            data-is-favorite="<?php echo esc_attr( $is_fav ? '1' : '0' ); ?>"
            aria-label="<?php echo esc_attr__( 'علاقه‌مندی', 'sorena' ); ?>"
        >
            <?php echo sorena_icon( 'heart', 'w-4 h-4 text-white' ); ?>
        </button>
    </div>

    <div class="p-4">
        <a href="<?php echo esc_url( get_permalink( $product_id ) ); ?>">
            <h3 class="font-semibold text-base mb-1 hover:text-primary transition-colors line-clamp-1">
                <?php echo esc_html( $product->get_name() ); ?>
            </h3>
        </a>
        <p class="text-sm text-muted-foreground line-clamp-1 mb-3">
            <?php echo esc_html( wp_strip_all_tags( $product->get_short_description() ) ); ?>
        </p>

        <div class="flex flex-wrap gap-1.5 mb-3">
            <?php foreach ( array_slice( $tech_terms, 0, 3 ) as $term ) : ?>
                <span class="badge-tech"><?php echo esc_html( $term->name ); ?></span>
            <?php endforeach; ?>
            <?php if ( count( $tech_terms ) > 3 ) : ?>
                <span class="badge-tech">+<?php echo esc_html( count( $tech_terms ) - 3 ); ?></span>
            <?php endif; ?>
        </div>

        <div class="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span class="badge-difficulty-<?php echo esc_attr( $difficulty ); ?>">
                <?php echo esc_html( sorena_get_difficulty_label( $difficulty ) ); ?>
            </span>
            <div class="flex items-center gap-1">
                <?php echo sorena_icon( 'star', 'w-3 h-3 text-yellow-500' ); ?>
                <span><?php echo esc_html( $rating ); ?></span>
                <span class="text-muted-foreground">(<?php echo esc_html( $rating_cnt ); ?>)</span>
            </div>
        </div>

        <div class="flex items-center justify-between">
            <div class="text-right">
                <?php if ( $product->is_on_sale() ) : ?>
                    <span class="text-xs text-muted-foreground line-through block">
                        <?php echo wp_kses_post( wc_price( $product->get_regular_price() ) ); ?>
                    </span>
                <?php endif; ?>
                <span class="text-lg font-bold text-primary">
                    <?php echo wp_kses_post( $price_html ); ?>
                </span>
            </div>
            <a href="<?php echo esc_url( $product->add_to_cart_url() ); ?>" class="inline-flex items-center rounded-full px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm sorena-cta">
                <?php echo sorena_icon( 'shopping-cart', 'w-4 h-4 ml-1' ); ?>
                <?php echo esc_html__( 'افزودن', 'sorena' ); ?>
            </a>
        </div>
    </div>
</div>
