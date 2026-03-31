Here's what I found in the codebase:

- **Stack:** Next.js 14 (App Router) + TypeScript + Supabase + Tailwind CSS, tested with Vitest
- **Structure:** `src/app/page.tsx` is a server component that fetches tasks from Supabase; `src/components/TaskList.tsx` is a client component handling display and interactions; `src/lib/types.ts` holds the `Task` interface
- **Data model:** Tasks have `id`, `title`, `completed`, `created_at`, and `user_id` — suggesting per-user task ownership
- **AGENTS.md exists but is empty** — all sections are placeholder comments, nothing has been filled in yet
- **Tests directory is empty** — `__tests__/` exists but contains no test files

I'll ask questions one at a time to fill everything in. Let's start with the product.

---

**Question 1 of many — what does this app actually do?**

The README says "a simple task management app" and the code shows a single task list fetched from Supabase. But I want to understand the full picture before I write anything.

How would you describe this to a friend? For example:

- **a)** Personal to-do list — one person, their own tasks, no sharing
- **b)** Team task tracker — multiple users, shared tasks or projects
- **c)** Something more specific — e.g. tasks tied to a workflow, a client, a project type

What's the real use case here?
