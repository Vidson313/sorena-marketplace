<?php
/**
 * Custom post types and taxonomies.
 */

function sorena_register_cpts() {
    register_post_type(
        'sorena_feature',
        array(
            'labels' => array(
                'name'          => __( 'Features', 'sorena' ),
                'singular_name' => __( 'Feature', 'sorena' ),
            ),
            'public'      => true,
            'menu_icon'   => 'dashicons-awards',
            'supports'    => array( 'title', 'editor' ),
            'has_archive' => false,
            'show_in_rest'=> true,
        )
    );

    register_post_type(
        'sorena_testimonial',
        array(
            'labels' => array(
                'name'          => __( 'Testimonials', 'sorena' ),
                'singular_name' => __( 'Testimonial', 'sorena' ),
            ),
            'public'      => true,
            'menu_icon'   => 'dashicons-testimonial',
            'supports'    => array( 'title', 'editor' ),
            'has_archive' => false,
            'show_in_rest'=> true,
        )
    );

    register_post_type(
        'sorena_stat',
        array(
            'labels' => array(
                'name'          => __( 'Stats', 'sorena' ),
                'singular_name' => __( 'Stat', 'sorena' ),
            ),
            'public'      => true,
            'menu_icon'   => 'dashicons-chart-bar',
            'supports'    => array( 'title' ),
            'has_archive' => false,
            'show_in_rest'=> true,
        )
    );
}
add_action( 'init', 'sorena_register_cpts' );

function sorena_register_taxonomies() {
    register_taxonomy(
        'product_tech',
        'product',
        array(
            'labels' => array(
                'name'          => __( 'Technologies', 'sorena' ),
                'singular_name' => __( 'Technology', 'sorena' ),
            ),
            'hierarchical'      => false,
            'show_admin_column' => true,
            'show_in_rest'      => true,
        )
    );
}
add_action( 'init', 'sorena_register_taxonomies' );
