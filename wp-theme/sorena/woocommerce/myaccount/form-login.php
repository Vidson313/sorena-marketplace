<?php
/**
 * My Account login/register form.
 */
defined( 'ABSPATH' ) || exit;

$registration_enabled = ( 'yes' === get_option( 'woocommerce_enable_myaccount_registration' ) );
$register_active      = $registration_enabled ? 'active' : '';
$login_active         = $registration_enabled ? '' : 'active';
$auth_image_id        = (int) sorena_get_option( 'auth_visual_image' );
$auth_image_url = $auth_image_id ? wp_get_attachment_image_url( $auth_image_id, 'large' ) : '';
if ( ! $auth_image_url ) {
    $auth_image_url = SORENA_THEME_URL . 'assets/images/auth-visual.jpg';
}

do_action( 'woocommerce_before_customer_login_form' );
?>

<main class="container mx-auto px-4 py-12">
    <div class="auth-shell">
        <div class="auth-panel" data-tabs>
            <div class="auth-logo">
                <?php if ( has_custom_logo() ) : ?>
                    <span class="block site-logo">
                        <?php the_custom_logo(); ?>
                    </span>
                <?php else : ?>
                    <div class="auth-logo-mark">س</div>
                <?php endif; ?>
            </div>

            <div class="tab-content <?php echo esc_attr( $register_active ); ?>" data-tab-content="register">
                <div class="auth-head">
                    <h1 class="auth-title"><?php echo esc_html__( 'ایجاد حساب کاربری', 'sorena' ); ?></h1>
                    <p class="auth-subtitle">
                        <?php echo esc_html__( 'حساب دارید؟', 'sorena' ); ?>
                        <button type="button" class="auth-link tab-trigger" data-tab="login"><?php echo esc_html__( 'ورود', 'sorena' ); ?></button>
                    </p>
                </div>

                <?php if ( $registration_enabled ) : ?>
                    <form method="post" class="auth-form">
                        <?php do_action( 'woocommerce_register_form_start' ); ?>

                        <?php if ( 'no' === get_option( 'woocommerce_registration_generate_username' ) ) : ?>
                            <div class="auth-field">
                                <label class="auth-label" for="reg_username"><?php echo esc_html__( 'نام کاربری', 'sorena' ); ?></label>
                                <input type="text" class="auth-input" name="username" id="reg_username" autocomplete="username" />
                            </div>
                        <?php endif; ?>

                        <div class="auth-field">
                            <label class="auth-label" for="reg_email"><?php echo esc_html__( 'ایمیل', 'sorena' ); ?></label>
                            <input type="email" class="auth-input" name="email" id="reg_email" autocomplete="email" />
                        </div>

                        <?php if ( 'no' === get_option( 'woocommerce_registration_generate_password' ) ) : ?>
                            <div class="auth-field">
                                <label class="auth-label" for="reg_password"><?php echo esc_html__( 'رمز عبور', 'sorena' ); ?></label>
                                <input type="password" class="auth-input" name="password" id="reg_password" autocomplete="new-password" />
                            </div>
                        <?php else : ?>
                            <p class="auth-hint"><?php echo esc_html__( 'جزئیات ورود بعد از ثبت نام به ایمیل شما ارسال می‌شود.', 'sorena' ); ?></p>
                        <?php endif; ?>

                        <?php do_action( 'woocommerce_register_form' ); ?>

                        <?php wp_nonce_field( 'woocommerce-register', 'woocommerce-register-nonce' ); ?>
                        <button type="submit" class="auth-submit" name="register" value="<?php esc_attr_e( 'Register', 'sorena' ); ?>">
                            <?php echo esc_html__( 'ایجاد حساب', 'sorena' ); ?>
                        </button>

                        <?php do_action( 'woocommerce_register_form_end' ); ?>
                    </form>
                <?php else : ?>
                    <p class="auth-hint"><?php echo esc_html__( 'ثبت نام در حال حاضر غیرفعال است.', 'sorena' ); ?></p>
                <?php endif; ?>
            </div>

            <div class="tab-content <?php echo esc_attr( $login_active ); ?>" data-tab-content="login">
                <div class="auth-head">
                    <h1 class="auth-title"><?php echo esc_html__( 'ورود به حساب', 'sorena' ); ?></h1>
                    <?php if ( $registration_enabled ) : ?>
                        <p class="auth-subtitle">
                            <?php echo esc_html__( 'حساب ندارید؟', 'sorena' ); ?>
                            <button type="button" class="auth-link tab-trigger" data-tab="register"><?php echo esc_html__( 'ثبت نام', 'sorena' ); ?></button>
                        </p>
                    <?php endif; ?>
                </div>

                <form method="post" class="auth-form">
                    <?php do_action( 'woocommerce_login_form_start' ); ?>

                    <div class="auth-field">
                        <label class="auth-label" for="username"><?php echo esc_html__( 'نام کاربری یا ایمیل', 'sorena' ); ?></label>
                        <input type="text" class="auth-input" name="username" id="username" autocomplete="username" />
                    </div>

                    <div class="auth-field">
                        <label class="auth-label" for="password"><?php echo esc_html__( 'رمز عبور', 'sorena' ); ?></label>
                        <input class="auth-input" type="password" name="password" id="password" autocomplete="current-password" />
                    </div>

                    <?php do_action( 'woocommerce_login_form' ); ?>

                    <div class="auth-actions">
                        <label class="auth-remember">
                            <input type="checkbox" name="rememberme" id="rememberme" value="forever" />
                            <span><?php echo esc_html__( 'مرا به خاطر بسپار', 'sorena' ); ?></span>
                        </label>
                        <a class="auth-link-text" href="<?php echo esc_url( wp_lostpassword_url() ); ?>">
                            <?php echo esc_html__( 'فراموشی رمز عبور؟', 'sorena' ); ?>
                        </a>
                    </div>

                    <?php wp_nonce_field( 'woocommerce-login', 'woocommerce-login-nonce' ); ?>
                    <button type="submit" class="auth-submit" name="login" value="<?php esc_attr_e( 'Log in', 'sorena' ); ?>">
                        <?php echo esc_html__( 'ورود', 'sorena' ); ?>
                    </button>

                    <?php do_action( 'woocommerce_login_form_end' ); ?>
                </form>
            </div>
        </div>

        <aside class="auth-visual">
            <div class="auth-visual-frame" style="--auth-visual: url('<?php echo esc_url( $auth_image_url ); ?>');">
                <div class="auth-visual-content">
                    <div class="auth-visual-top">
                        <div class="auth-mark"><?php echo esc_html__( 'سورنا', 'sorena' ); ?></div>
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="auth-back">
                            <?php echo esc_html__( 'بازگشت به سایت', 'sorena' ); ?>
                            <?php echo sorena_icon( 'arrow-left', 'w-3 h-3' ); ?>
                        </a>
                    </div>
                    <div class="auth-visual-bottom">
                        <h2 class="auth-visual-title"><?php echo esc_html__( 'ثبت لحظه‌ها، ساخت خاطره‌ها', 'sorena' ); ?></h2>
                        <div class="auth-dots" aria-hidden="true">
                            <span class="auth-dot"></span>
                            <span class="auth-dot is-active"></span>
                            <span class="auth-dot"></span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    </div>
</main>

<?php do_action( 'woocommerce_after_customer_login_form' ); ?>
