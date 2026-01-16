-- =====================================================
-- Fix overly permissive write policies on operational tables
-- Replace USING (true) with proper role-based access
-- =====================================================

-- 1. APPOINTMENTS - Staff can view/create, only admins/managers/dentists can modify, admins can delete
DROP POLICY IF EXISTS "Staff can manage appointments" ON appointments;
DROP POLICY IF EXISTS "Staff can view appointments" ON appointments;

-- Staff can view all appointments (needed for scheduling)
CREATE POLICY "Staff can view appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist', 'dentist')
    )
  );

-- Staff can create appointments (receptionists schedule appointments)
CREATE POLICY "Staff can create appointments" ON appointments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist', 'dentist')
    )
  );

-- Only admins, managers, and dentists can update appointments
CREATE POLICY "Authorized staff can update appointments" ON appointments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'dentist')
    )
  );

-- Only admins can delete appointments
CREATE POLICY "Admins can delete appointments" ON appointments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );


-- 2. INVOICES - Only billing-authorized roles
DROP POLICY IF EXISTS "Staff can manage invoices" ON invoices;
DROP POLICY IF EXISTS "Staff can view invoices" ON invoices;

-- Staff can view invoices
CREATE POLICY "Staff can view invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist')
    )
  );

-- Only billing staff can create invoices
CREATE POLICY "Billing staff can create invoices" ON invoices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist')
    )
  );

-- Only admins and managers can update invoices
CREATE POLICY "Managers can update invoices" ON invoices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager')
    )
  );

-- Only admins can delete invoices
CREATE POLICY "Admins can delete invoices" ON invoices
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );


-- 3. INVOICE_ITEMS - Follows invoice access pattern
DROP POLICY IF EXISTS "Staff can manage invoice items" ON invoice_items;
DROP POLICY IF EXISTS "Staff can view invoice items" ON invoice_items;

-- Staff can view invoice items
CREATE POLICY "Staff can view invoice items" ON invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist')
    )
  );

-- Billing staff can create invoice items
CREATE POLICY "Billing staff can create invoice items" ON invoice_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist')
    )
  );

-- Only admins and managers can update invoice items
CREATE POLICY "Managers can update invoice items" ON invoice_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager')
    )
  );

-- Only admins can delete invoice items
CREATE POLICY "Admins can delete invoice items" ON invoice_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );


-- 4. PAYMENTS - Only billing-authorized roles (most restrictive)
DROP POLICY IF EXISTS "Staff can manage payments" ON payments;
DROP POLICY IF EXISTS "Staff can view payments" ON payments;

-- Only billing staff can view payments
CREATE POLICY "Billing staff can view payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist')
    )
  );

-- Only billing staff can record payments
CREATE POLICY "Billing staff can record payments" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'receptionist')
    )
  );

-- Only admins and managers can update payment records
CREATE POLICY "Managers can update payments" ON payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager')
    )
  );

-- Only admins can delete payments (critical financial data)
CREATE POLICY "Admins can delete payments" ON payments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );


-- 5. INVENTORY_ITEMS - Only admins and managers
DROP POLICY IF EXISTS "Staff can manage inventory items" ON inventory_items;
DROP POLICY IF EXISTS "Staff can view inventory items" ON inventory_items;

-- Staff can view inventory items
CREATE POLICY "Staff can view inventory items" ON inventory_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'dentist')
    )
  );

-- Only admins and managers can create inventory items
CREATE POLICY "Managers can create inventory items" ON inventory_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager')
    )
  );

-- Only admins and managers can update inventory items
CREATE POLICY "Managers can update inventory items" ON inventory_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager')
    )
  );

-- Only admins can delete inventory items
CREATE POLICY "Admins can delete inventory items" ON inventory_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );


-- 6. INVENTORY_TRANSACTIONS - Only admins and managers
DROP POLICY IF EXISTS "Staff can manage inventory transactions" ON inventory_transactions;
DROP POLICY IF EXISTS "Staff can view inventory transactions" ON inventory_transactions;

-- Staff can view inventory transactions (audit trail)
CREATE POLICY "Staff can view inventory transactions" ON inventory_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager', 'dentist')
    )
  );

-- Only admins and managers can create inventory transactions
CREATE POLICY "Managers can create inventory transactions" ON inventory_transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin', 'manager')
    )
  );

-- Only admins can update inventory transactions (audit trail should be immutable)
CREATE POLICY "Admins can update inventory transactions" ON inventory_transactions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Only admins can delete inventory transactions
CREATE POLICY "Admins can delete inventory transactions" ON inventory_transactions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );