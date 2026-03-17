# Architecture Overview

## Technology Stack

The ACCESS Web Portal is built using modern web technologies to ensure scalability, security, and performance.

### Core Frameworks

- **Frontend**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend & Database

- **Backend Logic**: Next.js Server Actions & API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (with RBAC)

---

## High-Level Architecture

### Directory Structure (Target)

```
/
├── src/
│   ├── app/                       # Next.js App Router entrypoints only
│   │   ├── (marketing)/           # Public-facing routes
│   │   ├── (internal)/            # Internal/test/admin route groups
│   │   ├── api/                   # Route handlers / webhooks
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── features/                  # Business/domain slices
│   │   ├── landing/
│   │   ├── events/
│   │   ├── officers/
│   │   └── effects/
│   ├── components/
│   │   └── ui/                    # Shared design-system primitives only
│   ├── lib/                       # Shared infrastructure and generic helpers
│   ├── configs/                   # App configuration modules
│   ├── providers/                 # React providers and composition wrappers
│   └── utils/                     # Generic utility helpers
├── public/                        # Static assets (images, icons, models)
├── docs/
└── supabase/
```

## File Organization Principles

The codebase should follow a feature-first structure.

1. Keep route files in `src/app/` thin. A page should compose feature components, not hold large blocks of presentation logic.
2. Put domain-aware code in `src/features/`. If a component knows about officers, events, contributors, or landing-page sections, it belongs to a feature folder.
3. Reserve `src/components/ui/` for shared primitives only. Buttons, cards, layout shells, and generic navigation belong here. Business-specific cards do not.
4. Use `src/lib/` for shared infrastructure and generic helpers, not for feature logic.
5. Use top-level `types/` only for types shared across multiple features. Feature-local types should stay with their feature.

## Migration Notes

This structure is the target architecture and may not match every existing file yet.

- New code should follow the target structure immediately.
- When touching older files, prefer moving them toward the target structure if the change is already substantial.
- Avoid large purely cosmetic moves unless they reduce real maintenance cost or are bundled with related work.

## Current Migration Targets

The current repository has a few categories of files that should be migrated over time:

- Landing page sections now live under `src/features/landing/components/`.
- Domain cards such as `OfficerCard` and `EventCard` live in their respective feature folders.
- Visual-effect components such as `FloatingBlocks` and `CrystalDice3D` live under `src/features/effects/components/`.
- Shared UI in `src/components/ui/` should stay generic and reusable across unrelated routes.

## Data Flow

1.  **Frontend**: User interacts with the UI (e.g., submitting an asset borrowing request).
2.  **Server Action**: The form submission triggers a Server Action secure function.
3.  **Supabase**: The Server Action interacts with Supabase using the Service Role or User Client.
    - **RBAC Check**: Middlewares or Row Level Security (RLS) policies verify the user's role (Super Admin, Officer, Student).
4.  **Database**: Data is written to the PostgreSQL database.
5.  **Response**: The UI updates to reflect the success or failure of the operation.

## Role-Based Access Control (RBAC)

Permission levels are implemented via Supabase Custom Claims or a `profiles` table role column.

| Role            | Access Level                                                |
| :-------------- | :---------------------------------------------------------- |
| **Super Admin** | Full access to directory, asset management, and user roles. |
| **Officer**     | limited management of assets and directory data.            |
| **Student**     | Read-only directory access, can request assets.             |

## Deployment

- **Hosting**: Vercel (recommended for Next.js) or similar platform.
- **CI/CD**: GitHub Actions for automated testing and preview deployments.
