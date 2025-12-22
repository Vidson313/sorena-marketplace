<?php
/**
 * Theme helpers.
 */

function sorena_get_default_options() {
    return array(
        'hero_badge'             => 'پلتفرم حرفه‌ای فروش پروژه‌های سورنا',
        'hero_title_primary'     => 'پروژه‌های آماده',
        'hero_title_secondary'   => 'برای شروع سریع محصول شما',
        'hero_description'       => 'در سورنا مجموعه‌ای از پروژه‌های آماده و قابل توسعه را پیدا می‌کنید تا بدون اتلاف زمان، نسخه اول محصول خود را بسازید. همه پروژه‌ها استاندارد، مستند و آماده توسعه هستند.',
        'hero_media_image'       => '',
        'hero_media_video'       => '',
        'hero_primary_label'     => 'مشاهده پروژه‌ها',
        'hero_primary_url'       => '/products',
        'hero_secondary_label'   => 'پروژه‌های ویژه',
        'hero_secondary_url'     => '/products?featured=true',
        'cta_title'              => 'پروژه دلخواه خودت را پیدا کن',
        'cta_description'        => 'از بین پروژه‌های حرفه‌ای و قابل توسعه انتخاب کنید و با سرعت بیشتر وارد بازار شوید. تیم سورنا همیشه کنار شماست.',
        'cta_primary_label'      => 'مشاهده همه پروژه‌ها',
        'cta_primary_url'        => '/products',
        'cta_secondary_label'    => 'مشاوره و پشتیبانی',
        'cta_secondary_url'      => '/my-account',
        'footer_email'           => 'info@sorena.ir',
        'footer_phone'           => '021-12345678',
        'footer_address'         => 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
        'footer_instagram'       => '#',
        'footer_twitter'         => '#',
        'footer_linkedin'        => '#',
        'footer_github'          => '#',
        'newsletter_title'       => 'خبرنامه سورنا',
        'newsletter_description' => 'برای دریافت جدیدترین پروژه‌ها و پیشنهادهای ویژه، ایمیل خود را ثبت کنید.',
        'newsletter_placeholder' => 'ایمیل خود را وارد کنید',
        'newsletter_button'      => 'عضویت',
        'auth_visual_image'      => '',
    );
}

function sorena_get_option( $key ) {
    $defaults = sorena_get_default_options();
    $value    = get_theme_mod( $key, isset( $defaults[ $key ] ) ? $defaults[ $key ] : '' );

    return $value;
}
