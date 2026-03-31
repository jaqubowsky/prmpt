Here's what I found in the codebase:

- **Next.js 14 app** (App Router) with TypeScript, Supabase as the data layer, and Zod for validation — though Zod isn't used anywhere in the current source yet.
- **Three source files only**: `src/app/page.tsx` (server component fetching tasks from Supabase), `src/components/TaskList.tsx` (client component rendering tasks with toggle/delete), `src/lib/types.ts` (a single `Task` interface).
- **Critical missing pieces**: `app/actions.ts` (called by `TaskList` for `toggleTask`/`deleteTask`) and `lib/supabase/server.ts` (called by `page.tsx`) don't exist — the app can't run as-is.
- **Tests folder is empty** — `__tests__/` exists but has no files; Vitest is installed but unused.
- **AGENTS.md is a blank template** — all sections are placeholder comments, nothing project-specific has been filled in.

I'll ask questions one at a time to build out the full project context. Let's start at the product level.

**What does this task manager actually do — and who is it for?**

The README says "a simple task management app" but that's not enough. Is this a personal to-do list for a single user? A shared team board? Something domain-specific, like tracking client deliverables or engineering tasks? Paint me a picture: who is the user, what does their day look like without this tool, and what changes when they have it? The answer will shape everything from the data model (is `user_id` for multi-user auth, or a placeholder?) to what features actually matter.
