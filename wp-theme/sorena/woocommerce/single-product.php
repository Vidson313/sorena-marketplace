<?php
/**
 * WooCommerce single product template.
 */
get_header();

$product = wc_get_product( get_the_ID() );
if ( ! $product ) {
    get_footer();
    return;
}

$product_id     = $product->get_id();
$preview_images = sorena_get_product_meta( $product_id, '_sorena_preview_images', '' );
$preview_list   = array_filter( array_map( 'trim', explode( ',', $preview_images ) ) );
$preview_list   = $preview_list ? $preview_list : array();

$difficulty      = sorena_get_product_meta( $product_id, '_sorena_difficulty', 'beginner' );
$version         = sorena_get_product_meta( $product_id, '_sorena_version', '1.0.0' );
$support         = sorena_get_product_meta( $product_id, '_sorena_support_months', 6 );
$demo_url        = sorena_get_product_meta( $product_id, '_sorena_demo_url', '' );
$includes_source = sorena_get_product_meta( $product_id, '_sorena_includes_source', 'no' ) === 'yes';
$includes_docs   = sorena_get_product_meta( $product_id, '_sorena_includes_docs', 'no' ) === 'yes';
$includes_db     = sorena_get_product_meta( $product_id, '_sorena_includes_db', 'no' ) === 'yes';
$includes_video  = sorena_get_product_meta( $product_id, '_sorena_includes_video', 'no' ) === 'yes';
$tech_terms      = wp_get_post_terms( $product_id, 'product_tech' );
$related_ids     = wc_get_related_products( $product_id, 4 );
$related_products= $related_ids ? wc_get_products( array( 'include' => $related_ids ) ) : array();
?>
<main class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
        <nav class="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="hover:text-primary"><?php echo esc_html__( 'خانه', 'sorena' ); ?></a>
            <?php echo sorena_icon( 'chevron-left', 'w-4 h-4' ); ?>
            <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="hover:text-primary"><?php echo esc_html__( 'فروشگاه', 'sorena' ); ?></a>
            <?php echo sorena_icon( 'chevron-left', 'w-4 h-4' ); ?>
            <span class="text-foreground"><?php echo esc_html( $product->get_name() ); ?></span>
        </nav>

        <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <div class="glass-surface rounded-2xl overflow-hidden">
                    <div class="aspect-video">
                        <?php if ( $product->get_image_id() ) : ?>
                            <?php echo wp_get_attachment_image( $product->get_image_id(), 'large', false, array( 'class' => 'w-full h-full object-cover' ) ); ?>
                        <?php endif; ?>
                    </div>
                    <?php if ( $preview_list ) : ?>
                        <div class="p-4 flex gap-3 overflow-x-auto">
                            <?php foreach ( $preview_list as $index => $img_url ) : ?>
                                <button class="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 <?php echo $index === 0 ? 'border-primary' : 'border-transparent'; ?>">
                                    <img src="<?php echo esc_url( $img_url ); ?>" alt="" class="w-full h-full object-cover" />
                                </button>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="glass-surface rounded-2xl p-6 sorena-tabs" data-tabs>
                    <div class="grid grid-cols-4 mb-6 text-sm">
                        <button class="tab-trigger active" data-tab="description"><?php echo esc_html__( 'توضیحات', 'sorena' ); ?></button>
                        <button class="tab-trigger" data-tab="specs"><?php echo esc_html__( 'مشخصات', 'sorena' ); ?></button>
                        <button class="tab-trigger" data-tab="reviews"><?php echo esc_html__( 'نظرات', 'sorena' ); ?> (<?php echo esc_html( $product->get_rating_count() ); ?>)</button>
                        <button class="tab-trigger" data-tab="qa"><?php echo esc_html__( 'پرسش و پاسخ', 'sorena' ); ?></button>
                    </div>

                    <div class="tab-content active" data-tab-content="description">
                        <div class="prose prose-sm max-w-none text-muted-foreground">
                            <?php echo wpautop( wp_kses_post( $product->get_description() ) ); ?>
                        </div>
                    </div>

                    <div class="tab-content" data-tab-content="specs">
                        <div class="grid sm:grid-cols-2 gap-4">
                            <div class="p-4 rounded-xl bg-muted/50">
                                <h4 class="font-medium mb-3"><?php echo esc_html__( 'تکنولوژی‌ها', 'sorena' ); ?></h4>
                                <div class="flex flex-wrap gap-2">
                                    <?php foreach ( $tech_terms as $term ) : ?>
                                        <span class="badge-tech"><?php echo esc_html( $term->name ); ?></span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                            <div class="p-4 rounded-xl bg-muted/50">
                                <h4 class="font-medium mb-3"><?php echo esc_html__( 'اطلاعات محصول', 'sorena' ); ?></h4>
                                <ul class="space-y-2 text-sm">
                                    <li class="flex justify-between"><span class="text-muted-foreground"><?php echo esc_html__( 'نسخه', 'sorena' ); ?></span><span><?php echo esc_html( $version ); ?></span></li>
                                    <li class="flex justify-between"><span class="text-muted-foreground"><?php echo esc_html__( 'آخرین بروزرسانی', 'sorena' ); ?></span><span><?php echo esc_html( get_the_modified_date() ); ?></span></li>
                                    <li class="flex justify-between"><span class="text-muted-foreground"><?php echo esc_html__( 'سطح دشواری', 'sorena' ); ?></span><span><?php echo esc_html( sorena_get_difficulty_label( $difficulty ) ); ?></span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content" data-tab-content="reviews">
                        <?php comments_template(); ?>
                    </div>

                    <div class="tab-content" data-tab-content="qa">
                        <div class="text-center py-8">
                            <p class="text-muted-foreground"><?php echo esc_html__( 'هنوز پرسشی ثبت نشده است.', 'sorena' ); ?></p>
                            <a href="#" class="inline-flex items-center justify-center rounded-full px-6 py-2 bg-primary text-white mt-4"><?php echo esc_html__( 'ثبت پرسش جدید', 'sorena' ); ?></a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="glass-surface rounded-2xl p-6 sticky top-24">
                    <div class="flex items-center justify-between mb-4">
                        <h1 class="text-xl font-bold"><?php echo esc_html( $product->get_name() ); ?></h1>
                        <div class="flex gap-2">
                            <button class="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted/50" aria-label="<?php echo esc_attr__( 'علاقه‌مندی', 'sorena' ); ?>">
                                <?php echo sorena_icon( 'heart', 'w-5 h-5' ); ?>
                            </button>
                            <button class="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted/50" aria-label="<?php echo esc_attr__( 'اشتراک‌گذاری', 'sorena' ); ?>">
                                <?php echo sorena_icon( 'share', 'w-5 h-5' ); ?>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center gap-4 mb-4 text-sm">
                        <div class="flex items-center gap-1">
                            <?php echo sorena_icon( 'star', 'w-4 h-4 text-yellow-500' ); ?>
                            <span class="font-medium"><?php echo esc_html( $product->get_average_rating() ); ?></span>
                            <span class="text-muted-foreground">(<?php echo esc_html( $product->get_rating_count() ); ?>)</span>
                        </div>
                        <span class="text-muted-foreground">|</span>
                        <span class="text-muted-foreground"><?php echo esc_html( $product->get_total_sales() ); ?> <?php echo esc_html__( 'فروش', 'sorena' ); ?></span>
                    </div>

                    <div class="mb-6">
                        <?php if ( $product->is_on_sale() ) : ?>
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-muted-foreground line-through"><?php echo wp_kses_post( wc_price( $product->get_regular_price() ) ); ?></span>
                                <span class="badge-discount"><?php echo esc_html__( 'تخفیف', 'sorena' ); ?></span>
                            </div>
                        <?php endif; ?>
                        <div class="text-3xl font-bold text-primary"><?php echo wp_kses_post( $product->get_price_html() ); ?></div>
                    </div>

                    <div class="space-y-3 mb-6">
                        <a href="<?php echo esc_url( $product->add_to_cart_url() ); ?>" class="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 sorena-cta">
                            <?php echo sorena_icon( 'shopping-cart', 'w-5 h-5' ); ?>
                            <?php echo esc_html__( 'افزودن به سبد خرید', 'sorena' ); ?>
                        </a>
                        <?php if ( $demo_url ) : ?>
                            <a href="<?php echo esc_url( $demo_url ); ?>" class="w-full h-12 rounded-full border border-border flex items-center justify-center gap-2 sorena-btn-secondary">
                                <?php echo sorena_icon( 'eye', 'w-5 h-5' ); ?>
                                <?php echo esc_html__( 'مشاهده دمو', 'sorena' ); ?>
                            </a>
                        <?php endif; ?>
                    </div>

                    <div class="border-t border-border pt-6">
                        <h3 class="font-semibold mb-4"><?php echo esc_html__( 'شامل موارد زیر:', 'sorena' ); ?></h3>
                        <ul class="space-y-3">
                            <?php if ( $includes_source ) : ?>
                                <li class="flex items-center gap-3 text-sm"><span class="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center"><?php echo sorena_icon( 'code2', 'w-4 h-4 text-green-500' ); ?></span><?php echo esc_html__( 'سورس کد کامل', 'sorena' ); ?></li>
                            <?php endif; ?>
                            <?php if ( $includes_docs ) : ?>
                                <li class="flex items-center gap-3 text-sm"><span class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><?php echo sorena_icon( 'download', 'w-4 h-4 text-blue-500' ); ?></span><?php echo esc_html__( 'مستندات کامل', 'sorena' ); ?></li>
                            <?php endif; ?>
                            <?php if ( $includes_db ) : ?>
                                <li class="flex items-center gap-3 text-sm"><span class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><?php echo sorena_icon( 'tag', 'w-4 h-4 text-purple-500' ); ?></span><?php echo esc_html__( 'دیتابیس آماده', 'sorena' ); ?></li>
                            <?php endif; ?>
                            <?php if ( $includes_video ) : ?>
                                <li class="flex items-center gap-3 text-sm"><span class="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center"><?php echo sorena_icon( 'video', 'w-4 h-4 text-red-500' ); ?></span><?php echo esc_html__( 'آموزش ویدیویی', 'sorena' ); ?></li>
                            <?php endif; ?>
                            <li class="flex items-center gap-3 text-sm">
                                <span class="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center"><?php echo sorena_icon( 'clock', 'w-4 h-4 text-yellow-500' ); ?></span>
                                <?php echo esc_html( sprintf( __( 'پشتیبانی %s ماهه', 'sorena' ), $support ) ); ?>
                            </li>
                        </ul>
                    </div>

                    <div class="border-t border-border pt-6 mt-6">
                        <div class="flex items-center gap-2 text-xs text-muted-foreground">
                            <?php echo sorena_icon( 'shield', 'w-4 h-4 text-green-500' ); ?>
                            <span><?php echo esc_html__( 'پرداخت امن با درگاه‌های معتبر', 'sorena' ); ?></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <?php if ( $related_products ) : ?>
            <section class="mt-16">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-bold"><?php echo esc_html__( 'محصولات مرتبط', 'sorena' ); ?></h2>
                    <a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>" class="inline-flex items-center rounded-full border border-border px-4 py-2"><?php echo esc_html__( 'مشاهده همه', 'sorena' ); ?></a>
                </div>
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <?php foreach ( $related_products as $related ) : ?>
                        <?php $GLOBALS['sorena_product'] = $related; ?>
                        <?php get_template_part( 'template-parts/components/product-card' ); ?>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endif; ?>
    </div>
</main>
<?php
get_footer();
