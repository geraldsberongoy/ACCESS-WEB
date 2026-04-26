# API Endpoints Specification

This document lists the essential RESTful API endpoints required to support the ACCESS Borrowing System, CMS, and Asset Tracking modules.

> [!NOTE]
> All endpoints under `/admin` and `/org` routes require authentication middleware checking the user's role (Admin vs. Organization). All list endpoints support pagination via `?page=1&limit=10` query parameters.

---

## 1. Authentication & Users

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Self-Registration (Role defaults to Pending) | No |
| `POST` | `/api/auth/login` | Log in and receive auth token/session | No |
| `POST` | `/api/auth/logout` | Terminate active user session | Yes |
| `POST` | `/api/auth/forgot-password` | Initiates self-serve password reset email | No |
| `POST` | `/api/auth/reset-password` | Confirms password reset using secure token | No |
| `GET`  | `/api/users/me` | Fetch current authenticated user's profile | Yes |
| `GET`  | `/api/admin/users` | List all users (filterable by `?role=Pending`) | Admin |
| `PATCH`| `/api/admin/users/{uuid}/approve` | Upgrade a Pending user to Organization role | Admin |
| `PATCH`| `/api/admin/users/{uuid}/reject` | Reject/ban an unauthorized registration | Admin |

---

## 2. Public Frontend (CMS)

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/public/events` | List published events (paginated, filterable by `?status=upcoming/past/all`) | No |
| `GET` | `/api/public/events/{uuid}` | Fetch details for a specific published event | No |
| `GET` | `/api/public/officers` | List active officers sorted by `display_order` | No |

---

## 3. Admin CMS Management

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET`  | `/api/admin/events` | List all events (paginated, filterable by `?status=Draft/Published/All`) | Admin |
| `POST` | `/api/admin/events` | Create a new event (status: Draft or Published) | Admin |
| `PUT`  | `/api/admin/events/{uuid}` | Update an existing event | Admin |
| `DELETE`| `/api/admin/events/{uuid}` | Delete an event | Admin |
| `GET`  | `/api/admin/officers` | List all officers (including inactive) | Admin |
| `POST` | `/api/admin/officers` | Create a new officer profile | Admin |
| `PUT`  | `/api/admin/officers/{uuid}` | Update an officer profile | Admin |
| `DELETE`| `/api/admin/officers/{uuid}` | Delete/archive an officer profile | Admin |
| `POST` | `/api/admin/officers/reorder` | Bulk update `display_order` for officers | Admin |

---

## 4. Asset Management (Items & QR)

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET`  | `/api/assets` | List all available assets (catalog view for Orgs) | Org/Admin |
| `GET`  | `/api/assets/{uuid}` | Fetch details of a single asset | Org/Admin |
| `POST` | `/api/admin/assets` | Register a new asset into the system | Admin |
| `PUT`  | `/api/admin/assets/{uuid}` | Update asset details (condition, category, etc.) | Admin |
| `DELETE`| `/api/admin/assets/{uuid}` | Soft-delete an asset (sets `is_deleted = true`) | Admin |
| `GET`  | `/api/admin/assets/scan/{uuid}` | QR scan: Fetch asset history and current state | Admin |

---

## 5. Borrowing Workflow (Organizations)

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `POST` | `/api/org/requests/check-availability` | Verify if assets are free for a given date range | Org |
| `POST` | `/api/org/requests` | Submit borrow request (form data & file URL) | Org |
| `GET`  | `/api/org/requests` | List all requests for the logged-in Org | Org |
| `GET`  | `/api/org/requests/{uuid}` | View details of a specific request | Org |
| `PATCH`| `/api/org/requests/{uuid}/cancel` | Cancel own pending request before review | Org |

---

## 6. Admin Borrowing Review

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| `GET`  | `/api/admin/requests` | List all requests (filterable: `?status=Pending`) | Admin |
| `GET`  | `/api/admin/requests/{uuid}` | View full request details incl. uploaded letter | Admin |
| `PATCH`| `/api/admin/requests/{uuid}/approve` | Approve request; triggers email notification | Admin |
| `PATCH`| `/api/admin/requests/{uuid}/reject` | Reject request with reason; triggers email | Admin |
| `PATCH`| `/api/admin/requests/{uuid}/release` | Physical Handoff: Mark items as Borrowed | Admin |
| `PATCH`| `/api/admin/requests/{uuid}/return` | Check-in: Mark items as Returned | Admin |

---

## 7. Storage (Supabase)

> [!TIP]
> File uploads go directly from the client to Supabase Storage, bypassing your API server for better performance.

| Flow | Supabase Call | Purpose |
| --- | --- | --- |
| Client → Supabase | `storage.from('public-media').upload()` | Admin uploads Event/Officer images. Returns Public URL. |
| Client → Supabase | `storage.from('request-letters').upload()` | Org uploads PDF letter. Returns private path. |
| API → Supabase | `storage.from('request-letters').createSignedUrl()` | Admin views private letter via temporary secure link. |
