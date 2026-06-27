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