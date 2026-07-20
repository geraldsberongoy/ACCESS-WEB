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
USING (bucket_id = 'access_web_assets' AND name LIKE 'site-content/%' AND is_admin())
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
