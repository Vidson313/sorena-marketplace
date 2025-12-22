<?php
/**
 * Theme setup.
 */

function sorena_setup() {
    load_theme_textdomain( 'sorena', get_template_directory() . '/languages' );

    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
    add_theme_support( 'custom-logo', array( 'height' => 40, 'width' => 40, 'flex-width' => true, 'flex-height' => true ) );
    add_theme_support( 'woocommerce' );
    add_theme_support( 'align-wide' );

    register_nav_menus(
        array(
            'primary'        => __( 'Primary Menu', 'sorena' ),
            'footer'         => __( 'Footer Menu', 'sorena' ),
            'footer_support' => __( 'Footer Support Menu', 'sorena' ),
            'footer_company' => __( 'Footer Company Menu', 'sorena' ),
        )
    );
}
add_action( 'after_setup_theme', 'sorena_setup' );
