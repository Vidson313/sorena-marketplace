<?php
get_header();
?>
<main class="container mx-auto px-4 py-12">
    <?php while ( have_posts() ) : the_post(); ?>
        <article <?php post_class( 'glass-surface rounded-2xl p-6' ); ?>>
            <h1 class="text-3xl font-bold mb-6"><?php the_title(); ?></h1>
            <div class="prose max-w-none">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; ?>
</main>
<?php
get_footer();
