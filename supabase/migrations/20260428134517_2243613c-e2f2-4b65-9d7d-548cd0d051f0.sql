
-- 1. Remove appointments from realtime publication (sensitive data leakage)
ALTER PUBLICATION supabase_realtime DROP TABLE public.appointments;

-- 2. Public view of gallery_items WITHOUT patient_id linkage
CREATE OR REPLACE VIEW public.gallery_items_public
WITH (security_invoker = true) AS
SELECT
  id, title, description, before_image, after_image, tags,
  category_id, treatment_id, dentist_id,
  is_visible, is_featured, consent_obtained, sort_order,
  created_at, updated_at
FROM public.gallery_items
WHERE is_visible = true AND consent_obtained = true;

GRANT SELECT ON public.gallery_items_public TO anon, authenticated;

-- Revoke public read on raw gallery_items; only CMS users keep ALL access via existing policy
DROP POLICY IF EXISTS "Public can view visible gallery items" ON public.gallery_items;

-- 3. Prevent role self-escalation on profiles
DROP POLICY IF EXISTS "Staff can update own profile" ON public.profiles;

CREATE POLICY "Staff can update own profile (no role change)"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND role = (SELECT p.role FROM public.profiles p WHERE p.user_id = auth.uid() LIMIT 1)
);

-- Trigger-level enforcement: block any non-admin from changing their role
CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_self_escalation_trg ON public.profiles;
CREATE TRIGGER prevent_role_self_escalation_trg
BEFORE UPDATE OF role ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_self_escalation();

-- 4. Restrict write access to offers and team_members to CMS users only
DROP POLICY IF EXISTS "Staff can manage offers" ON public.offers;
CREATE POLICY "CMS users can manage offers"
ON public.offers
FOR ALL
TO authenticated
USING (public.has_cms_access(auth.uid()))
WITH CHECK (public.has_cms_access(auth.uid()));

DROP POLICY IF EXISTS "Staff can manage team members" ON public.team_members;
CREATE POLICY "CMS users can manage team members"
ON public.team_members
FOR ALL
TO authenticated
USING (public.has_cms_access(auth.uid()))
WITH CHECK (public.has_cms_access(auth.uid()));

-- 5. Revoke EXECUTE on SECURITY DEFINER role-check functions from anon
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_cms_access(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(text, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(public.app_role, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.prevent_role_self_escalation() FROM anon, public, authenticated;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_cms_access(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(public.app_role, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 6. Restrict storage object listing on site-assets bucket to admins
-- Files are still accessible by direct URL (public bucket), but listing/enumeration is blocked
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND (policyname ILIKE '%site-assets%public%' OR policyname ILIKE '%public read%site-assets%' OR policyname ILIKE '%anyone%site-assets%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;
