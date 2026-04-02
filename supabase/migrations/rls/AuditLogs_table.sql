ALTER TABLE "public"."AuditLogs" ENABLE ROW LEVEL SECURITY;

-- Block anon entirely
CREATE POLICY "No anon access"
    ON "public"."AuditLogs"
    AS RESTRICTIVE
    FOR ALL
    TO anon
    USING (false)
;

-- Users can only see logs where they were the actor
CREATE POLICY "Authenticated users can select their own audit logs"
    ON "public"."AuditLogs"
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id)
;

-- Admins can see everything
CREATE POLICY "Admins can select all audit logs"
    ON "public"."AuditLogs"
    FOR SELECT
    TO authenticated
    USING (is_admin())
;

-- Explicitly block direct INSERT from any client role
-- NOTE: Ensure that the audit log writer uses the function log_audit_event
CREATE POLICY "No direct inserts allowed"
    ON "public"."AuditLogs"
    AS RESTRICTIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (false)
;

-- No one can UPDATE audit logs — they are immutable
CREATE POLICY "No updates allowed on audit logs"
    ON "public"."AuditLogs"
    AS RESTRICTIVE
    FOR UPDATE
    TO authenticated
    USING (false)
;

-- No one can DELETE audit logs
CREATE POLICY "No deletes allowed on audit logs"
    ON "public"."AuditLogs"
    AS RESTRICTIVE
    FOR DELETE
    TO authenticated
    USING (false)
;
