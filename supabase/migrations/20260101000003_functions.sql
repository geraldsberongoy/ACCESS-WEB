create or replace function get_server_time()
returns timestamptz
language sql
stable
as $$
  select now();
$$;


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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth."users";
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


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


-- function for logging, ensures immutability for logs
CREATE OR REPLACE FUNCTION log_audit_event(
    p_action varchar,
    p_entity_type varchar,
    p_entity_id uuid,
    p_state_changes jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  -- ← runs as the function owner, not the caller
SET search_path = public
AS $$
BEGIN
    INSERT INTO "AuditLogs" (
        id,
        user_id,
        action,
        entity_type,
        entity_id,
        state_changes,
        created_at
    ) VALUES (
        gen_random_uuid(),
        auth.uid(),
        p_action,
        p_entity_type,
        p_entity_id,
        p_state_changes,
        now()
    );
END;
$$;

-- Allow authenticated users to CALL the function
GRANT EXECUTE ON FUNCTION log_audit_event TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON "public"."AuditLogs" FROM authenticated, anon;