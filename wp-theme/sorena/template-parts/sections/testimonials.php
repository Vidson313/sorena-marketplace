<?php
$testimonials = get_posts( array( 'post_type' => 'sorena_testimonial', 'posts_per_page' => 3 ) );
?>
<section class="py-16 bg-muted/30">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-2xl md:text-3xl font-bold mb-3"><?php echo esc_html__( 'نظر مشتریان', 'sorena' ); ?></h2>
            <p class="text-muted-foreground"><?php echo esc_html__( 'آنچه توسعه‌دهندگان درباره سورنا می‌گویند', 'sorena' ); ?></p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
            <?php foreach ( $testimonials as $testimonial ) : ?>
                <?php
                $role   = get_post_meta( $testimonial->ID, '_sorena_role', true );
                $rating = (int) get_post_meta( $testimonial->ID, '_sorena_rating', true );
                ?>
                <div class="glass-surface-strong rounded-2xl p-6">
                    <div class="flex items-center gap-1 mb-4">
                        <?php for ( $i = 1; $i <= 5; $i++ ) : ?>
                            <span class="w-4 h-4 <?php echo $i <= $rating ? 'text-yellow-500' : 'text-muted'; ?>">
                                <?php echo sorena_icon( 'star' ); ?>
                            </span>
                        <?php endfor; ?>
                    </div>
                    <p class="text-muted-foreground mb-4 leading-relaxed">"<?php echo esc_html( wp_strip_all_tags( $testimonial->post_content ) ); ?>"</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span class="text-primary font-semibold"><?php echo esc_html( mb_substr( $testimonial->post_title, 0, 1 ) ); ?></span>
                        </div>
                        <div>
                            <p class="font-medium text-sm"><?php echo esc_html( $testimonial->post_title ); ?></p>
                            <p class="text-xs text-muted-foreground"><?php echo esc_html( $role ); ?></p>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
