-- Fix is_admin to avoid RLS recursion by disabling row security inside the function
-- (needed because profiles RLS policies call is_admin(), and is_admin() reads from profiles)

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = _user_id
      AND p.role IN ('super_admin', 'admin')
  );
$$;