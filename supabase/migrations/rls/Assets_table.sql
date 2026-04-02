ALTER TABLE "public"."Assets" ENABLE ROW LEVEL SECURITY;

-- All authenticated users can see non-deleted assets
CREATE POLICY "All users can view active assets"
    ON "public"."Assets"
    FOR SELECT
    TO authenticated
    USING (true)
;

-- Hide deleted assets from non-admin users 
CREATE POLICY "Hide soft deleted assets for non-admin users"
    ON "public"."Assets"
    AS RESTRICTIVE
    FOR SELECT
    TO authenticated
    USING (is_deleted = false OR is_admin())
;

-- Only admins can add new assets
CREATE POLICY "Only admins can create assets"
    ON "public"."Assets"
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin() AND is_deleted = false)
;

-- Only admins can edit or "soft delete" assets
CREATE POLICY "Only admins can update assets"
    ON "public"."Assets"
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
;