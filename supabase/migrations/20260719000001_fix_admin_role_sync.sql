-- Fix admin role sync + verify is_admin() for CMS RLS policies.
-- Run in Supabase SQL Editor if CMS writes fail with RLS errors.

-- 1) Ensure helper exists and is callable
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public."Users"
    WHERE id = auth.uid()
      AND role = 'Admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- 2) Promote your admin account (change email if needed)
UPDATE public."Users"
SET role = 'Admin', updated_at = now()
WHERE email = 'admin@gmail.com';

-- 3) Sync auth metadata from public.Users role
UPDATE auth.users au
SET raw_app_meta_data =
  coalesce(au.raw_app_meta_data, '{}'::jsonb) ||
  jsonb_build_object('role', u.role)
FROM public."Users" u
WHERE au.id = u.id
  AND u.email = 'admin@gmail.com';

-- 4) Verify
SELECT u.email, u.role, au.raw_app_meta_data->>'role' AS app_role
FROM public."Users" u
JOIN auth.users au ON au.id = u.id
WHERE u.email = 'admin@gmail.com';
