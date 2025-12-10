-- Sorena Marketplace Database Schema

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    name_fa text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    icon text,
    parent_id uuid REFERENCES public.categories(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Technologies/Frameworks table
CREATE TABLE IF NOT EXISTS public.technologies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    icon text,
    color text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    title_fa text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    description_fa text,
    short_description text,
    short_description_fa text,
    price decimal(10,2) NOT NULL DEFAULT 0,
    discount_price decimal(10,2),
    discount_percent integer,
    category_id uuid REFERENCES public.categories(id),
    difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
    thumbnail_url text,
    preview_images text[],
    demo_url text,
    documentation_url text,
    video_tutorial_url text,
    source_code_url text,
    version text DEFAULT '1.0.0',
    sales_count integer DEFAULT 0,
    view_count integer DEFAULT 0,
    rating_average decimal(2,1) DEFAULT 0,
    rating_count integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    support_duration_months integer DEFAULT 6,
    includes_source_code boolean DEFAULT true,
    includes_documentation boolean DEFAULT true,
    includes_database boolean DEFAULT false,
    includes_video_tutorial boolean DEFAULT false,
    created_by uuid REFERENCES public.users(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Product Technologies junction table
CREATE TABLE IF NOT EXISTS public.product_technologies (
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    technology_id uuid REFERENCES public.technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, technology_id)
);

-- Product Files table
CREATE TABLE IF NOT EXISTS public.product_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    file_name text NOT NULL,
    file_type text NOT NULL,
    file_size bigint,
    file_url text NOT NULL,
    is_main boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id),
    order_number text UNIQUE NOT NULL,
    status text CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')) DEFAULT 'pending',
    subtotal decimal(10,2) NOT NULL,
    discount_amount decimal(10,2) DEFAULT 0,
    total decimal(10,2) NOT NULL,
    payment_method text,
    payment_status text CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    payment_reference text,
    discount_code text,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Order Items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id),
    price decimal(10,2) NOT NULL,
    discount_price decimal(10,2),
    license_key text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id),
    rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title text,
    content text,
    is_verified_purchase boolean DEFAULT false,
    is_approved boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Q&A table
CREATE TABLE IF NOT EXISTS public.product_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id),
    question text NOT NULL,
    answer text,
    answered_by uuid REFERENCES public.users(id),
    answered_at timestamp with time zone,
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Favorites/Wishlist table
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id, product_id)
);

-- Cart table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, product_id)
);

-- Discount Codes table
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    description text,
    discount_type text CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    discount_value decimal(10,2) NOT NULL,
    min_purchase decimal(10,2),
    max_discount decimal(10,2),
    usage_limit integer,
    used_count integer DEFAULT 0,
    valid_from timestamp with time zone,
    valid_until timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Support Tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id),
    order_id uuid REFERENCES public.orders(id),
    product_id uuid REFERENCES public.products(id),
    subject text NOT NULL,
    status text CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
    priority text CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Support Messages table
CREATE TABLE IF NOT EXISTS public.support_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id),
    message text NOT NULL,
    is_admin_reply boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- User Roles table (for admin access)
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    role text CHECK (role IN ('customer', 'admin', 'super_admin')) DEFAULT 'customer',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id)
);

-- Insert default categories
INSERT INTO public.categories (name, name_fa, slug, description, icon) VALUES
('Web Applications', 'اپلیکیشن‌های وب', 'web-applications', 'Full-stack web applications and templates', 'globe'),
('Mobile Apps', 'اپلیکیشن‌های موبایل', 'mobile-apps', 'iOS and Android mobile applications', 'smartphone'),
('WordPress', 'وردپرس', 'wordpress', 'WordPress themes and plugins', 'wordpress'),
('E-commerce', 'فروشگاهی', 'ecommerce', 'Online store templates and solutions', 'shopping-cart'),
('Dashboard & Admin', 'داشبورد و پنل مدیریت', 'dashboard-admin', 'Admin panels and dashboard templates', 'layout-dashboard'),
('Landing Pages', 'صفحات فرود', 'landing-pages', 'Marketing and landing page templates', 'file-text'),
('API & Backend', 'API و بک‌اند', 'api-backend', 'Backend services and API templates', 'server'),
('AI & ML', 'هوش مصنوعی', 'ai-ml', 'AI and Machine Learning projects', 'brain')
ON CONFLICT (slug) DO NOTHING;

-- Insert default technologies
INSERT INTO public.technologies (name, slug, icon, color) VALUES
('React', 'react', 'react', '#61DAFB'),
('Next.js', 'nextjs', 'nextjs', '#000000'),
('Vue.js', 'vuejs', 'vuejs', '#4FC08D'),
('Angular', 'angular', 'angular', '#DD0031'),
('Laravel', 'laravel', 'laravel', '#FF2D20'),
('Node.js', 'nodejs', 'nodejs', '#339933'),
('Python', 'python', 'python', '#3776AB'),
('Django', 'django', 'django', '#092E20'),
('WordPress', 'wordpress', 'wordpress', '#21759B'),
('TypeScript', 'typescript', 'typescript', '#3178C6'),
('Tailwind CSS', 'tailwindcss', 'tailwindcss', '#06B6D4'),
('PostgreSQL', 'postgresql', 'postgresql', '#4169E1'),
('MongoDB', 'mongodb', 'mongodb', '#47A248'),
('Flutter', 'flutter', 'flutter', '#02569B'),
('React Native', 'react-native', 'react-native', '#61DAFB'),
('Supabase', 'supabase', 'supabase', '#3ECF8E')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET 
        rating_average = (SELECT AVG(rating)::decimal(2,1) FROM public.reviews WHERE product_id = NEW.product_id AND is_approved = true),
        rating_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = NEW.product_id AND is_approved = true)
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_product_rating ON public.reviews;
CREATE TRIGGER trigger_update_product_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Function to increment sales count
CREATE OR REPLACE FUNCTION increment_sales_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE public.products
        SET sales_count = sales_count + 1
        WHERE id IN (SELECT product_id FROM public.order_items WHERE order_id = NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_increment_sales ON public.orders;
CREATE TRIGGER trigger_increment_sales
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION increment_sales_count();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'SRN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_order_number ON public.orders;
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();
