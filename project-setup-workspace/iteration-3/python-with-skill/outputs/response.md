Here's what I found in the codebase:

- **Stack:** FastAPI + SQLAlchemy 2.0 + PostgreSQL (via UUID column type), Pydantic v2, Alembic for migrations, pytest + httpx for async tests, ruff for linting.
- **Domain:** This is an invoice API — there's a single `Invoice` model with `client_name`, `amount`, `status` (default `"draft"`), and `created_at`. Routes cover list and create.
- **Structure:** `src/models/`, `src/routes/`, `src/db` (referenced but not present in the tree — likely not yet created), `tests/`.
- **Tests:** One async test exists using `httpx.AsyncClient` and `pytest.mark.anyio`, with a `client` fixture that hasn't been defined yet.
- **AGENTS.md** is all placeholder — nothing has been filled in yet.

I'll ask you questions one at a time to fill in the full picture. Let's start with the product.

---

**Question 1 — What does this do, in plain language?**

I can see it's an invoice API, but I need to understand the full picture. For example:

- **a)** Internal tool — a freelancer or small team manages their own invoices (create, track status, send to clients)
- **b)** Multi-tenant SaaS — businesses each have their own invoices, clients, and billing workflows
- **c)** Backend for a larger product — this API is one piece of a bigger system (e.g., an ERP or accounting platform)
- **d)** Something else entirely

What's the right framing? And who actually uses it — one person, a team, or end customers?
