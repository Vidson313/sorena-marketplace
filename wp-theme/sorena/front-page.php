<?php
get_header();
?>
<main class="min-h-screen bg-background">
    <?php get_template_part( 'template-parts/sections/hero' ); ?>
    <?php get_template_part( 'template-parts/sections/product-search' ); ?>
    <?php get_template_part( 'template-parts/sections/categories' ); ?>
    <?php get_template_part( 'template-parts/sections/featured-products' ); ?>
    <?php get_template_part( 'template-parts/sections/stats' ); ?>
    <?php get_template_part( 'template-parts/sections/features' ); ?>
    <?php get_template_part( 'template-parts/sections/testimonials' ); ?>
    <?php get_template_part( 'template-parts/sections/cta' ); ?>
</main>
<?php
get_footer();
