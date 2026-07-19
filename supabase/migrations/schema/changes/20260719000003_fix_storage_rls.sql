-- Fix storage RLS for CMS uploads and borrow letters.
-- Run in Supabase SQL Editor if uploads fail with "row-level security policy".

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

CREATE OR REPLACE FUNCTION public.is_authorized()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public."Users"
    WHERE id = auth.uid()
      AND role IN ('Organization', 'Default')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_authorized() TO authenticated;

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]::text[]
WHERE id = 'access_web_assets';

DROP POLICY IF EXISTS "Public can view site content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload site content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload borrow letters" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own borrow letters" ON storage.objects;

CREATE POLICY "Public can view site content images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'access_web_assets'
  AND name LIKE 'site-content/%'
);

CREATE POLICY "Admins can upload site content images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'access_web_assets'
  AND name LIKE 'site-content/%'
  AND is_admin()
);

CREATE POLICY "Admins can update site content images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'access_web_assets'
  AND name LIKE 'site-content/%'
  AND is_admin()
)
WITH CHECK (
  bucket_id = 'access_web_assets'
  AND name LIKE 'site-content/%'
  AND is_admin()
);

CREATE POLICY "Admins can delete site content images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'access_web_assets'
  AND name LIKE 'site-content/%'
  AND is_admin()
);

CREATE POLICY "Authenticated users can upload borrow letters"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'access_web_assets'
  AND name LIKE 'borrow-letters/%'
  AND is_authorized()
);

CREATE POLICY "Users can view own borrow letters"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'access_web_assets'
  AND name LIKE 'borrow-letters/%'
  AND (
    is_admin()
    OR (storage.foldername(name))[1] = auth.uid()::text
  )
);
