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


ALTER TABLE "public"."BorrowRequestItems" ENABLE ROW LEVEL SECURITY;

-- Default and Org users can see items belonging to their own requests
CREATE POLICY "Users can select their own request items"
    ON "public"."BorrowRequestItems"
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM "public"."BorrowRequests" br
            WHERE br.id = borrow_request_id
            AND br.user_id = auth.uid()
        )
    )
;

-- Default and Org users can only add items to their own PENDING requests
CREATE POLICY "Users can insert items into their own pending requests"
    ON "public"."BorrowRequestItems"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "public"."BorrowRequests" br
            WHERE br.id = borrow_request_id
            -- Ensures the parent request belongs to the person logged in
            AND br.user_id = auth.uid()
            -- Ensures they can only edit pending requests
            AND br.status = 'Pending'
        )
    )
;

-- Admins can insert items into any request regardless of status
CREATE POLICY "Admins can insert into any request"
    ON "public"."BorrowRequestItems"
    FOR INSERT
    TO authenticated
    WITH CHECK (is_admin())
;

-- Admins can see all request items
CREATE POLICY "Admins can select all request items"
    ON "public"."BorrowRequestItems"
    FOR SELECT
    TO authenticated
    USING (is_admin())
;

-- Nobody can UPDATE rows in this table — you add or remove items, never edit them
CREATE POLICY "No updates allowed on request items"
    ON "public"."BorrowRequestItems"
    AS RESTRICTIVE
    FOR UPDATE
    TO authenticated
    USING (false)
;

-- No deletes allowed
CREATE POLICY "No deletes allowed"
    ON "public"."BorrowRequestItems"
    AS RESTRICTIVE
    FOR DELETE
    TO authenticated
    USING (false)
;


ALTER TABLE "public"."BorrowRequests" ENABLE ROW LEVEL SECURITY;

-- Authorized user can create requests
CREATE POLICY "Orgs can create borrow requests"
    ON "public"."BorrowRequests"
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND is_authorized()
    )
;

-- Authorized user can view their own requests, Admins can view all
CREATE POLICY "Authorized user can view own requests, Admins can view all"
    ON "public"."BorrowRequests"
    FOR SELECT
    TO authenticated
    USING (
        (auth.uid() = user_id AND is_authorized())
        OR is_admin()
    )
;

-- Authorized user can only patch status to 'Cancelled' on their own 'Pending' requests
CREATE POLICY "Authorized user can cancel own requests"
    ON "public"."BorrowRequests"
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = user_id
        AND is_authorized()
        AND status = 'Pending'
    )
    WITH CHECK (
        auth.uid() = user_id
        AND is_authorized()
        AND status = 'Cancelled'
    )
;

-- Admins can edit requests
CREATE POLICY "Admins can review borrow requests"
    ON "public"."BorrowRequests"
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (
        is_admin())
;


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


ALTER TABLE "public"."Users" ENABLE ROW LEVEL SECURITY;

-- Users can see their own information
CREATE POLICY "Users can select their own row"
    ON "public"."Users"
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id)
;

-- Users can update their own information except their role
CREATE POLICY "Users can update their own row"
    ON "public"."Users"
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id AND role != 'Pending')
    WITH CHECK (
        auth.uid() = id
        AND
        -- prevent updates in the role column --
        role = (SELECT role FROM "public"."Users" WHERE id = auth.uid())
    )
;

-- Admins can see all user data
CREATE POLICY "Admins can select ALL user data"
    ON "public"."Users"
    FOR SELECT
    TO authenticated
    USING (is_admin())
;

-- Admins can update all user data
CREATE POLICY "Admins can UPDATE ALL user data"
    ON "public"."Users"
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (
        is_admin() 
        AND (
            -- prevent self demotion
            (auth.uid() = id AND role = 'Admin')
            OR
            -- anything goes if updating someone else
            auth.uid() != id
        )
    )
;
