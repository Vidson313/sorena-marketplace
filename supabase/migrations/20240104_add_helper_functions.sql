-- Function to increment discount code usage
CREATE OR REPLACE FUNCTION public.increment_discount_usage(discount_code TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.discount_codes 
  SET used_count = COALESCE(used_count, 0) + 1
  WHERE code = discount_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix trigger for reviews - use OLD for DELETE operations
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  product_id_to_update UUID;
BEGIN
  -- Determine which product_id to use
  IF TG_OP = 'DELETE' THEN
    product_id_to_update := OLD.product_id;
  ELSE
    product_id_to_update := NEW.product_id;
  END IF;

  -- Update the product's rating
  UPDATE public.products
  SET 
    rating_average = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE product_id = product_id_to_update
      AND is_approved = true
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE product_id = product_id_to_update
      AND is_approved = true
    )
  WHERE id = product_id_to_update;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists and recreate
DROP TRIGGER IF EXISTS update_product_rating_trigger ON public.reviews;

CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_product_rating();
