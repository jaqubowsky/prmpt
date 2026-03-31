Here's what I found in the codebase:

- **Stack is fully confirmed from code:** Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma + PostgreSQL, NextAuth.js (credentials + JWT), Vitest + React Testing Library, Biome for linting/formatting.
- **Three feature domains are built out:** Orders (list with pagination, detail view, status update via PATCH API, `useOrders` hook), Products (grid, create form with Zod validation, `useProducts` hook with client-side search/delete), Customers (list, `useCustomers` hook with search). Each domain follows the same pattern: feature barrel (`index.ts`), types file, hook, and UI components.
- **Auth has a critical placeholder:** `auth.ts` has a comment saying "In production, compare against hashed password (bcrypt) — this is a placeholder." Password comparison is not implemented. The Role enum (ADMIN / MANAGER / VIEWER) exists in the schema but role-based access control is not wired up anywhere in the code yet.
- **One test exists, covering `useOrders`:** It tests initialization, the `isUpdating` flag during a fetch, and error handling — this is the core async state logic. No tests exist for products, customers, the Zod form schema, or the utility functions.
- **All `docs/ai/` files and most AGENTS.md sections are placeholders.** The AGENTS.md has a good overview paragraph but Architecture, Conventions, Testing, and Common Tasks sections are all `_Placeholder — to be filled in._`

I'll ask you one question at a time to fill in everything the code can't tell me. Here's the first one:

---

**The schema defines three roles — ADMIN, MANAGER, VIEWER — but nothing in the codebase currently enforces them.** Before we document anything, I need to understand the intended permission model so we can design around it rather than bolt it on later.

What should each role be able to do? Specifically: which actions (updating order status, creating/deleting products, viewing customer data) are restricted to which roles — and are there any operations that only ADMIN can perform?

My recommendation: draw a hard line where it matters most. VIEWER = read-only everywhere. MANAGER = can update order status and manage products but cannot touch users/settings. ADMIN = full access including user management. If that's roughly right, say so and we'll sharpen the edges — or tell me where it diverges.
