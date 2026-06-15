-- helper function to break recursion loop when checking if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM "public"."Users"
    WHERE id = auth.uid() AND role = 'Admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;