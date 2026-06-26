# Database Migrations

This project uses the Supabase CLI to manage database migrations.

## Prerequisites

- Supabase CLI installed (`pnpm install supabase --save-dev`)
- Linked to the remote project (`pnpm supabase link --project-ref <project-ref>`)

## Migration files

Migrations live in `supabase/migrations/` as timestamped SQL files applied in order:

| File | Description |
|---|---|
| `20260101000000_initial_schema.sql` | All table definitions |
| `20260101000001_rls_helpers.sql` | RLS helper functions (`is_admin`, `is_authorized`) |
| `20260101000002_rls_policies.sql` | Row Level Security policies per table |
| `20260101000003_functions.sql` | Database functions and triggers |
| `20260426000000_set_events_id_default.sql` | Set default ID sequence for Events table |

## Workflow

### Creating a new migration

```bash
pnpm supabase migration new <migration_name>
```

Write your SQL in the generated file under `supabase/migrations/`, then push:

```bash
pnpm supabase db push
```

### Checking migration status

```bash
pnpm supabase migration list
```

### Regenerating TypeScript types after schema changes

```bash
pnpm supabase gen types typescript --linked > src/lib/supabase/database.types.ts
```

## Notes

- Never edit existing migration files that have already been applied — create a new migration instead
- Always regenerate Typescript types after pushing schema changes to keep `database.types.ts` in sync