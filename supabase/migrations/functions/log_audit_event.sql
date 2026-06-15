-- function for logging, ensures immutability for logs
CREATE OR REPLACE FUNCTION log_audit_event(
    p_action varchar,
    p_entity_type varchar,
    p_entity_id uuid,
    p_state_changes jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER  -- ← runs as the function owner, not the caller
SET search_path = public
AS $$
BEGIN
    INSERT INTO "AuditLogs" (
        id,
        user_id,
        action,
        entity_type,
        entity_id,
        state_changes,
        created_at
    ) VALUES (
        gen_random_uuid(),
        auth.uid(),
        p_action,
        p_entity_type,
        p_entity_id,
        p_state_changes,
        now()
    );
END;
$$;

-- Allow authenticated users to CALL the function
GRANT EXECUTE ON FUNCTION log_audit_event TO authenticated;
REVOKE INSERT, UPDATE, DELETE ON "public"."AuditLogs" FROM authenticated, anon;