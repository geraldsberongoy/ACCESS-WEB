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
