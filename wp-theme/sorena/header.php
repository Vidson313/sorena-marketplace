<?php
/**
 * Header template.
 */
?><!doctype html>
<html <?php language_attributes(); ?> dir="rtl">
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'bg-background antialiased' ); ?>>
<?php wp_body_open(); ?>
<?php get_template_part( 'template-parts/components/navbar' ); ?>
