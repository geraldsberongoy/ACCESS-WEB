-- helper function to check if user is an organization or default (student)
CREATE OR REPLACE FUNCTION is_authorized()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM "public"."Users"
    WHERE id = auth.uid() 
    AND role IN ('Organization', 'Default')
  );
$$ LANGUAGE sql SECURITY DEFINER;