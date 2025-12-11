-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
-- Uses SECURITY DEFINER to bypass RLS and avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  RETURN user_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Categories: Public read, admin write
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories are editable by admins" ON public.categories FOR ALL USING (public.is_admin());

-- Technologies: Public read, admin write
CREATE POLICY "Technologies are viewable by everyone" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Technologies are editable by admins" ON public.technologies FOR ALL USING (public.is_admin());

-- Products: Public read active products, admin write
CREATE POLICY "Active products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Products are editable by admins" ON public.products FOR INSERT USING (public.is_admin());
CREATE POLICY "Products are updatable by admins" ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Products are deletable by admins" ON public.products FOR DELETE USING (public.is_admin());

-- Product Technologies: Public read, admin write
CREATE POLICY "Product technologies are viewable by everyone" ON public.product_technologies FOR SELECT USING (true);
CREATE POLICY "Product technologies are editable by admins" ON public.product_technologies FOR ALL USING (public.is_admin());

-- Product Files: Only purchasers and admins can view
CREATE POLICY "Product files viewable by purchasers" ON public.product_files FOR SELECT USING (
  public.is_admin() OR 
  EXISTS (
    SELECT 1 FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.product_id = product_files.product_id
    AND o.user_id = auth.uid()
    AND o.status = 'completed'
  )
);
CREATE POLICY "Product files are editable by admins" ON public.product_files FOR ALL USING (public.is_admin());

-- Orders: Users can view their own orders, admins can view all
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE USING (public.is_admin());

-- Order Items: Users can view their own order items, admins can view all
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND (user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Order items are insertable by system" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (public.is_admin());

-- Reviews: Public read approved reviews, users can manage their own
CREATE POLICY "Approved reviews are viewable by everyone" ON public.reviews FOR SELECT USING (is_approved = true OR user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- Product Questions: Public read public questions, users can manage their own
CREATE POLICY "Public questions are viewable by everyone" ON public.product_questions FOR SELECT USING (is_public = true OR user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can create questions" ON public.product_questions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own questions" ON public.product_questions FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can delete own questions" ON public.product_questions FOR DELETE USING (user_id = auth.uid() OR public.is_admin());

-- Favorites: Users can only manage their own favorites
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (user_id = auth.uid());

-- Cart Items: Users can only manage their own cart
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can add to cart" ON public.cart_items FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can remove from cart" ON public.cart_items FOR DELETE USING (user_id = auth.uid());

-- Discount Codes: Public read active codes, admin write
CREATE POLICY "Active discount codes are viewable" ON public.discount_codes FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Discount codes are editable by admins" ON public.discount_codes FOR ALL USING (public.is_admin());

-- Support Tickets: Users can manage their own tickets, admins can manage all
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users can create tickets" ON public.support_tickets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own tickets" ON public.support_tickets FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- Support Messages: Users can view messages in their tickets
CREATE POLICY "Users can view messages in own tickets" ON public.support_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.support_tickets WHERE id = support_messages.ticket_id AND (user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Users can create messages in own tickets" ON public.support_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.support_tickets WHERE id = support_messages.ticket_id AND user_id = auth.uid()) OR public.is_admin()
);

-- User Roles: Users can view their own role, super admins can manage all
-- Note: We don't use is_admin() here to avoid infinite recursion
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Super admins can view all roles" ON public.user_roles FOR SELECT USING (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) IN ('admin', 'super_admin')
);
CREATE POLICY "Only super admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) = 'super_admin'
);
CREATE POLICY "Only super admins can update roles" ON public.user_roles FOR UPDATE USING (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) = 'super_admin'
);
CREATE POLICY "Only super admins can delete roles" ON public.user_roles FOR DELETE USING (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) = 'super_admin'
);

-- Function to increment discount code usage
CREATE OR REPLACE FUNCTION public.increment_discount_usage(discount_code text)
RETURNS void AS $$
BEGIN
  UPDATE public.discount_codes
  SET used_count = COALESCE(used_count, 0) + 1
  WHERE code = discount_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix the trigger for reviews to handle DELETE properly
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_product_id uuid;
BEGIN
    -- Get the product_id based on operation type
    IF TG_OP = 'DELETE' THEN
        target_product_id := OLD.product_id;
    ELSE
        target_product_id := NEW.product_id;
    END IF;
    
    UPDATE public.products
    SET 
        rating_average = COALESCE((SELECT AVG(rating)::decimal(2,1) FROM public.reviews WHERE product_id = target_product_id AND is_approved = true), 0),
        rating_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = target_product_id AND is_approved = true)
    WHERE id = target_product_id;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
