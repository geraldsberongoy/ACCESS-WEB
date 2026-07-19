ALTER TABLE "public"."FAQItems" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active faqs"
    ON "public"."FAQItems"
    FOR SELECT
    TO public
    USING (is_active = true)
;

CREATE POLICY "Admins can read all faqs"
    ON "public"."FAQItems"
    FOR SELECT
    TO authenticated
    USING (is_admin())
;

CREATE POLICY "Admins can insert faqs"
    ON "public"."FAQItems"
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
;

CREATE POLICY "Admins can update faqs"
    ON "public"."FAQItems"
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin())
;

CREATE POLICY "Admins can delete faqs"
    ON "public"."FAQItems"
    FOR DELETE
    TO authenticated
    USING (is_admin())
;
