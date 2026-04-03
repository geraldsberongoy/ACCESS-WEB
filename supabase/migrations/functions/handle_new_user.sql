-- handles data transfer from Auth metadata to public.Users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."Users" (id, email, organization_name, role, created_at, updated_at)
  VALUES (
    new.id, 
    new.email, 
    (new.raw_user_meta_data->>'organization_name'),
    'Pending', -- Default role for new signups
    now(), 
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- run the function for every insert in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();