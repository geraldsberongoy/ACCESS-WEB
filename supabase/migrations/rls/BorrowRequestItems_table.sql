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