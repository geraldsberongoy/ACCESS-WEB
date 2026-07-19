ALTER TABLE "public"."ContactMessages" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
    ON "public"."ContactMessages"
    FOR INSERT
    TO public
    WITH CHECK (true)
;

CREATE POLICY "Admins can read contact messages"
    ON "public"."ContactMessages"
    FOR SELECT
    TO authenticated
    USING (is_admin())
;

CREATE POLICY "Admins can update contact messages"
    ON "public"."ContactMessages"
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
;
