<?php
?>
<section class="py-20">
    <div class="container mx-auto px-4">
        <div class="glass-surface rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
            <div class="relative">
                <h2 class="text-2xl md:text-3xl font-bold mb-4"><?php echo esc_html( sorena_get_option( 'cta_title' ) ); ?></h2>
                <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
                    <?php echo esc_html( sorena_get_option( 'cta_description' ) ); ?>
                </p>
                <div class="flex flex-wrap gap-4 justify-center">
                    <a href="<?php echo esc_url( sorena_get_option( 'cta_primary_url' ) ); ?>" class="inline-flex items-center rounded-full px-8 py-3 bg-primary hover:bg-primary/90 text-white gap-2">
                        <?php echo esc_html( sorena_get_option( 'cta_primary_label' ) ); ?>
                        <?php echo sorena_icon( 'arrow-left', 'w-4 h-4' ); ?>
                    </a>
                    <a href="<?php echo esc_url( sorena_get_option( 'cta_secondary_url' ) ); ?>" class="inline-flex items-center rounded-full px-8 py-3 border border-border">
                        <?php echo esc_html( sorena_get_option( 'cta_secondary_label' ) ); ?>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
