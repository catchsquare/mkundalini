-- Fix Function Search Path issues using CREATE OR REPLACE (no drop needed)

-- Fix is_admin function with proper search_path
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = _user_id
    AND role IN ('super_admin', 'admin')
  );
END;
$$;

-- Fix is_staff function with proper search_path
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = _user_id
    AND role IN ('super_admin', 'admin', 'manager', 'receptionist', 'dentist', 'content_editor')
  );
END;
$$;

-- Fix has_cms_access function with proper search_path
CREATE OR REPLACE FUNCTION public.has_cms_access(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = _user_id
    AND role IN ('super_admin', 'admin', 'content_editor')
  );
END;
$$;

-- Fix has_role text version with proper search_path
CREATE OR REPLACE FUNCTION public.has_role(_role text, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = _user_id
    AND role = _role
  );
END;
$$;

-- Fix has_role enum version with proper search_path
CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = _user_id
    AND role = _role::text
  );
END;
$$;

-- Fix update_updated_at_column trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix overly permissive RLS policies

-- 1. Remove the redundant permissive "Staff can insert patients" policy
DROP POLICY IF EXISTS "Staff can insert patients" ON public.patients;

-- 2. Fix "System can insert audit logs" - make it require authenticated user
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Note: "Anyone can submit leads" policy is kept as-is since it's intentional
-- for public contact forms - input validation is handled at the application layer