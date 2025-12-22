<?php
/**
 * Ajax handlers.
 */

function sorena_toggle_favorite() {
    check_ajax_referer( 'sorena_nonce', 'nonce' );

    if ( ! is_user_logged_in() ) {
        wp_send_json_error( array( 'message' => 'برای افزودن به علاقه‌مندی‌ها وارد شوید.' ), 401 );
    }

    $product_id = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;
    if ( ! $product_id ) {
        wp_send_json_error( array( 'message' => 'محصول نامعتبر است.' ), 400 );
    }

    $user_id   = get_current_user_id();
    $favorites = (array) get_user_meta( $user_id, '_sorena_favorites', true );

    if ( in_array( $product_id, $favorites, true ) ) {
        $favorites = array_values( array_diff( $favorites, array( $product_id ) ) );
        update_user_meta( $user_id, '_sorena_favorites', $favorites );
        wp_send_json_success( array( 'isFavorite' => false ) );
    }

    $favorites[] = $product_id;
    $favorites   = array_values( array_unique( $favorites ) );
    update_user_meta( $user_id, '_sorena_favorites', $favorites );

    wp_send_json_success( array( 'isFavorite' => true ) );
}
add_action( 'wp_ajax_sorena_toggle_favorite', 'sorena_toggle_favorite' );
add_action( 'wp_ajax_nopriv_sorena_toggle_favorite', 'sorena_toggle_favorite' );
