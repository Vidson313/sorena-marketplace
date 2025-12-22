<?php
get_header();
?>
<main class="container mx-auto px-4 py-12">
    <header class="mb-8">
        <h1 class="text-3xl font-bold mb-2"><?php printf( esc_html__( 'Search results for: %s', 'sorena' ), get_search_query() ); ?></h1>
    </header>
    <?php if ( have_posts() ) : ?>
        <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <?php while ( have_posts() ) : the_post(); ?>
                <article <?php post_class( 'glass-surface rounded-2xl p-6' ); ?>>
                    <h2 class="text-xl font-semibold mb-2">
                        <a href="<?php the_permalink(); ?>" class="hover:text-primary transition-colors"><?php the_title(); ?></a>
                    </h2>
                    <div class="text-sm text-muted-foreground"><?php the_excerpt(); ?></div>
                </article>
            <?php endwhile; ?>
        </div>
        <div class="mt-8">
            <?php the_posts_pagination(); ?>
        </div>
    <?php else : ?>
        <p class="text-muted-foreground"><?php esc_html_e( 'No results found.', 'sorena' ); ?></p>
    <?php endif; ?>
</main>
<?php
get_footer();
