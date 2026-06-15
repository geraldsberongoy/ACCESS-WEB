ALTER TABLE "public"."Officers" ENABLE ROW LEVEL SECURITY;

-- Anon users can see all officers (for landing page display)
CREATE POLICY "Anon users can see all officers"
    ON "public"."Officers"
    FOR SELECT
    TO anon
    USING (true)
;

-- All authenticated users can see all officers
CREATE POLICY "All users can see all officers"
    ON "public"."Officers"
    FOR SELECT
    TO authenticated
    USING (true)
;

-- Only admins can add new officers
CREATE POLICY "Only admins can add new officers"
    ON "public"."Officers"
    FOR INSERT
    TO authenticated    
    WITH CHECK (is_admin())
;

-- Only admins can edit officers
CREATE POLICY "Only admins can update officers"
    ON "public"."Officers"
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
;