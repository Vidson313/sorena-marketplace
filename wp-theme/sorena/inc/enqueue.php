<?php
/**
 * Enqueue theme assets.
 */

function sorena_enqueue_assets() {
    $version = SORENA_THEME_VERSION;

    wp_enqueue_style(
        'sorena-fonts',
        'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap',
        array(),
        null
    );

    wp_enqueue_style(
        'sorena-style',
        get_stylesheet_uri(),
        array( 'sorena-fonts' ),
        $version
    );

    wp_enqueue_style(
        'sorena-theme',
        SORENA_THEME_URL . 'assets/css/sorena.css',
        array( 'sorena-style' ),
        $version
    );

    wp_enqueue_script(
        'sorena-theme',
        SORENA_THEME_URL . 'assets/js/theme.js',
        array(),
        $version,
        true
    );

    wp_localize_script(
        'sorena-theme',
        'sorenaData',
        array(
            'ajaxUrl' => admin_url( 'admin-ajax.php' ),
            'nonce'   => wp_create_nonce( 'sorena_nonce' ),
        )
    );
}
add_action( 'wp_enqueue_scripts', 'sorena_enqueue_assets' );
