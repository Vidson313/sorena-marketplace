<?php
/**
 * Meta boxes for CPTs and product fields.
 */

function sorena_register_meta_boxes() {
    add_meta_box( 'sorena_feature_meta', __( 'Feature Details', 'sorena' ), 'sorena_feature_meta_box', 'sorena_feature', 'normal', 'default' );
    add_meta_box( 'sorena_testimonial_meta', __( 'Testimonial Details', 'sorena' ), 'sorena_testimonial_meta_box', 'sorena_testimonial', 'normal', 'default' );
    add_meta_box( 'sorena_stat_meta', __( 'Stat Details', 'sorena' ), 'sorena_stat_meta_box', 'sorena_stat', 'normal', 'default' );
}
add_action( 'add_meta_boxes', 'sorena_register_meta_boxes' );

function sorena_feature_meta_box( $post ) {
    $icon = get_post_meta( $post->ID, '_sorena_icon', true );
    wp_nonce_field( 'sorena_save_meta', 'sorena_meta_nonce' );
    ?>
    <p>
        <label for="sorena_icon"><strong><?php esc_html_e( 'Icon', 'sorena' ); ?></strong></label>
        <input type="text" id="sorena_icon" name="sorena_icon" class="widefat" value="<?php echo esc_attr( $icon ); ?>" placeholder="shield, sparkles, zap" />
    </p>
    <?php
}

function sorena_testimonial_meta_box( $post ) {
    $role   = get_post_meta( $post->ID, '_sorena_role', true );
    $rating = get_post_meta( $post->ID, '_sorena_rating', true );
    wp_nonce_field( 'sorena_save_meta', 'sorena_meta_nonce' );
    ?>
    <p>
        <label for="sorena_role"><strong><?php esc_html_e( 'Role', 'sorena' ); ?></strong></label>
        <input type="text" id="sorena_role" name="sorena_role" class="widefat" value="<?php echo esc_attr( $role ); ?>" />
    </p>
    <p>
        <label for="sorena_rating"><strong><?php esc_html_e( 'Rating (1-5)', 'sorena' ); ?></strong></label>
        <input type="number" id="sorena_rating" name="sorena_rating" min="1" max="5" step="1" value="<?php echo esc_attr( $rating ); ?>" />
    </p>
    <?php
}

function sorena_stat_meta_box( $post ) {
    $value = get_post_meta( $post->ID, '_sorena_value', true );
    $icon  = get_post_meta( $post->ID, '_sorena_icon', true );
    wp_nonce_field( 'sorena_save_meta', 'sorena_meta_nonce' );
    ?>
    <p>
        <label for="sorena_value"><strong><?php esc_html_e( 'Value', 'sorena' ); ?></strong></label>
        <input type="text" id="sorena_value" name="sorena_value" class="widefat" value="<?php echo esc_attr( $value ); ?>" placeholder="10,000+" />
    </p>
    <p>
        <label for="sorena_icon"><strong><?php esc_html_e( 'Icon', 'sorena' ); ?></strong></label>
        <input type="text" id="sorena_icon" name="sorena_icon" class="widefat" value="<?php echo esc_attr( $icon ); ?>" placeholder="users, download" />
    </p>
    <?php
}

function sorena_save_meta_boxes( $post_id ) {
    if ( ! isset( $_POST['sorena_meta_nonce'] ) || ! wp_verify_nonce( $_POST['sorena_meta_nonce'], 'sorena_save_meta' ) ) {
        return;
    }

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    if ( isset( $_POST['sorena_icon'] ) ) {
        update_post_meta( $post_id, '_sorena_icon', sanitize_text_field( wp_unslash( $_POST['sorena_icon'] ) ) );
    }

    if ( isset( $_POST['sorena_role'] ) ) {
        update_post_meta( $post_id, '_sorena_role', sanitize_text_field( wp_unslash( $_POST['sorena_role'] ) ) );
    }

    if ( isset( $_POST['sorena_rating'] ) ) {
        update_post_meta( $post_id, '_sorena_rating', absint( $_POST['sorena_rating'] ) );
    }

    if ( isset( $_POST['sorena_value'] ) ) {
        update_post_meta( $post_id, '_sorena_value', sanitize_text_field( wp_unslash( $_POST['sorena_value'] ) ) );
    }
}
add_action( 'save_post', 'sorena_save_meta_boxes' );
