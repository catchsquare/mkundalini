-- 1. Fix content editors accessing leads data
DROP POLICY IF EXISTS "Staff can manage leads" ON public.leads;
CREATE POLICY "Staff can manage leads"
ON public.leads
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist', 'dentist')
));

DROP POLICY IF EXISTS "Staff can view leads" ON public.leads;
CREATE POLICY "Staff can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist', 'dentist')
));

DROP POLICY IF EXISTS "Staff can manage lead activities" ON public.lead_activities;
CREATE POLICY "Staff can manage lead activities"
ON public.lead_activities
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist', 'dentist')
));

DROP POLICY IF EXISTS "Staff can view lead activities" ON public.lead_activities;
CREATE POLICY "Staff can view lead activities"
ON public.lead_activities
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist', 'dentist')
));

-- 2. Fix dentist license numbers visible to all authenticated users
DROP POLICY IF EXISTS "Staff can view dentists" ON public.dentists;
CREATE POLICY "Staff can view dentists"
ON public.dentists
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid()
  AND profiles.role IN ('super_admin', 'admin', 'manager', 'dentist')
));