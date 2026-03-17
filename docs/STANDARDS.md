# Coding Standards

To maintain a clean and consistent codebase, please adhere to the following standards.

## General

- **Language**: Use TypeScript for all JavaScript code. Avoid `any` types whenever possible.
- **Formatting**: We use Prettier. Ensure your editor is configured to format on save, or run `pnpm format` before committing.
- **Linting**: We use ESLint. Fix all warnings and errors before pushing.

## React / Next.js

- **Functional Components**: Use functional components with hooks.
- **Naming**:
  - Components: PascalCase (e.g., `AssetCard.tsx`)
  - Hooks: camelCase starting with use (e.g., `useAuth.ts`)
  - Utilities: camelCase (e.g., `formatDate.ts`)
- **Server Components**: By default, components in the `app` directory are Server Components. Use `"use client"` directive only when necessary (e.g., for interactivity, `useState`, `useEffect`).

## Styling (Tailwind CSS)

- **Utility First**: Use Tailwind utility classes for styling. Avoid custom CSS files unless absolutely necessary for complex animations.
- **Consistency**: Follow the design tokens defined in `tailwind.config.ts`.
- **Organization**: Group related classes logically or use a tool like `prettier-plugin-tailwindcss` to sort them automatically.

Example:

```tsx
// Good
<button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
  Submit
</button>

// Bad (Inline styles)
<button style={{ backgroundColor: 'blue', color: 'white' }}>
  Submit
</button>
```

## State Management

- **Local State**: Use `useState` for simple component-local state.
- **URL State**: Use query parameters for shareable state (e.g., search filters, pagination).
- **Server State**: Use libraries like `swr` or `tanstack-query` (if introduced) or Next.js data fetching for server data.
- **Global State**: Use Context API sparingly for truly global data (e.g., Theme, Auth Session).

## Project Structure

Keep related files together.

- **`src/app/`**: Route entrypoints, layouts, metadata, and route handlers only. Keep page files thin.
- **`src/features/<feature>/components`**: Domain-aware UI that belongs to a specific feature such as landing, officers, or events.
- **`src/components/ui`**: Shared, reusable UI primitives with no business/domain ownership.
- **`src/lib/`**: Shared infrastructure and generic helpers.
- **`src/configs/`**: Centralized configuration modules.
- **`src/providers/`**: Application providers and composition wrappers.
- **`src/utils/`**: Generic helper functions that are not feature-owned.
- **`types/`**: Cross-feature types only. Keep feature-local types inside the feature folder.

### Placement Rules

- If a component can be reused across unrelated pages without knowing domain context, place it in `src/components/ui`.
- If a component knows about a specific business area or page experience, place it under `src/features/<feature>/`.
- If a helper is generic and stateless, place it under `src/utils/` or `src/lib/` depending on whether it is app infrastructure.
- If a file is only used by one route, prefer colocating it with that route's feature rather than promoting it to a global folder.

### Migration Rule

Existing files may still use the older layout. Do not move files just for appearance. Move them when:

- You are already making meaningful changes in that area.
- The move reduces confusion or duplicated logic.
- Import churn remains small and reviewable.
