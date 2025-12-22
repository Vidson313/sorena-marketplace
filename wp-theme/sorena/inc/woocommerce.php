<?php
/**
 * WooCommerce integrations.
 */

function sorena_register_query_vars( $vars ) {
    $vars[] = 'difficulty';
    $vars[] = 'technology';
    $vars[] = 'category';
    $vars[] = 'minPrice';
    $vars[] = 'maxPrice';
    return $vars;
}
add_filter( 'query_vars', 'sorena_register_query_vars' );

function sorena_filter_products_query( $query ) {
    if ( is_admin() || ! $query->is_main_query() ) {
        return;
    }

    if ( ! is_post_type_archive( 'product' ) && ! is_tax( array( 'product_cat', 'product_tag', 'product_tech' ) ) ) {
        return;
    }

    $meta_query = (array) $query->get( 'meta_query' );
    $tax_query  = (array) $query->get( 'tax_query' );

    $difficulty = get_query_var( 'difficulty' );
    if ( $difficulty ) {
        $meta_query[] = array(
            'key'   => '_sorena_difficulty',
            'value' => sanitize_text_field( $difficulty ),
        );
    }

    $category = get_query_var( 'category' );
    if ( $category ) {
        $tax_query[] = array(
            'taxonomy' => 'product_cat',
            'field'    => 'slug',
            'terms'    => sanitize_text_field( $category ),
        );
    }

    $technology = get_query_var( 'technology' );
    if ( $technology ) {
        $tax_query[] = array(
            'taxonomy' => 'product_tech',
            'field'    => 'slug',
            'terms'    => sanitize_text_field( $technology ),
        );
    }

    $min_price = get_query_var( 'minPrice' );
    $max_price = get_query_var( 'maxPrice' );
    if ( $min_price || $max_price ) {
        $min = $min_price ? floatval( $min_price ) : 0;
        $max = $max_price ? floatval( $max_price ) : PHP_INT_MAX;
        $meta_query[] = array(
            'key'     => '_price',
            'value'   => array( $min, $max ),
            'compare' => 'BETWEEN',
            'type'    => 'NUMERIC',
        );
    }

    if ( ! empty( $meta_query ) ) {
        $query->set( 'meta_query', $meta_query );
    }

    if ( ! empty( $tax_query ) ) {
        $query->set( 'tax_query', $tax_query );
    }
}
add_action( 'pre_get_posts', 'sorena_filter_products_query' );

function sorena_product_custom_fields() {
    echo '<div class="options_group">';

    woocommerce_wp_text_input(
        array(
            'id'          => '_sorena_version',
            'label'       => __( 'Version', 'sorena' ),
            'placeholder' => '2.0.0',
        )
    );

    woocommerce_wp_select(
        array(
            'id'      => '_sorena_difficulty',
            'label'   => __( 'Difficulty', 'sorena' ),
            'options' => array(
                'beginner'     => __( 'Beginner', 'sorena' ),
                'intermediate' => __( 'Intermediate', 'sorena' ),
                'advanced'     => __( 'Advanced', 'sorena' ),
            ),
        )
    );

    woocommerce_wp_text_input(
        array(
            'id'                => '_sorena_support_months',
            'label'             => __( 'Support Duration (months)', 'sorena' ),
            'type'              => 'number',
            'custom_attributes' => array( 'min' => '0', 'step' => '1' ),
        )
    );

    woocommerce_wp_text_input(
        array(
            'id'          => '_sorena_demo_url',
            'label'       => __( 'Demo URL', 'sorena' ),
            'type'        => 'url',
            'placeholder' => 'https://demo.example.com',
        )
    );

    woocommerce_wp_text_input(
        array(
            'id'          => '_sorena_preview_images',
            'label'       => __( 'Preview Images (comma separated URLs)', 'sorena' ),
            'desc_tip'    => true,
            'description' => __( 'Used in product gallery on the single product page.', 'sorena' ),
        )
    );

    woocommerce_wp_checkbox(
        array(
            'id'    => '_sorena_includes_source',
            'label' => __( 'Includes Source Code', 'sorena' ),
        )
    );

    woocommerce_wp_checkbox(
        array(
            'id'    => '_sorena_includes_docs',
            'label' => __( 'Includes Documentation', 'sorena' ),
        )
    );

    woocommerce_wp_checkbox(
        array(
            'id'    => '_sorena_includes_db',
            'label' => __( 'Includes Database', 'sorena' ),
        )
    );

    woocommerce_wp_checkbox(
        array(
            'id'    => '_sorena_includes_video',
            'label' => __( 'Includes Video Tutorial', 'sorena' ),
        )
    );

    echo '</div>';
}
add_action( 'woocommerce_product_options_general_product_data', 'sorena_product_custom_fields' );

function sorena_save_product_custom_fields( $product ) {
    $fields = array(
        '_sorena_version'        => 'sanitize_text_field',
        '_sorena_difficulty'     => 'sanitize_text_field',
        '_sorena_support_months' => 'absint',
        '_sorena_demo_url'       => 'esc_url_raw',
        '_sorena_preview_images' => 'sanitize_text_field',
    );

    foreach ( $fields as $field => $sanitize ) {
        if ( isset( $_POST[ $field ] ) ) {
            $value = call_user_func( $sanitize, wp_unslash( $_POST[ $field ] ) );
            $product->update_meta_data( $field, $value );
        }
    }

    $checkboxes = array(
        '_sorena_includes_source',
        '_sorena_includes_docs',
        '_sorena_includes_db',
        '_sorena_includes_video',
    );

    foreach ( $checkboxes as $checkbox ) {
        $product->update_meta_data( $checkbox, isset( $_POST[ $checkbox ] ) ? 'yes' : 'no' );
    }
}
add_action( 'woocommerce_admin_process_product_object', 'sorena_save_product_custom_fields' );

function sorena_get_product_meta( $product_id, $key, $default = '' ) {
    $value = get_post_meta( $product_id, $key, true );
    if ( '' === $value || null === $value ) {
        return $default;
    }
    return $value;
}

function sorena_get_difficulty_label( $value ) {
    $labels = array(
        'beginner'     => 'مبتدی',
        'intermediate' => 'متوسط',
        'advanced'     => 'پیشرفته',
    );

    return isset( $labels[ $value ] ) ? $labels[ $value ] : $value;
}

function sorena_notice_classes( $classes ) {
    $base_classes = array(
        'glass-surface',
        'rounded-2xl',
        'border',
        'border-white/10',
        'bg-white/5',
        'px-4',
        'py-3',
        'text-sm',
        'leading-6',
    );

    $type_classes = array();
    if ( is_array( $classes ) && in_array( 'woocommerce-error', $classes, true ) ) {
        $type_classes = array( 'border-rose-400/40', 'bg-rose-500/10', 'text-rose-100' );
    } elseif ( is_array( $classes ) && in_array( 'woocommerce-message', $classes, true ) ) {
        $type_classes = array( 'border-emerald-400/40', 'bg-emerald-500/10', 'text-emerald-100' );
    } elseif ( is_array( $classes ) && in_array( 'woocommerce-info', $classes, true ) ) {
        $type_classes = array( 'border-sky-400/40', 'bg-sky-500/10', 'text-sky-100' );
    }

    if ( is_array( $classes ) ) {
        $classes = array_merge( $classes, $base_classes, $type_classes );
    } else {
        $classes = array_merge( array( $classes ), $base_classes, $type_classes );
    }

    return array_values( array_unique( $classes ) );
}
add_filter( 'woocommerce_notice_classes', 'sorena_notice_classes' );
