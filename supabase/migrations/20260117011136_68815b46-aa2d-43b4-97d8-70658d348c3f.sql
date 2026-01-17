-- Fix remaining Function Search Path issues

-- Fix generate_invoice_number trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(NEXTVAL('invoice_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Fix generate_patient_id trigger function with proper search_path
CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.patient_id := 'KDC-' || LPAD(NEXTVAL('patient_id_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$;

-- Fix the "Anyone can submit leads" policy to require basic field validation
-- This is intentional for public contact forms, but we add validation
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
CREATE POLICY "Anyone can submit leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (
    -- Require at least a name and either email or phone
    name IS NOT NULL 
    AND name != ''
    AND (
      (email IS NOT NULL AND email != '')
      OR (phone IS NOT NULL AND phone != '')
    )
  );