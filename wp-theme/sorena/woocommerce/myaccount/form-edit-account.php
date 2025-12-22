<?php
/**
 * Edit account form.
 */
defined( 'ABSPATH' ) || exit;

$user = wp_get_current_user();
?>
<form class="account-form space-y-6" method="post">
    <?php do_action( 'woocommerce_edit_account_form_start' ); ?>

    <div class="grid sm:grid-cols-2 gap-4">
        <div class="auth-field">
            <label class="auth-label" for="account_first_name"><?php echo esc_html__( 'نام', 'sorena' ); ?></label>
            <input type="text" class="auth-input" name="account_first_name" id="account_first_name" autocomplete="given-name" value="<?php echo esc_attr( $user->first_name ); ?>" />
        </div>
        <div class="auth-field">
            <label class="auth-label" for="account_last_name"><?php echo esc_html__( 'نام خانوادگی', 'sorena' ); ?></label>
            <input type="text" class="auth-input" name="account_last_name" id="account_last_name" autocomplete="family-name" value="<?php echo esc_attr( $user->last_name ); ?>" />
        </div>
    </div>

    <div class="grid sm:grid-cols-2 gap-4">
        <div class="auth-field">
            <label class="auth-label" for="account_display_name"><?php echo esc_html__( 'نام نمایشی', 'sorena' ); ?></label>
            <input type="text" class="auth-input" name="account_display_name" id="account_display_name" value="<?php echo esc_attr( $user->display_name ); ?>" />
        </div>
        <div class="auth-field">
            <label class="auth-label" for="account_email"><?php echo esc_html__( 'ایمیل', 'sorena' ); ?></label>
            <input type="email" class="auth-input" name="account_email" id="account_email" autocomplete="email" value="<?php echo esc_attr( $user->user_email ); ?>" />
        </div>
    </div>

    <div class="glass-surface rounded-2xl p-5 space-y-4">
        <h3 class="text-sm font-semibold"><?php echo esc_html__( 'تغییر رمز عبور', 'sorena' ); ?></h3>
        <div class="grid sm:grid-cols-2 gap-4">
            <div class="auth-field sm:col-span-2">
                <label class="auth-label" for="password_current"><?php echo esc_html__( 'رمز عبور فعلی', 'sorena' ); ?></label>
                <input type="password" class="auth-input" name="password_current" id="password_current" autocomplete="current-password" />
            </div>
            <div class="auth-field">
                <label class="auth-label" for="password_1"><?php echo esc_html__( 'رمز عبور جدید', 'sorena' ); ?></label>
                <input type="password" class="auth-input" name="password_1" id="password_1" autocomplete="new-password" />
            </div>
            <div class="auth-field">
                <label class="auth-label" for="password_2"><?php echo esc_html__( 'تکرار رمز عبور جدید', 'sorena' ); ?></label>
                <input type="password" class="auth-input" name="password_2" id="password_2" autocomplete="new-password" />
            </div>
        </div>
    </div>

    <?php do_action( 'woocommerce_edit_account_form' ); ?>

    <div class="flex flex-wrap gap-3">
        <?php wp_nonce_field( 'save_account_details', 'save-account-details-nonce' ); ?>
        <button type="submit" class="inline-flex items-center rounded-full px-6 py-3 bg-primary text-white text-sm" name="save_account_details" value="<?php esc_attr_e( 'Save changes', 'woocommerce' ); ?>">
            <?php echo esc_html__( 'ذخیره تغییرات', 'sorena' ); ?>
        </button>
        <input type="hidden" name="action" value="save_account_details" />
    </div>

    <?php do_action( 'woocommerce_edit_account_form_end' ); ?>
</form>
