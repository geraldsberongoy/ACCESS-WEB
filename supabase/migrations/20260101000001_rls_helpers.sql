-- helper function to break recursion loop when checking if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM "public"."Users"
    WHERE id = auth.uid() AND role = 'Admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- helper function to check if user is an organization or default (student)
CREATE OR REPLACE FUNCTION is_authorized()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM "public"."Users"
    WHERE id = auth.uid() 
    AND role IN ('Organization', 'Default')
  );
$$ LANGUAGE sql SECURITY DEFINER;