# Project Setup: What I Found

Here's what's in your project at `/tmp/eval-projects/nextjs-app`.

## Stack

- **Next.js 14.2** — App Router
- **React 18** with Server Components and Client Components
- **Supabase** (`@supabase/supabase-js`) as the data layer
- **TypeScript**, **Zod** for validation, **Vitest** for testing, **ESLint**

## Architecture Pattern

The app uses the Next.js App Router pattern:

- `src/app/page.tsx` — async Server Component that fetches tasks from Supabase directly
- `src/components/TaskList.tsx` — Client Component (`'use client'`) that handles interactivity
- Server Actions are used for mutations (`toggleTask`, `deleteTask` imported from `@/app/actions`)

## What's Already There

| File | Purpose |
|---|---|
| `src/lib/types.ts` | `Task` interface (id, title, completed, created_at, user_id) |
| `src/components/TaskList.tsx` | Renders task list with checkbox toggle and delete |
| `src/app/page.tsx` | Home page — fetches all tasks ordered by `created_at` |

## What's Missing (Referenced But Not Present)

- `src/lib/supabase/server.ts` — imported in `page.tsx` as `@/lib/supabase/server`, file does not exist
- `src/app/actions.ts` — imported in `TaskList.tsx` for `toggleTask` and `deleteTask`, file does not exist
- `docs/ai/` directory and all 6 files referenced in `AGENTS.md` (PRODUCT.md, ROADMAP.md, CONVENTIONS.md, PATTERNS.md, TESTING.md, ARCHITECTURE.md)

## What Needs to Be Filled

`AGENTS.md` has placeholder sections for: Project Overview, Architecture Pattern, Project Structure, Data Layer, AI Working Rules (ALWAYS / NEVER), and a PR Checklist. All of these are currently blank comments.

---

## First Question

To fill in the `Project Overview` — and shape everything that follows — I need to understand the product itself.

**What is this task manager for? Who uses it, and what's the intended feature set beyond the basics that are already there (create, toggle, delete tasks)?**

For example: Is this a personal productivity tool or a team product? Are there plans for task categories, due dates, assignments, or other workflows? Is authentication already handled through Supabase Auth, or is that still to come?
