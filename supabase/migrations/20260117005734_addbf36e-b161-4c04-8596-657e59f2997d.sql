-- Add CHECK constraints on financial tables to prevent data integrity issues

-- Invoice constraints
ALTER TABLE invoices
  ADD CONSTRAINT invoices_check_discount CHECK (discount >= 0),
  ADD CONSTRAINT invoices_check_subtotal CHECK (subtotal >= 0),
  ADD CONSTRAINT invoices_check_total CHECK (total >= 0);

-- Invoice items constraints
ALTER TABLE invoice_items
  ADD CONSTRAINT invoice_items_check_quantity CHECK (quantity > 0 AND quantity <= 10000),
  ADD CONSTRAINT invoice_items_check_unit_price CHECK (unit_price >= 0),
  ADD CONSTRAINT invoice_items_check_total CHECK (total >= 0);

-- Payments constraints
ALTER TABLE payments
  ADD CONSTRAINT payments_check_amount CHECK (amount > 0);

-- Inventory items constraints
ALTER TABLE inventory_items
  ADD CONSTRAINT inventory_items_check_cost_price CHECK (cost_price IS NULL OR cost_price >= 0),
  ADD CONSTRAINT inventory_items_check_quantity CHECK (quantity >= 0),
  ADD CONSTRAINT inventory_items_check_min_stock CHECK (min_stock_level >= 0);

-- Inventory transactions constraints
ALTER TABLE inventory_transactions
  ADD CONSTRAINT inventory_transactions_check_quantity CHECK (quantity != 0);

-- Treatments constraints
ALTER TABLE treatments
  ADD CONSTRAINT treatments_check_base_price CHECK (base_price >= 0);