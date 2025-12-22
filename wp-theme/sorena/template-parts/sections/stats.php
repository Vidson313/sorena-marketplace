<?php
$stats = get_posts( array( 'post_type' => 'sorena_stat', 'posts_per_page' => 4 ) );
?>
<section class="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
    <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
            <?php foreach ( $stats as $stat ) : ?>
                <?php
                $value = get_post_meta( $stat->ID, '_sorena_value', true );
                $icon  = get_post_meta( $stat->ID, '_sorena_icon', true );
                ?>
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <?php echo sorena_icon( $icon ?: 'users', 'w-8 h-8 text-primary' ); ?>
                    </div>
                    <div class="text-3xl font-bold mb-1"><?php echo esc_html( $value ); ?></div>
                    <div class="text-muted-foreground"><?php echo esc_html( $stat->post_title ); ?></div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
