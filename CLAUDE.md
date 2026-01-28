# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm deploy       # Generate Prisma client + build (for deployment)
```

### Database (Prisma)

```bash
pnpm dlx prisma generate    # Generate Prisma client after schema changes
pnpm dlx prisma db push     # Push schema changes to database
pnpm dlx prisma studio      # Open Prisma Studio GUI
```

## Architecture

### Tech Stack

- **Next.js 15** with App Router and Turbopack
- **React 19 RC** with React Compiler enabled
- **Prisma** with PostgreSQL (production) / SQLite (development toggle in schema)
- **better-auth** for authentication (email OTP + Google OAuth)
- **Tailwind CSS v4** with shadcn/ui components
- **Zustand** for client-side state
- **Biome** for formatting/linting (tabs, double quotes)

### Route Groups

- `(marketing)/` - Landing page, public routes
- `(app)/app/` - Protected application routes (dashboard, calendar, account)
- `auth/` - Authentication pages (sign-in with OTP)

### Key Patterns

**Server Actions**: All mutations are in `src/actions/actions.ts` - handles creating/updating GymCheck and CheatMeal records with session validation.

**Auth Flow**: Proxy (`src/proxy.ts`) protects `/app` and `/setup` routes. Uses `better-auth` with email OTP verification via Resend.

**Modal State**: Global modal state managed via Zustand stores in `src/stores/` (e.g., `day-info-modal.ts` for calendar day editing).

**Environment Variables**: Type-safe env via `@t3-oss/env-nextjs` in `src/env.ts`. Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_VERCEL_URL`.

**UI Components**: shadcn/ui components in `src/components/ui/`, app-specific components in `src/components/`.

### Data Model

- **User** - Has many GymChecks and CheatMeals
- **GymCheck** - Workout log with date and description
- **CheatMeal** - Cheat meal log with date and name
