-- Create a function that updates the user's app_metadata
CREATE OR REPLACE FUNCTION public.handle_update_user_role()
RETURNS trigger 
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    coalesce(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', new.role)
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer SET search_path = public;

-- Triggers whenever a user is created or their role changes
DROP TRIGGER IF EXISTS on_auth_user_role_update ON public."Users";
CREATE TRIGGER on_auth_user_role_update
  AFTER UPDATE of role ON public."Users"
  FOR each ROW EXECUTE PROCEDURE public.handle_update_user_role();