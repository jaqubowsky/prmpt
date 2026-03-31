I've looked through the project. Here's what I already know:

- **Stack**: Next.js 14 (App Router) + TypeScript + Supabase + Zod, with Vitest for testing
- **Project name**: Task Manager — a task management app backed by a Supabase `tasks` table
- **Architecture**: Server components fetch data directly from Supabase and pass it to client components; mutations use Next.js Server Actions (`toggleTask`, `deleteTask` referenced in `TaskList.tsx`)
- **Data model**: A `Task` has `id`, `title`, `completed`, `created_at`, and `user_id` — suggesting per-user tasks, so there's likely auth involved
- **AGENTS.md**: All sections are placeholder — nothing has been filled in yet
- **Tests**: `__tests__/` directory exists but is empty; no CI setup found

I have some questions to fill in the rest. I'll ask one at a time — you can pick an option or just say "yes" to my suggestion.

---

**What problem does this app solve, and who are its users?**

Right now I can see it's a task manager, but I don't know enough to write useful product docs without understanding the context:

- **Option A: Personal productivity tool** — a single user (you) managing your own tasks, no multi-tenancy needed beyond the `user_id` field already in the schema
- **Option B: Multi-user SaaS** — multiple independent users each with their own task lists, auth and row-level security in Supabase are core concerns
- **Option C: Team/collaborative tool** — users share tasks or projects, with roles or assignments

I'd suggest: **Option B (multi-user SaaS)** because the `user_id` field on `Task` and the Supabase integration both point toward isolated per-user data with auth — that's the most common setup for this stack.
