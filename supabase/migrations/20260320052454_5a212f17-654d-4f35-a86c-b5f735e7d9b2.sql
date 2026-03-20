-- 1. CRITICAL: Fix privilege escalation - prevent staff from changing their own role
DROP POLICY IF EXISTS "Staff can update own profile" ON public.profiles;
CREATE POLICY "Staff can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid() AND role = (SELECT p.role FROM public.profiles p WHERE p.user_id = auth.uid() LIMIT 1));

-- 2. CRITICAL: Fix gallery items exposing photos without consent
DROP POLICY IF EXISTS "Public can view visible gallery items" ON public.gallery_items;
CREATE POLICY "Public can view visible gallery items"
ON public.gallery_items
FOR SELECT
TO anon, authenticated
USING (is_visible = true AND consent_obtained = true);

-- 3. Fix audit log injection - restrict to staff only
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;
CREATE POLICY "Staff can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (is_staff(auth.uid()));

-- 4. Fix treatments visibility - restrict to staff
DROP POLICY IF EXISTS "Staff can view treatments" ON public.treatments;
CREATE POLICY "Staff can view treatments"
ON public.treatments
FOR SELECT
TO authenticated
USING (is_staff(auth.uid()));