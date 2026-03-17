# Implementation Specs & Phases (Supabase Driven)

This document details the step-by-step implementation phases for the ACCESS Borrowing System & CMS, specifically tailored for a stack utilizing **Supabase** (PostgreSQL, Auth, and Storage).

---

## Phase 1: Supabase Fundamentals & Authentication Setup

**Goal:** Establish the database schema, storage buckets, and secure the authentication flow using Supabase Auth and RLS.

*   **1.1 Project Initialization:**
    *   Create a new Supabase project.
    *   Initialize the frontend (e.g., Next.js, React) and install `@supabase/supabase-js`.
*   **1.2 Database Schema (Migrations):**
    *   Execute SQL migrations to create the tables defined in the ERD (`Profiles`, `Events`, `Officers`, `Assets`, `BorrowRequests`, `BorrowRequestItems`, `AuditLogs`).
*   **1.3 Supabase Auth Integration:**
    *   Enable Email/Password authentication in Supabase.
    *   Implement user registration (default role: `Pending`) and login flows on the frontend.
    *   Implement the forgot/reset password flow using Supabase's built-in email templates and auth hooks.
*   **1.4 Row Level Security (RLS) Policies:**
    *   **CRITICAL:** Define RLS on the `Profiles` table. 
        *   *Policy 1:* Users can only `SELECT` and `UPDATE` their own row.
        *   *Policy 2:* Users with role `Admin` can `SELECT`, `UPDATE` all rows.
*   **1.5 Admin Role Management Dashboard:**
    *   Create a protected frontend route (`/admin/users`).
    *   Build a data table fetching `Pending` users.
    *   Implement the action to update a user's role to `Organization`.

---

## Phase 2: CMS & Supabase Storage

**Goal:** Build the public-facing Events and Officers showcase, utilizing Supabase Storage for media.

*   **2.1 Storage Bucket Configuration:**
    *   Create a public Supabase Storage bucket named `public-media`.
    *   Define Storage RLS: Public can `SELECT`; only `Admins/Officers` can `INSERT/UPDATE/DELETE`.
*   **2.2 Admin CMS Interfaces:**
    *   Create forms for Admins to add/edit `Events` and `Officers`.
    *   Implement direct-to-Supabase file uploads for images. The form submits the resulting public URL to the respective database table.
*   **2.3 Public Frontend Implementation:**
    *   Build the public landing page fetching data from the `Events` and `Officers` tables.
    *   Implement sorting for Officers based on the `display_order` column.

---

## Phase 3: Asset Inventory & QR Code Integration

**Goal:** Allow Admins to manage physical assets and generate unique, scannable QR codes for each item.

*   **3.1 Asset Management CRUD:**
    *   Create the `/admin/assets` dashboard to list, add, edit, and soft-delete items.
*   **3.2 QR Code Generation:**
    *   Integrate a frontend QR library (e.g., `qrcode.react`).
    *   When an asset is viewed, generate a QR code pointing to a specific URL route: `https://[your-domain]/admin/assets/scan/[asset_id]`.
    *   Implement a "Print Labels" view for Admins to print these codes as stickers.
*   **3.3 QR Scanning Endpoint (Admin Mobile View):**
    *   Build the `/admin/assets/scan/[id]` route. 
    *   This page should be heavily optimized for mobile browsers, displaying the item's current state and offering quick toggle buttons (e.g., "Mark Lost", "Checkout").

---

## Phase 4: The Borrowing Engine (Organizations)

**Goal:** Implement the complex logic for organizations to discover items, check availability, and submit requests with uploaded letters.

*   **4.1 Asset Catalog & Availability Checking:**
    *   Build a catalog view for `Organization` users to browse available assets.
    *   **Core Logic:** Implement a Supabase RPC (Remote Procedure Call) or complex query to check asset availability. The logic must ensure that for a requested date range `[Start, End]`, the asset is NOT linked to any `BorrowRequestItems` belonging to an `Approved` or `Active` request the overlaps that date range.
*   **4.2 Secure File Uploads (Request Letters):**
    *   Create a *private* Supabase Storage bucket named `request-letters`.
    *   Define Storage RLS: Users can `INSERT` (if role is Organization) and `SELECT` their own uploads; Admins can `SELECT` all.
*   **4.3 Checkout Workflow:**
    *   Develop the multi-step form: Select Items -> Choose Dates -> Fill Contact Details -> Upload Letter to `request-letters` bucket -> Submit to `BorrowRequests` table.

---

## Phase 5: Admin Review & Transactional Emails

**Goal:** Complete the borrowing loop by allowing admins to review requests, manage physical handoffs, and send automated email alerts.

*   **5.1 Admin Request Dashboard:**
    *   Build the `/admin/requests` kanban or data table grouped by status (`Pending`, `Approved`, `Active`, `Returned`).
*   **5.2 Secure Letter Viewing:**
    *   When an Admin views a request, use `supabase.storage.from('request-letters').createSignedUrl()` to securely render or download the PDF letter.
*   **5.3 State Transistions & Handoffs:**
    *   Implement the UI buttons for "Approve", "Reject", "Release Items" (physical handoff), and "Mark Returned" (check-in).
*   **5.4 Transactional Email Integration:**
    *   Integrate a service like Resend or SendGrid via edge functions or a separate Node.js backend.
    *   Trigger automated emails to the `Borrower` when an Admin changes the request status to `Approved` or `Rejected`.

---

## Phase 6: Audit Logging & Deployment

**Goal:** Finalize security tracking, testing, and push the application to production.

*   **6.1 Audit Logs (Database Triggers):**
    *   Instead of manually coding audit logs, write Supabase Postgres Triggers that automatically insert a record into the `AuditLogs` table whenever a row in `BorrowRequests` or `Assets` is updated.
*   **6.2 Testing & QA:**
    *   Test RLS policies thoroughly (ensure Orgs cannot see other Orgs' pending requests).
    *   Conduct UAT (User Acceptance Testing) with the ACCESS officers using a staging environment.
*   **6.3 Production Launch:**
    *   Deploy the frontend (e.g., to Vercel or Netlify).
    *   Configure custom domains.
    *   Switch Supabase to production mode (disable direct Postgres connections if necessary, enforce strong passwords).
