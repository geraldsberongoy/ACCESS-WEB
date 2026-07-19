-- Allow PDF and document uploads in access_web_assets (officers roster, borrow letters, etc.)
-- Uses UPDATE only to avoid storage.buckets INSERT RLS errors in the SQL editor.
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
