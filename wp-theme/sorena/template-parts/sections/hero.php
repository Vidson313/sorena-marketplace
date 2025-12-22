<?php
$badge           = sorena_get_option( 'hero_badge' );
$title_one       = sorena_get_option( 'hero_title_primary' );
$title_two       = sorena_get_option( 'hero_title_secondary' );
$description     = sorena_get_option( 'hero_description' );
$primary_url     = sorena_get_option( 'hero_primary_url' );
$primary_label   = sorena_get_option( 'hero_primary_label' );
$secondary_url   = sorena_get_option( 'hero_secondary_url' );
$secondary_label = sorena_get_option( 'hero_secondary_label' );
$hero_image_id   = (int) sorena_get_option( 'hero_media_image' );
$hero_video_id   = (int) sorena_get_option( 'hero_media_video' );

$featured_product = null;
if ( function_exists( 'wc_get_products' ) ) {
    $featured = wc_get_products( array( 'limit' => 1, 'featured' => true ) );
    $featured_product = $featured ? $featured[0] : null;
}
?>
<section class="relative overflow-hidden bg-background">
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

    <div class="relative container mx-auto px-4 py-16 lg:py-24">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="text-right">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <?php echo sorena_icon( 'sparkles', 'w-4 h-4 text-primary' ); ?>
                    <span class="text-sm font-medium text-primary"><?php echo esc_html( $badge ); ?></span>
                </div>

                <h1 class="text-4xl sm:text-5xl lg:text-display font-bold mb-6 leading-tight">
                    <span class="gradient-text"><?php echo esc_html( $title_one ); ?></span>
                    <br />
                    <span class="text-foreground"><?php echo esc_html( $title_two ); ?></span>
                </h1>

                <p class="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                    <?php echo esc_html( $description ); ?>
                </p>

                <div class="flex flex-wrap gap-4 mb-10">
                    <a href="<?php echo esc_url( $primary_url ); ?>" class="inline-flex items-center rounded-full px-8 py-3 bg-primary hover:bg-primary/90 text-white gap-2">
                        <?php echo esc_html( $primary_label ); ?>
                        <?php echo sorena_icon( 'arrow-left', 'w-4 h-4' ); ?>
                    </a>
                    <a href="<?php echo esc_url( $secondary_url ); ?>" class="inline-flex items-center rounded-full px-8 py-3 border border-border text-foreground gap-2">
                        <?php echo sorena_icon( 'code2', 'w-4 h-4' ); ?>
                        <?php echo esc_html( $secondary_label ); ?>
                    </a>
                </div>

                <div class="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <div class="flex items-center gap-2">
                        <?php echo sorena_icon( 'shield', 'w-4 h-4 text-green-500' ); ?>
                        <span><?php echo esc_html__( 'پرداخت امن', 'sorena' ); ?></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <?php echo sorena_icon( 'download', 'w-4 h-4 text-blue-500' ); ?>
                        <span><?php echo esc_html__( 'دانلود فوری', 'sorena' ); ?></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <?php echo sorena_icon( 'zap', 'w-4 h-4 text-yellow-500' ); ?>
                        <span><?php echo esc_html__( 'سورس کد کامل', 'sorena' ); ?></span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 glass-surface rounded-3xl p-6 card-hover">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <?php echo sorena_icon( 'code2', 'w-5 h-5 text-white' ); ?>
                            </div>
                            <div>
                                <h3 class="font-semibold"><?php echo esc_html__( 'پکیج آماده برای شروع سریع', 'sorena' ); ?></h3>
                                <p class="text-xs text-muted-foreground">Next.js + WordPress</p>
                            </div>
                        </div>
                        <span class="badge-discount"><?php echo esc_html__( '۳۰٪ تخفیف', 'sorena' ); ?></span>
                    </div>
                    <div class="aspect-video rounded-xl bg-gradient-to-br from-muted to-muted/50 mb-4 overflow-hidden">
                        <?php if ( $hero_video_id ) : ?>
                            <video
                                class="w-full h-full object-cover"
                                autoplay
                                loop
                                muted
                                playsinline
                                preload="metadata"
                            >
                                <source src="<?php echo esc_url( wp_get_attachment_url( $hero_video_id ) ); ?>" type="<?php echo esc_attr( get_post_mime_type( $hero_video_id ) ); ?>">
                            </video>
                        <?php elseif ( $hero_image_id ) : ?>
                            <?php echo wp_get_attachment_image( $hero_image_id, 'large', false, array( 'class' => 'w-full h-full object-cover' ) ); ?>
                        <?php elseif ( $featured_product && $featured_product->get_image_id() ) : ?>
                            <?php echo wp_get_attachment_image( $featured_product->get_image_id(), 'large', false, array( 'class' => 'w-full h-full object-cover' ) ); ?>
                        <?php else : ?>
                            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" alt="Preview" class="w-full h-full object-cover" />
                        <?php endif; ?>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <?php echo sorena_icon( 'star', 'w-4 h-4 text-yellow-500' ); ?>
                            <span class="text-sm font-medium"><?php echo esc_html__( '۴.۹', 'sorena' ); ?></span>
                            <span class="text-xs text-muted-foreground"><?php echo esc_html__( '(۱۲۰ نظر)', 'sorena' ); ?></span>
                        </div>
                        <div class="text-left">
                            <span class="text-xs text-muted-foreground line-through"><?php echo esc_html__( '۵,۹۰۰,۰۰۰', 'sorena' ); ?></span>
                            <span class="text-lg font-bold text-primary mr-2"><?php echo esc_html__( '۳,۹۰۰,۰۰۰ تومان', 'sorena' ); ?></span>
                        </div>
                    </div>
                </div>

                <div class="glass-surface rounded-2xl p-5 card-hover">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <?php echo sorena_icon( 'users', 'w-5 h-5 text-green-500' ); ?>
                        </div>
                        <span class="text-sm text-muted-foreground"><?php echo esc_html__( 'مشتریان فعال', 'sorena' ); ?></span>
                    </div>
                    <p class="text-3xl font-bold"><?php echo esc_html__( '۲,۴۰۰+', 'sorena' ); ?></p>
                </div>

                <div class="glass-surface rounded-2xl p-5 card-hover">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <?php echo sorena_icon( 'download', 'w-5 h-5 text-blue-500' ); ?>
                        </div>
                        <span class="text-sm text-muted-foreground"><?php echo esc_html__( 'دانلود ماهانه', 'sorena' ); ?></span>
                    </div>
                    <p class="text-3xl font-bold"><?php echo esc_html__( '۱۸,۰۰۰+', 'sorena' ); ?></p>
                </div>

                <div class="col-span-2 glass-surface rounded-2xl p-4 card-hover border-primary/30">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse-glow">
                            <?php echo sorena_icon( 'sparkles', 'w-6 h-6 text-primary' ); ?>
                        </div>
                        <div>
                            <h4 class="font-semibold text-sm"><?php echo esc_html__( 'پیشنهاد ویژه این هفته', 'sorena' ); ?></h4>
                            <p class="text-xs text-muted-foreground"><?php echo esc_html__( 'پروژه‌های منتخب با تخفیف‌های محدود', 'sorena' ); ?></p>
                        </div>
                        <a href="<?php echo esc_url( $primary_url ); ?>" class="mr-auto text-primary text-sm inline-flex items-center gap-1">
                            <?php echo esc_html__( 'مشاهده پیشنهادها', 'sorena' ); ?>
                            <?php echo sorena_icon( 'arrow-left', 'w-3 h-3' ); ?>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
