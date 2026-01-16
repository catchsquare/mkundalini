-- Drop the existing admin manage policy that only checks for 'admin' role
DROP POLICY IF EXISTS "Admin can manage profiles" ON profiles;

-- Create a new policy that allows super_admin and admin to manage all profiles
CREATE POLICY "Admins can manage all profiles" ON profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role IN ('super_admin', 'admin')
  )
);

-- Also update the is_admin function to include super_admin
CREATE OR REPLACE FUNCTION is_admin(_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;