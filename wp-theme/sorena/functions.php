<?php
/**
 * Sorena theme bootstrap.
 */

define( 'SORENA_THEME_VERSION', '1.0.0' );

define( 'SORENA_THEME_PATH', trailingslashit( get_template_directory() ) );

define( 'SORENA_THEME_URL', trailingslashit( get_template_directory_uri() ) );

require SORENA_THEME_PATH . 'inc/setup.php';
require SORENA_THEME_PATH . 'inc/enqueue.php';
require SORENA_THEME_PATH . 'inc/helpers.php';
require SORENA_THEME_PATH . 'inc/customizer.php';
require SORENA_THEME_PATH . 'inc/cpt.php';
require SORENA_THEME_PATH . 'inc/meta.php';
require SORENA_THEME_PATH . 'inc/icons.php';
require SORENA_THEME_PATH . 'inc/woocommerce.php';
require SORENA_THEME_PATH . 'inc/rest.php';
require SORENA_THEME_PATH . 'inc/ajax.php';
require SORENA_THEME_PATH . 'inc/demo-content.php';
