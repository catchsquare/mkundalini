-- =====================================================
-- SECURITY FIX: Privilege Escalation & Role System Cleanup
-- =====================================================

-- 1. Fix handle_new_user() to ALWAYS default to lowest privilege role
-- This prevents users from self-assigning admin roles via signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    'receptionist',  -- ALWAYS default to lowest privilege - NEVER trust client-supplied role
    true
  );
  RETURN NEW;
END;
$$;

-- 2. Fix has_cms_access() to query profiles.role instead of empty user_roles table
CREATE OR REPLACE FUNCTION public.has_cms_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = _user_id
    AND p.role IN ('super_admin', 'admin', 'content_editor')
  );
$$;

-- 3. Fix is_staff() to query profiles.role instead of empty user_roles table  
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = _user_id
    AND p.role IN ('super_admin', 'admin', 'manager', 'receptionist', 'dentist', 'content_editor')
  );
$$;

-- 4. Fix has_role() function for consistency
CREATE OR REPLACE FUNCTION public.has_role(_role text, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = _user_id
    AND p.role = _role
  );
$$;

-- 5. Drop the unused user_roles table to eliminate confusion
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- =====================================================
-- SECURITY FIX: Patient Medical Records Access Control
-- =====================================================

-- Drop existing overly permissive policies on patients table
DROP POLICY IF EXISTS "Staff can view patients" ON public.patients;
DROP POLICY IF EXISTS "Staff can create patients" ON public.patients;
DROP POLICY IF EXISTS "Staff can update patients" ON public.patients;

-- Create role-based SELECT policy for patients
-- Admins/Managers: Full access to all patient records
-- Dentists: Access to patients they are treating (via appointments)
-- Receptionists: Access to basic info only (implemented via application layer)
CREATE POLICY "Role-based patient read access" ON public.patients
FOR SELECT
USING (
  -- Admins and managers: full access
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'manager')
  )
  OR
  -- Dentists: full access to patients they have appointments with
  EXISTS (
    SELECT 1 FROM public.dentists d
    JOIN public.profiles p ON p.id = d.profile_id
    JOIN public.appointments a ON a.dentist_id = d.id
    WHERE p.user_id = auth.uid()
    AND a.patient_id = patients.id
  )
  OR
  -- Receptionists: can view all patients (need for scheduling)
  -- Note: Sensitive medical fields should be hidden in application layer for receptionists
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role = 'receptionist'
  )
);

-- Create INSERT policy - Admins, managers, and receptionists can create patients
CREATE POLICY "Staff can create patients" ON public.patients
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'admin', 'manager', 'receptionist')
  )
);

-- Create UPDATE policy - Restrict updates to admins, managers, and treating dentists
CREATE POLICY "Restricted patient updates" ON public.patients
FOR UPDATE
USING (
  -- Admins and managers: full update access
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'admin', 'manager')
  )
  OR
  -- Dentists: can update patients they are treating
  EXISTS (
    SELECT 1 FROM public.dentists d
    JOIN public.profiles p ON p.id = d.profile_id
    JOIN public.appointments a ON a.dentist_id = d.id
    WHERE p.user_id = auth.uid()
    AND a.patient_id = patients.id
  )
);

-- Create DELETE policy - Only admins can delete patients
CREATE POLICY "Admins can delete patients" ON public.patients
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'admin')
  )
);