Here's what I found in the codebase:

- **Stack**: Next.js 14 (App Router) + TypeScript + Supabase + Zod, with Vitest configured for testing
- **What exists**: A single `Task` type, one server component (`page.tsx`) that fetches tasks from Supabase, and a client component (`TaskList.tsx`) that renders them with toggle/delete actions
- **Structure**: `src/app/` for pages, `src/components/` for UI components, `src/lib/` for shared types — no Supabase client helper yet (it's imported from `@/lib/supabase/server` but that file doesn't exist)
- **AGENTS.md** is a placeholder with no project-specific content filled in
- **No tests written yet**, and no `docs/ai/` folder exists

I'll ask questions one at a time. Let's start with what matters most — the product.

**What is this task manager for?** Is it a personal tool (one user, their own tasks), a team tool (multiple users, shared or assigned tasks), or something else? This shapes almost every other decision.
