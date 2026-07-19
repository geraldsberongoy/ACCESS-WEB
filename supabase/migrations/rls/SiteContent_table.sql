ALTER TABLE "public"."SiteContent" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site content"
    ON "public"."SiteContent"
    FOR SELECT
    TO public
    USING (true)
;

CREATE POLICY "Admins can insert site content"
    ON "public"."SiteContent"
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
;

CREATE POLICY "Admins can update site content"
    ON "public"."SiteContent"
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
;
