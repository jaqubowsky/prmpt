Here's what I found in the codebase:

- **Next.js 14 app router** with Supabase as the backend — `page.tsx` fetches tasks server-side, `TaskList` is a client component that handles toggling and deleting via Server Actions (referenced but not yet implemented: `@/app/actions`).
- **Stack**: Next.js 14, React 18, TypeScript, Supabase JS client, Zod for validation, Vitest for tests — but `src/lib/supabase/server.ts` and `src/app/actions.ts` are imported and don't exist yet.
- **Data model is minimal**: a single `Task` type with `id`, `title`, `completed`, `created_at`, `user_id` — no priority, no due dates, no categories.
- **`AGENTS.md` is a blank template** — all sections are placeholder comments, nothing has been filled in.
- **No tests exist** — `__tests__/` is empty despite Vitest being configured and the test script present.

I'll ask questions one at a time to build out the full context. Let's start with the product.

---

**Question 1 of Phase A — The product**

The README says "task management app" but that covers everything from a personal sticky-note replacement to a team project tracker. Help me paint the actual user.

Who is this for — is it a **single person** managing their own tasks, a **small team** sharing work, or something else entirely? And what's their situation right now without this app — are they using a spreadsheet, a notes app, nothing, or an existing tool that's failing them?

My assumption based on the `user_id` field on the Task model: this is **multi-user**, meaning each person sees only their own tasks. But that raises an immediate question — is there any concept of sharing or collaboration, or is every user's task list fully private?

**My recommendation**: Keep it single-user/personal for MVP (the data model already points that way). Collaboration adds auth complexity, real-time sync, permissions — all of which are absent here. Is that the intent, or is multi-user collaboration actually on the roadmap?
