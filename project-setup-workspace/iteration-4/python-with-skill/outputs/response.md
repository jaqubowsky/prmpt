# Project Setup: python-api

Here's what I found in the codebase:

- **Stack**: FastAPI + SQLAlchemy 2.0 + PostgreSQL (UUID primary keys, `NUMERIC` for money) + Alembic for migrations + Pydantic v2. Python 3.11+. Tooling: ruff (line-length 100), pytest with httpx for async tests.
- **Domain**: Invoice management API. One resource so far — `Invoice` with fields: `id` (UUID), `client_name`, `amount` (Decimal), `status` (string, default `"draft"`), `created_at`. Two endpoints: `GET /invoices/` and `POST /invoices/`.
- **Missing pieces**: `src/db.py` is imported by both `models/invoice.py` and `routes/invoices.py` but doesn't exist yet — `Base` and `get_db` are undefined. There's no `main.py`, no app entrypoint, no `conftest.py` for tests (the test uses a `client` fixture that isn't defined anywhere).
- **AGENTS.md** is a blank template — all sections are placeholder comments. No `docs/ai/` directory exists at all.
- **Tests**: one async test written with `pytest-anyio`, but the test suite can't run yet (missing fixture, missing db module).

I'll ask questions one at a time to fill in everything needed. Let's start with the product.

---

**Question 1 — What does this API actually do in the real world?**

Right now I see invoices with a `client_name`, `amount`, and a `status` of `"draft"`. But I don't know the full picture yet.

My read: this looks like a B2B invoicing backend — a business creates invoices for their clients, tracks payment status, and likely sends or exports them. But "draft" as the only status suggests a workflow: draft → sent → paid → maybe overdue or cancelled.

**Who is the user of this API?** Options:

- **(a)** A single business owner using a frontend app you'll build (internal tool)
- **(b)** Multiple businesses (multi-tenant SaaS) — each sees only their own invoices
- **(c)** A developer integrating this as a backend service into something else

My recommendation based on what I see: **(a)** — there's no tenant/user concept in the model yet, which strongly suggests single-tenant. But if the answer is (b), the data model needs a foreign key to a `business` or `user` table before any other work happens — that's a foundational decision we can't defer.

Which is it?
