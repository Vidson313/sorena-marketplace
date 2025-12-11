-- Fix infinite recursion in user_roles RLS policies
-- This migration fixes the is_admin() function and user_roles policies

-- First, drop existing policies on user_roles to avoid conflicts
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only super admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only super admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only super admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only super admins can delete roles" ON public.user_roles;

-- Recreate is_admin() function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_role text;
BEGIN
  -- Direct query without going through RLS
  SELECT role INTO user_role FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1;
  
  RETURN COALESCE(user_role IN ('admin', 'super_admin'), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate user_roles policies without using is_admin() to avoid recursion
CREATE POLICY "Users can view own role" ON public.user_roles 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all roles" ON public.user_roles 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Only super admins can insert roles" ON public.user_roles 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'super_admin'
    )
  );

CREATE POLICY "Only super admins can update roles" ON public.user_roles 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'super_admin'
    )
  );

CREATE POLICY "Only super admins can delete roles" ON public.user_roles 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'super_admin'
    )
  );
