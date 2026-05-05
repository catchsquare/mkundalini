-- Add is_active check to security definer helpers so deactivated staff lose access immediately
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = _user_id
    AND is_active = true
    AND role IN ('super_admin', 'admin', 'manager', 'receptionist', 'dentist', 'content_editor')
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_cms_access(_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = _user_id
    AND is_active = true
    AND role IN ('super_admin', 'admin', 'content_editor')
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = _user_id
    AND is_active = true
    AND role IN ('super_admin', 'admin')
  );
END;
$function$;