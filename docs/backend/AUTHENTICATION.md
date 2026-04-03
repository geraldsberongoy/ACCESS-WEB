# Authentication

## Overview

ACCESS-WEB uses Supabase Auth with email/password authentication. On signup, users receive a confirmation email via Resend (SMTP) before gaining access. Authenticated sessions are managed via cookies and validated on every request through middleware.

---

## Folder Structure

```
src/
├── app/
│   ├── (marketing)/
│   │   └── auth/
│   │       ├── login/
│   │       │   └── page.tsx          # Renders AuthForms in login mode
│   │       └── register/
│   │           └── page.tsx          # Renders AuthForms in register mode
│   └── (internal)/
│       └── admin/                    # Protected — requires authenticated session
│           └── dashboard/
│               └── page.tsx          
├── features/
│   └── auth/
│       ├── actions/
│       │   └── auth.actions.ts       # signIn, signUp, signOut server actions
│       └── components/
│           ├── AuthForms.tsx         # Toggleable sign-in / sign-up form
│           └── LogoutButton.tsx      # Calls signOut action on submit
├── components/
│   └── ui/
│       └── Navbar.tsx                # Shows Login link or Logout button based on session
├── lib/
│   └── supabase/
│       ├── browser-client.ts         # Singleton Supabase client for client components
│       └── server-client.ts          # Per-request Supabase client for server components
proxy.ts                              # Middleware — protects internal routes
supabase/
└── migrations/
    └── functions/
        └── handle_new_user.sql       # Trigger to sync auth.users → public.Users
```

---

## Supabase Clients

Two separate clients are used depending on the rendering context.

### 1. Browser Client (`src/lib/supabase/browser-client.ts`)

Used in client components (`"use client"`). Implements a singleton pattern to avoid creating multiple connections across re-renders.

```typescript
export function getSupabaseBrowserClient(): SupabaseClient
```

### 2. Server Client (`src/lib/supabase/server-client.ts`)

Used in server components, server actions, and route handlers. Creates a fresh client per request, reading the session from Next.js cookies.

```typescript
export async function createSupabaseServerClient(): Promise<SupabaseClient>
```

| | Browser Client | Server Client |
|---|---|---|
| Context | Client components | Server components, actions, middleware |
| Instance | Singleton | New per request |
| Session source | Cookies (auto) | Reads from Next.js `cookies()` |
| Can set cookies | Yes | Only in middleware / route handlers |

---

## Auth Actions (`src/features/auth/actions/auth.actions.ts`)

Server actions handling all auth operations.

| Action | Description |
|---|---|
| `signUp` | Registers a new user with email, password, and organization name |
| `signIn` | Authenticates an existing user and sets session cookies |
| `signOut` | Clears the session and redirects to `/auth/login` |

---

## Components

### `AuthForms.tsx`

A single form component that toggles between sign-in and sign-up mode using `useState`. Rendered by both `/auth/login` and `/auth/register` pages.

### `LogoutButton.tsx`

A minimal form button that calls the `signOut` server action on submit. Drop it anywhere inside the `(internal)` layout.

### `Navbar.tsx`

Reads the current session from the Supabase browser client on mount. Renders a **Login** link if no session exists, or a **Logout** button if the user is authenticated.

---

## Route Protection (`proxy.ts`)

Middleware runs on every request and validates the session using the Supabase server client. Unauthenticated users attempting to access internal routes are redirected to `/auth/login`.

```typescript
const internalRoutes = ["/dashboard", "/admin", ...];
const isInternalRoute = internalRoutes.some(route =>
  request.nextUrl.pathname.startsWith(route)
);

if (!user && isInternalRoute) {
  return NextResponse.redirect(new URL("/auth/login", request.url));
}
```

> **Note:** Route group folders like `(internal)` are filesystem-only and do not appear in the URL. Middleware always checks the actual URL path.

---

## Data Sync: `auth.users` → `public.Users`

When a user signs up, Supabase creates a record in the internal `auth.users` table. A PostgreSQL trigger syncs this to the application-level `public.Users` table.

### Function

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."Users" (id, email, organization_name, role, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    (new.raw_user_meta_data->>'organization_name'),
    'Pending',
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### Trigger

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Field Mapping

| `public.Users` field | Source |
|---|---|
| `id` | `auth.users.id` |
| `email` | `auth.users.email` |
| `organization_name` | `auth.users.raw_user_meta_data->>'organization_name'` |
| `role` | Hardcoded `'Pending'` on signup |
| `created_at` | `now()` |
| `updated_at` | `now()` |

---

## Email (SMTP)

Confirmation and auth emails are sent via **Resend** over SMTP.

| Setting | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Sender (dev) | `onboarding@resend.dev` |
| Sender (prod) | `noreply@yourdomain.com` (requires verified domain) |

> **Dev note:** `onboarding@resend.dev` is Resend's default sender for testing and does not require a custom domain. For production, add and verify your domain on [resend.com/domains](https://resend.com/domains) and update the sender email in Supabase SMTP settings.

---