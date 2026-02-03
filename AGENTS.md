# AGENTS.md

Guidelines for agentic coding agents working in this repository.

## Commands

```bash
# Development (Turbopack)
pnpm dev

# Build for production
pnpm build

# Format/lint code
pnpm lint

# Deploy (Prisma generate + build)
pnpm deploy
```

**No test runner configured.** If tests are needed, use Vitest (aligns with Next.js/React ecosystem).

## Architecture

- **Framework:** Next.js 16 + React 19 RC + App Router
- **Compiler:** Turbopack (dev), React Compiler enabled
- **Database:** Prisma ORM (PostgreSQL prod/SQLite dev), better-auth for auth
- **State:** Zustand for client state
- **Styling:** Tailwind CSS v4, shadcn/ui (New York style, neutral base)
- **Format/Lint:** Biome (tabs, double quotes)

## Code Style

### Formatting (Biome)
- **Indent:** Tabs (not spaces)
- **Quotes:** Double quotes
- **Imports:** Auto-organized by Biome
- **Run `pnpm lint` after edits** to auto-format

### Import Order
1. React/Next imports
2. Third-party libraries
3. Absolute imports (`@/*`)

Example:
```ts
import type { Metadata } from "next";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
```

### Naming Conventions
- **Components:** PascalCase (`Button`, `DashboardPage`)
- **Files:** kebab-case (`check-option-card.tsx`)
- **Functions:** camelCase (`addDayInfo`, `useModalStore`)
- **Types/Interfaces:** PascalCase (`ModalState`, `SelectedDayInfo`)

### TypeScript
- **Strict mode enabled** - no implicit any
- Use explicit `type` imports: `import type { Metadata }`
- Prefer `type` over `interface` for object shapes
- Path alias: `@/*` maps to `./src/*`

### Components

**UI Components** (shadcn/ui pattern):
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variants = cva("...", { ... });

function Component({ className, variant, ...props }: Props) {
  return <div className={cn(variants({ variant, className }))} {...props} />;
}
```

**Server Components** (pages):
```tsx
export type PageProps = { searchParams: Promise<{ ... }> };

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  // ...
}
```

### Server Actions
```ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export async function actionName({ param }: { param: Type }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return;
  // ...
  revalidatePath("/app/path", "page");
}
```

### Zustand Stores
```ts
export type StoreState = { ... };
export type StoreActions = { ... };
export type Store = StoreState & StoreActions;

export const useStore = create<Store>((set) => ({ ... }));
```

### Error Handling
- Server actions: Return early if no session, throw for DB errors
- Use `revalidatePath()` after mutations
- `server-only` for server-only utilities

### Styling
- Use `cn()` utility for class merging
- Tailwind CSS v4 with oklch() colors
- CSS variables for theming (`dark:bg-[#121212]`)
- Lucide icons only

## Database

```bash
pnpm dlx prisma generate    # After schema changes
pnpm dlx prisma db push     # Push changes to DB
pnpm dlx prisma studio      # Open GUI
```

## Environment Variables

Type-safe via `src/env.ts`. Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_VERCEL_URL`.

## Route Groups

- `(marketing)/` - Public landing page
- `(app)/app/` - Protected app routes (dashboard, calendar, account)
- `auth/` - Authentication pages

## File Locations

- Components: `src/components/` (UI in `ui/`, app in subdirs)
- Actions: `src/actions/actions.ts`
- Stores: `src/stores/`
- Utils: `src/lib/`
- Hooks: `src/hooks/`
