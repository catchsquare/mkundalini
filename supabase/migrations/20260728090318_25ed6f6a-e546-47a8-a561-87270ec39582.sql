
-- Restrict gallery_items: content_editors should not see patient_id linkages on raw table.
-- Split ALL policy into: SELECT for admins only; INSERT/UPDATE/DELETE for CMS users.
DROP POLICY IF EXISTS "CMS users can manage gallery items" ON public.gallery_items;

CREATE POLICY "Admins can view gallery items"
ON public.gallery_items
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "CMS users can insert gallery items"
ON public.gallery_items
FOR INSERT
TO authenticated
WITH CHECK (public.has_cms_access(auth.uid()));

CREATE POLICY "CMS users can update gallery items"
ON public.gallery_items
FOR UPDATE
TO authenticated
USING (public.has_cms_access(auth.uid()))
WITH CHECK (public.has_cms_access(auth.uid()));

CREATE POLICY "CMS users can delete gallery items"
ON public.gallery_items
FOR DELETE
TO authenticated
USING (public.has_cms_access(auth.uid()));

-- Restrict inventory_categories SELECT to staff only.
DROP POLICY IF EXISTS "Staff can view inventory categories" ON public.inventory_categories;

CREATE POLICY "Staff can view inventory categories"
ON public.inventory_categories
FOR SELECT
TO authenticated
USING (public.is_staff(auth.uid()));
