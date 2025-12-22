<?php
/**
 * Edit address form.
 */
defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_edit_address_form' );
?>

<form method="post">
    <div class="grid sm:grid-cols-2 gap-4">
        <?php foreach ( $address as $key => $field ) : ?>
            <?php
            $base_classes   = isset( $field['class'] ) ? (array) $field['class'] : array();
            $wrapper_class  = array( 'auth-field' );
            if ( in_array( 'form-row-wide', $base_classes, true ) || in_array( 'form-row-full', $base_classes, true ) ) {
                $wrapper_class[] = 'sm:col-span-2';
            }
            $field['class']       = $wrapper_class;
            $field['input_class'] = array( 'auth-input' );
            $field['label_class'] = array( 'auth-label' );
            ?>
            <?php woocommerce_form_field( $key, $field, wc_get_post_data_by_key( $key, $field['value'] ) ); ?>
        <?php endforeach; ?>
    </div>

    <div class="mt-6 flex flex-wrap gap-3">
        <button type="submit" class="inline-flex items-center rounded-full px-6 py-3 bg-primary text-white text-sm" name="save_address" value="<?php esc_attr_e( 'Save address', 'woocommerce' ); ?>">
            <?php echo esc_html__( 'ذخیره آدرس', 'sorena' ); ?>
        </button>
        <?php wp_nonce_field( 'woocommerce-edit_address', 'woocommerce-edit-address-nonce' ); ?>
        <input type="hidden" name="action" value="edit_address" />
    </div>
</form>

<?php do_action( 'woocommerce_after_edit_address_form' ); ?>
