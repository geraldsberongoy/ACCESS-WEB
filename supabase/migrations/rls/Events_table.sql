ALTER TABLE "public"."Events" ENABLE ROW LEVEL SECURITY;

-- Unauthenticated (anon) users can only see Published events
CREATE POLICY "Public can select published events"
    ON "public"."Events"
    FOR SELECT
    TO anon
    USING (status = 'Published')
;

-- Authenticated non-Admin users can only see Published events
CREATE POLICY "Authenticated users can select published events"
    ON "public"."Events"
    FOR SELECT
    TO authenticated
    USING (status = 'Published')
;

-- Admins can see everything including drafts
CREATE POLICY "Admins can select all events"
    ON "public"."Events"
    FOR SELECT
    TO authenticated
    USING (is_admin())
;

-- Only Admins can create events
CREATE POLICY "Admins can insert events"
    ON "public"."Events"
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
;

-- Only Admins can update events
CREATE POLICY "Admins can update events"
    ON "public"."Events"
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
;

-- Only Admins can delete events
CREATE POLICY "Admins can delete events"
    ON "public"."Events"
    FOR DELETE
    TO authenticated
    USING (is_admin())
;