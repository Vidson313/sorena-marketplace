<?php
/**
 * Theme customizer settings.
 */

function sorena_customize_register( $wp_customize ) {
    $defaults = sorena_get_default_options();

    $wp_customize->add_section(
        'sorena_hero',
        array(
            'title'    => __( 'Hero Section', 'sorena' ),
            'priority' => 30,
        )
    );

    $wp_customize->add_setting( 'hero_badge', array( 'default' => $defaults['hero_badge'], 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'hero_badge', array( 'label' => __( 'Badge Text', 'sorena' ), 'section' => 'sorena_hero', 'type' => 'text' ) );

    $wp_customize->add_setting( 'hero_title_primary', array( 'default' => $defaults['hero_title_primary'], 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'hero_title_primary', array( 'label' => __( 'Title Line 1', 'sorena' ), 'section' => 'sorena_hero', 'type' => 'text' ) );

    $wp_customize->add_setting( 'hero_title_secondary', array( 'default' => $defaults['hero_title_secondary'], 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'hero_title_secondary', array( 'label' => __( 'Title Line 2', 'sorena' ), 'section' => 'sorena_hero', 'type' => 'text' ) );

    $wp_customize->add_setting( 'hero_description', array( 'default' => $defaults['hero_description'], 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'hero_description', array( 'label' => __( 'Description', 'sorena' ), 'section' => 'sorena_hero', 'type' => 'textarea' ) );

    $wp_customize->add_setting( 'hero_media_image', array( 'default' => $defaults['hero_media_image'], 'sanitize_callback' => 'absint' ) );
    $wp_customize->add_control(
        new WP_Customize_Media_Control(
            $wp_customize,
            'hero_media_image',
            array(
                'label'     => __( 'Hero Media Image', 'sorena' ),
                'section'   => 'sorena_hero',
                'mime_type' => 'image',
            )
        )
    );

    $wp_customize->add_setting( 'hero_media_video', array( 'default' => $defaults['hero_media_video'], 'sanitize_callback' => 'absint' ) );
    $wp_customize->add_control(
        new WP_Customize_Media_Control(
            $wp_customize,
            'hero_media_video',
            array(
                'label'     => __( 'Hero Media Video', 'sorena' ),
                'section'   => 'sorena_hero',
                'mime_type' => 'video',
            )
        )
    );

    $wp_customize->add_section(
        'sorena_auth',
        array(
            'title'    => __( 'Auth Page', 'sorena' ),
            'priority' => 35,
        )
    );

    $wp_customize->add_setting( 'auth_visual_image', array( 'default' => $defaults['auth_visual_image'], 'sanitize_callback' => 'absint' ) );
    $wp_customize->add_control(
        new WP_Customize_Media_Control(
            $wp_customize,
            'auth_visual_image',
            array(
                'label'     => __( 'Auth Visual Image', 'sorena' ),
                'section'   => 'sorena_auth',
                'mime_type' => 'image',
            )
        )
    );

    $wp_customize->add_setting( 'hero_primary_label', array( 'default' => $defaults['hero_primary_label'], 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'hero_primary_label', array( 'label' => __( 'Primary Button Label', 'sorena' ), 'section' => 'sorena_hero', 'type' => 'text' ) );

    $wp_customize->add_setting( 'hero_primary_url', array( 'default' => $defaults['hero_primary_url'], 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( 'hero_primary_url', array( 'label' => __( 'Primary Button URL', 'sorena' ), 'section' => 'sorena_hero', 'type' => 'url' ) );

    $wp_customize->add_setting( 'hero_secondary_label', array( 'default' => $defaults['hero_secondary_label'], 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'hero_secondary_label', array( 'label' => __( 'Secondary Button Label', 'sorena' ), 'section' => 'sorena_hero', 'type' => 'text' ) );

    $wp_customize->add_setting( 'hero_secondary_url', array( 'default' => $defaults['hero_secondary_url'], 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( 'hero_secondary_url', array( 'label' => __( 'Secondary Button URL', 'sorena' ), 'section' => 'sorena_hero', 'type' => 'url' ) );

    $wp_customize->add_section(
        'sorena_cta',
        array(
            'title'    => __( 'CTA Section', 'sorena' ),
            'priority' => 40,
        )
    );

    $wp_customize->add_setting( 'cta_title', array( 'default' => $defaults['cta_title'], 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'cta_title', array( 'label' => __( 'CTA Title', 'sorena' ), 'section' => 'sorena_cta', 'type' => 'text' ) );

    $wp_customize->add_setting( 'cta_description', array( 'default' => $defaults['cta_description'], 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'cta_description', array( 'label' => __( 'CTA Description', 'sorena' ), 'section' => 'sorena_cta', 'type' => 'textarea' ) );

    $wp_customize->add_setting( 'cta_primary_label', array( 'default' => $defaults['cta_primary_label'], 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'cta_primary_label', array( 'label' => __( 'CTA Primary Label', 'sorena' ), 'section' => 'sorena_cta', 'type' => 'text' ) );

    $wp_customize->add_setting( 'cta_primary_url', array( 'default' => $defaults['cta_primary_url'], 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( 'cta_primary_url', array( 'label' => __( 'CTA Primary URL', 'sorena' ), 'section' => 'sorena_cta', 'type' => 'url' ) );

    $wp_customize->add_setting( 'cta_secondary_label', array( 'default' => $defaults['cta_secondary_label'], 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'cta_secondary_label', array( 'label' => __( 'CTA Secondary Label', 'sorena' ), 'section' => 'sorena_cta', 'type' => 'text' ) );

    $wp_customize->add_setting( 'cta_secondary_url', array( 'default' => $defaults['cta_secondary_url'], 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( 'cta_secondary_url', array( 'label' => __( 'CTA Secondary URL', 'sorena' ), 'section' => 'sorena_cta', 'type' => 'url' ) );

    $wp_customize->add_section(
        'sorena_footer',
        array(
            'title'    => __( 'Footer & Newsletter', 'sorena' ),
            'priority' => 50,
        )
    );

    $footer_fields = array(
        'footer_email'           => __( 'Email', 'sorena' ),
        'footer_phone'           => __( 'Phone', 'sorena' ),
        'footer_address'         => __( 'Address', 'sorena' ),
        'footer_instagram'       => __( 'Instagram URL', 'sorena' ),
        'footer_twitter'         => __( 'Twitter URL', 'sorena' ),
        'footer_linkedin'        => __( 'LinkedIn URL', 'sorena' ),
        'footer_github'          => __( 'GitHub URL', 'sorena' ),
        'newsletter_title'       => __( 'Newsletter Title', 'sorena' ),
        'newsletter_description' => __( 'Newsletter Description', 'sorena' ),
        'newsletter_placeholder' => __( 'Newsletter Placeholder', 'sorena' ),
        'newsletter_button'      => __( 'Newsletter Button', 'sorena' ),
    );

    foreach ( $footer_fields as $field => $label ) {
        $wp_customize->add_setting( $field, array( 'default' => $defaults[ $field ], 'sanitize_callback' => 'sanitize_text_field' ) );
        $wp_customize->add_control( $field, array( 'label' => $label, 'section' => 'sorena_footer', 'type' => 'text' ) );
    }
}
add_action( 'customize_register', 'sorena_customize_register' );
