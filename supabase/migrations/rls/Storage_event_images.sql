-- Allow public read access to event images
CREATE POLICY "Public can view event images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'access_web_assets'
  AND (name LIKE 'events/%' OR name LIKE 'officers/%')
);

-- Only admins can upload event images
CREATE POLICY "Admins can upload event images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'access_web_assets' 
  AND name LIKE 'events/%' 
  AND is_admin()
);

-- Only admins can update event images
CREATE POLICY "Admins can update event images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'access_web_assets' AND is_admin())
WITH CHECK (
  bucket_id = 'access_web_assets' 
  AND name LIKE 'events/%' 
  AND is_admin()
);

-- Only admins can delete event images
CREATE POLICY "Admins can delete event images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'access_web_assets' 
  AND name LIKE 'events/%' 
  AND is_admin()
);
