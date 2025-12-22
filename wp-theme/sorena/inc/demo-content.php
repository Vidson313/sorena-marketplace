<?php
/**
 * Demo content on theme activation.
 */

function sorena_create_demo_content() {
    if ( get_option( 'sorena_demo_content_created' ) ) {
        return;
    }

    $page_map = array(
        'home'      => array( 'title' => 'خانه', 'template' => 'front-page.php' ),
        'favorites' => array( 'title' => 'علاقه‌مندی‌ها', 'template' => 'page-favorites.php' ),
    );

    foreach ( $page_map as $slug => $data ) {
        if ( ! get_page_by_path( $slug ) ) {
            $page_id = wp_insert_post(
                array(
                    'post_title'   => $data['title'],
                    'post_status'  => 'publish',
                    'post_type'    => 'page',
                    'post_name'    => $slug,
                )
            );

            if ( $page_id && ! empty( $data['template'] ) ) {
                update_post_meta( $page_id, '_wp_page_template', $data['template'] );
            }
        }
    }

    $home_page = get_page_by_path( 'home' );
    if ( $home_page ) {
        update_option( 'show_on_front', 'page' );
        update_option( 'page_on_front', $home_page->ID );
    }

    if ( class_exists( 'WooCommerce' ) ) {
        if ( ! get_page_by_path( 'shop' ) ) {
            wc_create_page( 'shop', 'woocommerce_shop_page_id', 'فروشگاه', '', 0 );
        }
        if ( ! get_page_by_path( 'cart' ) ) {
            wc_create_page( 'cart', 'woocommerce_cart_page_id', 'سبد خرید', '', 0 );
        }
        if ( ! get_page_by_path( 'checkout' ) ) {
            wc_create_page( 'checkout', 'woocommerce_checkout_page_id', 'تکمیل خرید', '', 0 );
        }
        if ( ! get_page_by_path( 'my-account' ) ) {
            wc_create_page( 'my-account', 'woocommerce_myaccount_page_id', 'حساب کاربری', '', 0 );
        }
    }

    if ( ! get_term_by( 'slug', 'primary-menu', 'nav_menu' ) ) {
        $menu_id = wp_create_nav_menu( 'Primary Menu' );

        if ( $home_page ) {
            wp_update_nav_menu_item( $menu_id, 0, array(
                'menu-item-title'  => 'خانه',
                'menu-item-object' => 'page',
                'menu-item-object-id' => $home_page->ID,
                'menu-item-type'   => 'post_type',
                'menu-item-status' => 'publish',
            ) );
        }

        $shop_page_id = wc_get_page_id( 'shop' );
        if ( $shop_page_id > 0 ) {
            wp_update_nav_menu_item( $menu_id, 0, array(
                'menu-item-title'  => 'پروژه‌ها',
                'menu-item-object' => 'page',
                'menu-item-object-id' => $shop_page_id,
                'menu-item-type'   => 'post_type',
                'menu-item-status' => 'publish',
            ) );
        }

        $favorites_page = get_page_by_path( 'favorites' );
        if ( $favorites_page ) {
            wp_update_nav_menu_item( $menu_id, 0, array(
                'menu-item-title'  => 'علاقه‌مندی‌ها',
                'menu-item-object' => 'page',
                'menu-item-object-id' => $favorites_page->ID,
                'menu-item-type'   => 'post_type',
                'menu-item-status' => 'publish',
            ) );
        }

        $cart_page_id = wc_get_page_id( 'cart' );
        if ( $cart_page_id > 0 ) {
            wp_update_nav_menu_item( $menu_id, 0, array(
                'menu-item-title'  => 'سبد خرید',
                'menu-item-object' => 'page',
                'menu-item-object-id' => $cart_page_id,
                'menu-item-type'   => 'post_type',
                'menu-item-status' => 'publish',
            ) );
        }

        $account_page_id = wc_get_page_id( 'myaccount' );
        if ( $account_page_id > 0 ) {
            wp_update_nav_menu_item( $menu_id, 0, array(
                'menu-item-title'  => 'حساب کاربری',
                'menu-item-object' => 'page',
                'menu-item-object-id' => $account_page_id,
                'menu-item-type'   => 'post_type',
                'menu-item-status' => 'publish',
            ) );
        }

        $locations = get_theme_mod( 'nav_menu_locations', array() );
        $locations['primary'] = $menu_id;
        set_theme_mod( 'nav_menu_locations', $locations );
    }

    if ( ! get_term_by( 'slug', 'footer-support-menu', 'nav_menu' ) ) {
        $support_menu_id = wp_create_nav_menu( 'Footer Support Menu' );
        $support_items = array(
            array( 'title' => 'راهنمای خرید', 'url' => '#' ),
            array( 'title' => 'سوالات متداول', 'url' => '#' ),
            array( 'title' => 'تماس با ما', 'url' => '#' ),
            array( 'title' => 'پشتیبانی', 'url' => '#' ),
        );
        foreach ( $support_items as $item ) {
            wp_update_nav_menu_item( $support_menu_id, 0, array(
                'menu-item-title'  => $item['title'],
                'menu-item-url'    => $item['url'],
                'menu-item-status' => 'publish',
            ) );
        }
        $locations = get_theme_mod( 'nav_menu_locations', array() );
        $locations['footer_support'] = $support_menu_id;
        set_theme_mod( 'nav_menu_locations', $locations );
    }

    if ( ! get_term_by( 'slug', 'footer-company-menu', 'nav_menu' ) ) {
        $company_menu_id = wp_create_nav_menu( 'Footer Company Menu' );
        $company_items = array(
            array( 'title' => 'درباره ما', 'url' => '#' ),
            array( 'title' => 'وبلاگ', 'url' => '#' ),
            array( 'title' => 'فرصت‌های شغلی', 'url' => '#' ),
            array( 'title' => 'قوانین و مقررات', 'url' => '#' ),
            array( 'title' => 'حریم خصوصی', 'url' => '#' ),
        );
        foreach ( $company_items as $item ) {
            wp_update_nav_menu_item( $company_menu_id, 0, array(
                'menu-item-title'  => $item['title'],
                'menu-item-url'    => $item['url'],
                'menu-item-status' => 'publish',
            ) );
        }
        $locations = get_theme_mod( 'nav_menu_locations', array() );
        $locations['footer_company'] = $company_menu_id;
        set_theme_mod( 'nav_menu_locations', $locations );
    }

    if ( ! get_posts( array( 'post_type' => 'sorena_feature', 'posts_per_page' => 1 ) ) ) {
        $features = array(
            array( 'title' => 'امنیت بالا', 'content' => 'پرداخت امن و فایل‌های معتبر برای استفاده در پروژه‌های حرفه‌ای.', 'icon' => 'shield' ),
            array( 'title' => 'دانلود سریع', 'content' => 'دانلود فوری پس از پرداخت با لینک‌های مستقیم و مطمئن.', 'icon' => 'download' ),
            array( 'title' => 'سرعت توسعه', 'content' => 'با پروژه‌های آماده سریع‌تر MVP بسازید.', 'icon' => 'zap' ),
            array( 'title' => 'کدنویسی تمیز', 'content' => 'ساختار ماژولار و استاندارد برای توسعه آسان.', 'icon' => 'code2' ),
            array( 'title' => 'پشتیبانی واقعی', 'content' => 'پشتیبانی تخصصی همراه با مستندات کامل.', 'icon' => 'check' ),
            array( 'title' => 'کیفیت برتر', 'content' => 'تضمین کیفیت و به‌روزرسانی‌های منظم.', 'icon' => 'sparkles' ),
        );

        foreach ( $features as $feature ) {
            $post_id = wp_insert_post(
                array(
                    'post_type'   => 'sorena_feature',
                    'post_status' => 'publish',
                    'post_title'  => $feature['title'],
                    'post_content'=> $feature['content'],
                )
            );
            if ( $post_id ) {
                update_post_meta( $post_id, '_sorena_icon', $feature['icon'] );
            }
        }
    }

    if ( ! get_posts( array( 'post_type' => 'sorena_stat', 'posts_per_page' => 1 ) ) ) {
        $stats = array(
            array( 'title' => 'کاربران فعال', 'value' => '۳,۰۰۰+', 'icon' => 'users' ),
            array( 'title' => 'دانلود موفق', 'value' => '۱۲,۰۰۰+', 'icon' => 'download' ),
            array( 'title' => 'امتیاز کاربران', 'value' => '۴.۸', 'icon' => 'star' ),
            array( 'title' => 'پروژه آماده', 'value' => '۸۰+', 'icon' => 'code2' ),
        );

        foreach ( $stats as $stat ) {
            $post_id = wp_insert_post(
                array(
                    'post_type'   => 'sorena_stat',
                    'post_status' => 'publish',
                    'post_title'  => $stat['title'],
                )
            );
            if ( $post_id ) {
                update_post_meta( $post_id, '_sorena_value', $stat['value'] );
                update_post_meta( $post_id, '_sorena_icon', $stat['icon'] );
            }
        }
    }

    if ( ! get_posts( array( 'post_type' => 'sorena_testimonial', 'posts_per_page' => 1 ) ) ) {
        $testimonials = array(
            array( 'name' => 'رضا محمدی', 'role' => 'مدیر محصول', 'content' => 'پروژه‌ها دقیق و حرفه‌ای بودند و سریع به نتیجه رسیدیم.', 'rating' => 5 ),
            array( 'name' => 'الهام نوری', 'role' => 'توسعه‌دهنده فرانت‌اند', 'content' => 'کیفیت کد و مستندات عالی بود. پیشنهاد می‌کنم.', 'rating' => 5 ),
            array( 'name' => 'سینا حیدری', 'role' => 'کارآفرین', 'content' => 'رابط کاربری دقیقاً همان چیزی بود که نیاز داشتم.', 'rating' => 4 ),
        );

        foreach ( $testimonials as $item ) {
            $post_id = wp_insert_post(
                array(
                    'post_type'   => 'sorena_testimonial',
                    'post_status' => 'publish',
                    'post_title'  => $item['name'],
                    'post_content'=> $item['content'],
                )
            );
            if ( $post_id ) {
                update_post_meta( $post_id, '_sorena_role', $item['role'] );
                update_post_meta( $post_id, '_sorena_rating', $item['rating'] );
            }
        }
    }

    if ( class_exists( 'WooCommerce' ) && ! get_posts( array( 'post_type' => 'product', 'posts_per_page' => 1 ) ) ) {
        $categories = array(
            'web-applications' => 'وب اپلیکیشن',
            'mobile-apps'      => 'اپلیکیشن موبایل',
            'wordpress'        => 'وردپرس',
            'ecommerce'        => 'فروشگاه',
            'dashboard-admin'  => 'داشبورد',
        );

        $category_ids = array();
        foreach ( $categories as $slug => $name ) {
            $term = wp_insert_term( $name, 'product_cat', array( 'slug' => $slug ) );
            if ( ! is_wp_error( $term ) ) {
                $category_ids[ $slug ] = $term['term_id'];
            } else {
                $existing = get_term_by( 'slug', $slug, 'product_cat' );
                if ( $existing ) {
                    $category_ids[ $slug ] = $existing->term_id;
                }
            }
        }

        $tech_terms = array( 'React', 'Next.js', 'Tailwind', 'Laravel', 'Vue.js', 'WordPress', 'PHP' );
        foreach ( $tech_terms as $term_name ) {
            if ( ! term_exists( $term_name, 'product_tech' ) ) {
                wp_insert_term( $term_name, 'product_tech' );
            }
        }

        $products = array(
            array(
                'title'       => 'داشبورد فروشگاه آنلاین',
                'slug'        => 'ecommerce-dashboard',
                'price'       => 2500000,
                'sale_price'  => 1750000,
                'category'    => 'ecommerce',
                'difficulty'  => 'intermediate',
                'thumbnail'   => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
                'tech'        => array( 'React', 'Next.js', 'Tailwind' ),
            ),
            array(
                'title'       => 'پلتفرم بلاگ حرفه‌ای',
                'slug'        => 'blog-platform',
                'price'       => 1800000,
                'sale_price'  => 0,
                'category'    => 'web-applications',
                'difficulty'  => 'beginner',
                'thumbnail'   => 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
                'tech'        => array( 'Laravel', 'Vue.js' ),
            ),
            array(
                'title'       => 'تمپلیت اپلیکیشن موبایل',
                'slug'        => 'mobile-app-template',
                'price'       => 3200000,
                'sale_price'  => 2400000,
                'category'    => 'mobile-apps',
                'difficulty'  => 'advanced',
                'thumbnail'   => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
                'tech'        => array( 'React Native', 'TypeScript' ),
            ),
            array(
                'title'       => 'پنل مدیریت سازمانی',
                'slug'        => 'admin-panel',
                'price'       => 2100000,
                'sale_price'  => 0,
                'category'    => 'dashboard-admin',
                'difficulty'  => 'intermediate',
                'thumbnail'   => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
                'tech'        => array( 'React', 'Node.js' ),
            ),
        );

        foreach ( $products as $item ) {
            $product = new WC_Product_Simple();
            $product->set_name( $item['title'] );
            $product->set_slug( $item['slug'] );
            $product->set_regular_price( $item['price'] );
            if ( $item['sale_price'] ) {
                $product->set_sale_price( $item['sale_price'] );
            }
            $product->set_status( 'publish' );
            $product_id = $product->save();

            if ( $product_id ) {
                if ( isset( $category_ids[ $item['category'] ] ) ) {
                    wp_set_object_terms( $product_id, array( $category_ids[ $item['category'] ] ), 'product_cat' );
                }
                if ( ! empty( $item['tech'] ) ) {
                    wp_set_object_terms( $product_id, $item['tech'], 'product_tech' );
                }
                update_post_meta( $product_id, '_sorena_difficulty', $item['difficulty'] );
                update_post_meta( $product_id, '_sorena_support_months', 6 );
                update_post_meta( $product_id, '_sorena_includes_source', 'yes' );
                update_post_meta( $product_id, '_sorena_includes_docs', 'yes' );
                update_post_meta( $product_id, '_sorena_includes_db', 'yes' );
                update_post_meta( $product_id, '_sorena_includes_video', 'yes' );
                if ( $item['thumbnail'] ) {
                    update_post_meta( $product_id, '_sorena_preview_images', $item['thumbnail'] );
                }
            }
        }
    }

    update_option( 'sorena_demo_content_created', 1 );
}
add_action( 'after_switch_theme', 'sorena_create_demo_content' );
