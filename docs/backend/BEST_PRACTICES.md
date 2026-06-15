# System Architecture: Suggestions & Best Practices

Based on the requirements provided, here are some critiques, suggestions, and architectural best practices to ensure the ACCESS system is secure, scalable, and highly maintainable over time.

## 1. Authentication & Security
- **Self-Registration with Admin Approval**: Allowing users to create their own accounts reduces administrative overhead. However, ensure that new accounts default to a restricted role (e.g., "Pending") and require explicit admin approval/role upgrade before they can interact with the borrowing system.
- **Role Dashboard**: Provide admins with a clear dashboard to review pending registrations, verifying the user's organization before granting the "Organization" role.
- **Self-Serve Account Retrieval**: Implement a secure, self-serve password reset flow. When a user forgets their password, they should be able to trigger an email containing a secure, time-limited token link. *Sending passwords in plain text is a severe security vulnerability.*

## 2. Asset & QR Code Strategy
- **Unique Item Instances**: If you have 20 folding chairs, they should exist as 20 distinct records in the `Assets` table, not as 1 record with a quantity of 20. This allows each chair to have a unique QR code, condition rating, and tracking history.
- **QR Code Routing**: The QR code data should simply be a URL back to your application, such as `https://access.cea/admin/assets/scan/{uuid}`.
  - When an admin scans it with their phone camera, it opens their browser. 
  - If they are logged in, it instantly shows the asset's current state (e.g., "Reserved by Computer Science Society") and offers one-tap action buttons (e.g., "Mark as Picked Up", "Mark as Returned", "Report Damage").

## 3. Handling Borrowing & Availability Conflicts
- **Date Range Overlaps**: When a user selects a date range for items, the backend MUST validate that the `Assets` won't be in a `Reserved`, `Borrowed`, or `Maintenance` state during that time.
- **Database Constraints**: Use robust querying to check availability. *Example logic: An asset is available if it has NO overlapping approved/active borrow requests for the requested start and end dates.*

## 4. File Uploads (Request Letters)
- **Supabase Storage**: Use Supabase Storage with two buckets: a `public-media` bucket for Event posters and Officer photos, and a `request-letters` private bucket for uploaded PDF letters. Never store files directly in the database.
- **Database Reference**: Only save the URL/path to the file in your `BorrowRequests` table (`letter_file_url`). Use `createSignedUrl()` for secure, time-limited access to private letters.

## 5. UI/UX Considerations
- **Dynamic Carts**: Treat the item selection process like an eCommerce "Shopping Cart". Users add items to their cart, verify their cart, then "checkout" by providing their dates, specific contact info (Name, Number), and uploading the letter.
- **Responsive Tables/Dashboards**: Ensure the Admin dashboard is highly responsive. Admins might be using tablets or phones while navigating the storage room to release items.

## 6. Email Delivery
- **Transactional Service**: Use a dedicated transactional email service provider (like Resend, SendGrid, Amazon SES, or Postmark) rather than a standard SMTP relay (like Gmail). This prevents emails from landing in spam folders and provides tracking for "Delivered" and "Opened" states.

## 7. Audit & Accountability
- **Audit Logs**: Maintain an `AuditLogs` table. If a projector goes missing, the Admin should be able to view the precise history of who borrowed it, who approved it, and when it was marked returned.
- **Soft Deletes**: If an Asset is broken and thrown away, use a "Soft Delete" strategy (e.g., marking an `is_deleted` flag as true) rather than hard-deleting the row. This preserves the history of old borrow requests that included that asset.
