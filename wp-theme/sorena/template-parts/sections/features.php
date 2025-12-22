<?php
$features = get_posts( array( 'post_type' => 'sorena_feature', 'posts_per_page' => 6 ) );
?>
<section class="py-16">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-2xl md:text-3xl font-bold mb-3"><?php echo esc_html__( 'چرا سورنا؟', 'sorena' ); ?></h2>
            <p class="text-muted-foreground max-w-2xl mx-auto">
                <?php echo esc_html__( 'هر پروژه با استانداردهای تولید، مستندات کامل و کیفیت کد بالا ارائه می‌شود تا توسعه سریع‌تر و مطمئن‌تر باشد.', 'sorena' ); ?>
            </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ( $features as $feature ) : ?>
                <?php $icon = get_post_meta( $feature->ID, '_sorena_icon', true ); ?>
                <div class="glass-surface-strong rounded-2xl p-6 card-hover">
                    <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <?php echo sorena_icon( $icon ?: 'sparkles', 'w-6 h-6 text-primary' ); ?>
                    </div>
                    <h3 class="font-semibold text-lg mb-2"><?php echo esc_html( $feature->post_title ); ?></h3>
                    <p class="text-sm text-muted-foreground"><?php echo esc_html( wp_strip_all_tags( $feature->post_content ) ); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
