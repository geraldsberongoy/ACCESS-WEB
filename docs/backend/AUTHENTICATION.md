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
| `signUpAction` | Registers a new user with email, password, and organization name |
| `signInAction` | Authenticates an existing user and sets session cookies |
| `signOutAction` | Clears the session and redirects to `/auth/login` |
| `forgotPasswordAction` | Lets users request for a reset link via email |
| `resetPasswordAction` | Lets users change their password |

> **Note:** The reset-password page is only accessible via a one-time-use link sent through the user's email.

---

## Components

### `AuthForms.tsx`

Form components used when rendering (registration, login, logout, etc.) pages.

### `LogoutButton.tsx`

A minimal form button that calls the `signOut` server action on submit. Drop it anywhere inside the `(internal)` layout.

### `Navbar.tsx`

Reads the current session from the Supabase browser client on mount. Renders a **Login** link if no session exists, or a **Logout** button if the user is authenticated.

---

## Route Protection (`Proxy.ts`)

Proxy runs on every request and validates the session using the Supabase server client. Unauthenticated users attempting to access internal routes are redirected to `/auth/login`.

```typescript
  // 1. Guard unauthorized password resets
  if (!user && isAuthOnlyRoute) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  // 2. Guard unauthorized users
  if (!user && (isInternalRoute || isAuthOnlyRoute || isAdminRoute)) {
    // TODO: notification "sign in to continue"
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 3. Guard for /admin routes
  if (user && isAdminRoute) {
    if (userRole !== "Admin") {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

```

> **Note:** Route group folders like `(internal)` are filesystem-only and do not appear in the URL. Middleware always checks the actual URL path.

---

## Data Sync: `auth.users` → `public.Users`

When a user signs up, Supabase creates a record in the internal `auth.users` table. A PostgreSQL trigger syncs this to the application-level `public.Users` table, copying over the user's `id`, `email`, and `organization_name` from signup metadata. The user's `role` is hardcoded to `Pending` on creation.

---

## Data Sync: `public.Users.role` → `auth.users.raw_app_meta_data`

When an admin updates a user's `role` in `public.Users`, a second trigger syncs the new role into `auth.users.raw_app_meta_data`. This makes the role available in the JWT so middleware can read it without an extra database query. 

## Email (SMTP)

Confirmation and auth emails are sent via **Resend** over SMTP.

| Setting | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Sender (dev) | `onboarding@resend.dev` |
| Sender (prod) | `noreply@yourdomain.com` (requires verified domain) |

> **Dev note:** `onboarding@resend.dev` is Resend's default sender for testing and does not require a custom domain. For production, add and verify a domain on [resend.com/domains](https://resend.com/domains) and update the sender email in Supabase SMTP settings.

---