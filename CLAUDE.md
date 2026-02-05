# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Build for production
pnpm lint         # Run Biome format --write (NOT ESLint)
pnpm deploy       # Generate Prisma client + build (for deployment)
```

### Database (Prisma)

```bash
pnpm dlx prisma generate    # Generate Prisma client after schema changes
pnpm dlx prisma db push     # Push schema changes to database
pnpm dlx prisma studio      # Open Prisma Studio GUI
```

No test runner configured.

## Code Style (Biome)

- **Tabs** (not spaces), **double quotes**
- Imports auto-organized by Biome — run `pnpm lint` after edits
- Use explicit `import type` for type-only imports
- Path alias: `@/*` → `./src/*`

## Architecture

### Tech Stack

- **Next.js 16** with App Router and Turbopack
- **React 19 RC** with React Compiler enabled
- **Prisma** with PostgreSQL (production) / SQLite (development toggle in schema)
- **better-auth** for authentication (email OTP via Resend)
- **Tailwind CSS v4** with shadcn/ui components (New York style, Lucide icons)
- **Zustand** for client-side state, **React Query** (60s stale time)
- **Biome** for formatting/linting

### Route Groups

- `(marketing)/` - Landing page, public routes
- `(app)/app/` - Protected application routes (dashboard, calendar, account)
- `(app)/setup/` - First-time user setup
- `auth/` - Authentication pages (sign-in with OTP)

### Key Patterns

**Server Actions**: Mutations split across `src/actions/actions.ts` (GymCheck/CheatMeal CRUD) and `src/actions/preset-actions.ts` (workout/meal preset management). All validate session via `auth.api.getSession({ headers: await headers() })` and call `revalidatePath()` after mutations.

**Server Data Fetching**: Cached queries in `src/lib/server-utils.ts` using React's `cache()`. Provides grouped-by-month data, streaks, and latest entries. Redirects to sign-in if unauthenticated.

**Auth Flow**: Middleware in `src/proxy.ts` protects `/app/*` and `/setup/*` routes using `getSessionCookie()`. Redirects authenticated users away from `/auth/*`.

**Modal State**: Zustand stores in `src/stores/` manage modal state (day editing, delete confirmation).

**Environment Variables**: Type-safe env via `@t3-oss/env-nextjs` in `src/env.ts`. Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY`, `NEXT_PUBLIC_VERCEL_URL`.

### Data Model

- **User** → has many GymChecks, CheatMeals, WorkoutPresets, CheatMealPresets
- **GymCheck** - Workout log (date, description, presetId)
- **CheatMeal** - Cheat meal log (date, name, presetId)
- **WorkoutPreset / CheatMealPreset** - User-defined templates (label, color, order)
