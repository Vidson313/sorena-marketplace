<?php
get_header();
?>
<main class="container mx-auto px-4 py-12">
    <?php if ( have_posts() ) : ?>
        <div class="space-y-8">
            <?php while ( have_posts() ) : the_post(); ?>
                <article <?php post_class( 'glass-surface rounded-2xl p-6' ); ?>>
                    <h2 class="text-2xl font-bold mb-3">
                        <a href="<?php the_permalink(); ?>" class="hover:text-primary transition-colors">
                            <?php the_title(); ?>
                        </a>
                    </h2>
                    <div class="text-muted-foreground leading-relaxed">
                        <?php the_excerpt(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>
        <div class="mt-8">
            <?php the_posts_pagination(); ?>
        </div>
    <?php else : ?>
        <p class="text-muted-foreground"><?php esc_html_e( 'No posts found.', 'sorena' ); ?></p>
    <?php endif; ?>
</main>
<?php
get_footer();
