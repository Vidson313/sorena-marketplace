<?php
/**
 * REST API endpoints for live product search.
 */

function sorena_register_rest_routes() {
    register_rest_route(
        'sorena/v1',
        '/search',
        array(
            'methods'             => 'GET',
            'callback'            => 'sorena_rest_product_search',
            'permission_callback' => '__return_true',
            'args'                => array(
                'q'         => array( 'sanitize_callback' => 'sanitize_text_field' ),
                'category'  => array( 'sanitize_callback' => 'sanitize_text_field' ),
                'min_price' => array( 'sanitize_callback' => 'floatval' ),
                'max_price' => array( 'sanitize_callback' => 'floatval' ),
                'type'      => array( 'sanitize_callback' => 'sanitize_text_field' ),
                'limit'     => array( 'sanitize_callback' => 'absint' ),
            ),
        )
    );
}
add_action( 'rest_api_init', 'sorena_register_rest_routes' );

function sorena_rest_product_search( WP_REST_Request $request ) {
    if ( ! function_exists( 'wc_get_products' ) ) {
        return rest_ensure_response( array( 'results' => array() ) );
    }

    $query = array(
        'status' => 'publish',
        'limit'  => $request->get_param( 'limit' ) ? absint( $request->get_param( 'limit' ) ) : 8,
    );

    $search = $request->get_param( 'q' );
    if ( $search ) {
        $query['s'] = $search;
    }

    $category = $request->get_param( 'category' );
    if ( $category ) {
        $query['category'] = array( $category );
    }

    $type = $request->get_param( 'type' );
    if ( $type ) {
        $query['type'] = $type;
    }

    $min_price = $request->get_param( 'min_price' );
    $max_price = $request->get_param( 'max_price' );
    if ( $min_price || $max_price ) {
        $min = $min_price ? floatval( $min_price ) : 0;
        $max = $max_price ? floatval( $max_price ) : PHP_INT_MAX;
        $query['meta_query'] = array(
            array(
                'key'     => '_price',
                'value'   => array( $min, $max ),
                'compare' => 'BETWEEN',
                'type'    => 'NUMERIC',
            ),
        );
    }

    $cache_key = 'sorena_search_' . md5( wp_json_encode( $query ) );
    $cached    = get_transient( $cache_key );
    if ( false !== $cached ) {
        return rest_ensure_response( $cached );
    }

    $products = wc_get_products( $query );
    $results  = array();

    foreach ( $products as $product ) {
        $image_id = $product->get_image_id();
        $image    = $image_id ? wp_get_attachment_image_url( $image_id, 'medium' ) : '';
        $results[] = array(
            'id'         => $product->get_id(),
            'name'       => $product->get_name(),
            'price_html' => $product->get_price_html(),
            'price'      => $product->get_price(),
            'permalink'  => $product->get_permalink(),
            'image'      => $image,
        );
    }

    $payload = array( 'results' => $results );
    set_transient( $cache_key, $payload, MINUTE_IN_SECONDS );

    return rest_ensure_response( $payload );
}
