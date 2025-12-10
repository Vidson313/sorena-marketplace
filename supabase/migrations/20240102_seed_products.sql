-- Seed sample products for Sorena Marketplace

INSERT INTO public.products (
    title, title_fa, slug, description, description_fa, short_description, short_description_fa,
    price, discount_price, discount_percent, category_id, difficulty_level,
    thumbnail_url, preview_images, demo_url, version, sales_count, view_count,
    rating_average, rating_count, is_featured, is_active,
    support_duration_months, includes_source_code, includes_documentation,
    includes_database, includes_video_tutorial
) VALUES
(
    'E-commerce Dashboard',
    'داشبورد فروشگاه آنلاین',
    'ecommerce-dashboard',
    'A complete e-commerce dashboard solution built with React and Next.js',
    'این داشبورد فروشگاهی یک راه‌حل کامل برای مدیریت فروشگاه آنلاین شماست. با استفاده از React و Next.js ساخته شده و شامل تمام امکانات مورد نیاز برای مدیریت محصولات، سفارشات، مشتریان و گزارش‌های فروش است.',
    'Complete e-commerce dashboard with React and Next.js',
    'داشبورد مدیریت فروشگاه با React و Next.js',
    2500000, 1750000, 30,
    (SELECT id FROM public.categories WHERE slug = 'dashboard-admin'),
    'intermediate',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80'],
    'https://demo.example.com/ecommerce-dashboard',
    '2.0.0', 450, 2340, 4.9, 128, true, true,
    6, true, true, true, true
),
(
    'Blog Platform',
    'پلتفرم بلاگ حرفه‌ای',
    'blog-platform',
    'Professional blog platform with Laravel and Vue.js',
    'سیستم مدیریت محتوای حرفه‌ای با Laravel و Vue.js برای ساخت بلاگ‌های مدرن',
    'CMS platform with Laravel and Vue.js',
    'سیستم مدیریت محتوا با Laravel و Vue.js',
    1800000, NULL, NULL,
    (SELECT id FROM public.categories WHERE slug = 'web-applications'),
    'beginner',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80'],
    'https://demo.example.com/blog-platform',
    '1.5.0', 320, 1890, 4.7, 89, true, true,
    6, true, true, true, false
),
(
    'Mobile App Template',
    'قالب اپلیکیشن موبایل',
    'mobile-app-template',
    'Cross-platform mobile app template with React Native',
    'قالب اپلیکیشن موبایل چند پلتفرمی با React Native برای iOS و Android',
    'React Native mobile app template',
    'اپلیکیشن موبایل با React Native',
    3200000, 2400000, 25,
    (SELECT id FROM public.categories WHERE slug = 'mobile-apps'),
    'advanced',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80'],
    'https://demo.example.com/mobile-app',
    '3.0.0', 280, 1560, 4.8, 156, true, true,
    6, true, true, false, true
),
(
    'Admin Panel',
    'پنل مدیریت پیشرفته',
    'admin-panel',
    'Advanced admin panel with full CRUD operations',
    'پنل مدیریت پیشرفته با امکانات کامل CRUD و مدیریت کاربران',
    'Full-featured admin panel',
    'پنل ادمین با امکانات کامل',
    2100000, NULL, NULL,
    (SELECT id FROM public.categories WHERE slug = 'dashboard-admin'),
    'intermediate',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80'],
    'https://demo.example.com/admin-panel',
    '1.8.0', 195, 980, 4.6, 72, false, true,
    6, true, true, true, false
),
(
    'WordPress Theme',
    'قالب وردپرس فروشگاهی',
    'wordpress-theme',
    'Professional WordPress theme for e-commerce',
    'قالب حرفه‌ای وردپرس برای فروشگاه‌های آنلاین با WooCommerce',
    'E-commerce WordPress theme',
    'قالب حرفه‌ای وردپرس برای فروشگاه',
    1500000, 1200000, 20,
    (SELECT id FROM public.categories WHERE slug = 'wordpress'),
    'beginner',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80'],
    'https://demo.example.com/wordpress-theme',
    '2.5.0', 890, 4560, 4.5, 234, false, true,
    6, true, true, false, true
),
(
    'SaaS Starter Kit',
    'کیت استارتر SaaS',
    'saas-starter-kit',
    'Complete SaaS starter kit with Next.js and Supabase',
    'کیت استارتر کامل برای ساخت اپلیکیشن‌های SaaS با Next.js و Supabase',
    'SaaS starter with Next.js and Supabase',
    'شروع سریع پروژه SaaS با Next.js',
    4500000, NULL, NULL,
    (SELECT id FROM public.categories WHERE slug = 'web-applications'),
    'advanced',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    ARRAY['https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80'],
    'https://demo.example.com/saas-starter',
    '1.0.0', 145, 890, 4.9, 67, true, true,
    12, true, true, true, true
)
ON CONFLICT (slug) DO NOTHING;

-- Link products to technologies
INSERT INTO public.product_technologies (product_id, technology_id)
SELECT p.id, t.id FROM public.products p, public.technologies t
WHERE p.slug = 'ecommerce-dashboard' AND t.slug IN ('react', 'nextjs', 'tailwindcss', 'typescript', 'supabase')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_technologies (product_id, technology_id)
SELECT p.id, t.id FROM public.products p, public.technologies t
WHERE p.slug = 'blog-platform' AND t.slug IN ('laravel', 'vuejs', 'postgresql')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_technologies (product_id, technology_id)
SELECT p.id, t.id FROM public.products p, public.technologies t
WHERE p.slug = 'mobile-app-template' AND t.slug IN ('react-native', 'typescript')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_technologies (product_id, technology_id)
SELECT p.id, t.id FROM public.products p, public.technologies t
WHERE p.slug = 'admin-panel' AND t.slug IN ('react', 'nodejs', 'mongodb')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_technologies (product_id, technology_id)
SELECT p.id, t.id FROM public.products p, public.technologies t
WHERE p.slug = 'wordpress-theme' AND t.slug IN ('wordpress')
ON CONFLICT DO NOTHING;

INSERT INTO public.product_technologies (product_id, technology_id)
SELECT p.id, t.id FROM public.products p, public.technologies t
WHERE p.slug = 'saas-starter-kit' AND t.slug IN ('nextjs', 'supabase', 'tailwindcss', 'typescript')
ON CONFLICT DO NOTHING;
