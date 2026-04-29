-- 1. Prevent admins from escalating users to super_admin
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (
  is_admin(auth.uid())
  AND (
    -- super_admins can set any role
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin'
    )
    -- regular admins cannot create super_admins
    OR role <> 'super_admin'
  )
);

-- Also block admins from creating super_admin profiles via INSERT
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

CREATE POLICY "Admins can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (
  is_admin(auth.uid())
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin'
    )
    OR role <> 'super_admin'
  )
);

-- 2. Add explicit public SELECT policy for gallery items (consent-gated)
CREATE POLICY "Public can view consented visible gallery items"
ON public.gallery_items
FOR SELECT
TO anon, authenticated
USING (is_visible = true AND consent_obtained = true);