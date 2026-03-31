Here's what I found in the codebase:

- **FastAPI + SQLAlchemy + PostgreSQL stack** — `pyproject.toml` shows FastAPI 0.109, SQLAlchemy 2.0, Alembic for migrations, Pydantic v2, targeting Python 3.11.
- **Single resource so far: invoices** — `src/models/invoice.py` defines an `Invoice` SQLAlchemy model (UUID PK, client_name, amount, status, created_at) plus an `InvoiceCreate` Pydantic schema. Status is a plain string column defaulting to `"draft"` — no enum constraint yet.
- **Two routes exist** — `GET /invoices/` (list) and `POST /invoices/` (create). No update, delete, or status-transition endpoints yet.
- **Tests are async with httpx** — one test covers `POST /invoices/`, using `anyio` marks. A `client` fixture is referenced but not defined in the file — presumably missing or in a conftest that doesn't exist yet.
- **AGENTS.md is a blank placeholder** — all sections are TODO comments; `docs/ai/` doesn't exist at all.

I'll ask questions one at a time. Let's start with the product.

---

**Question 1 — What is this, really?**

"Invoice API" tells me the domain, but not the product. Is this:

a) An internal microservice — one piece of a larger system (e.g., an ERP or SaaS platform) that other services call
b) A standalone backend for a client-facing invoicing product — users log in, create invoices, send them to customers
c) A personal or freelancer tool — one person managing their own invoices via a thin frontend or CLI

My guess based on the minimal scope (no auth, no multi-tenancy, single resource) is **(a) — an internal service** being built incrementally. But the answer changes almost everything: multi-tenancy, auth, email delivery, PDF generation, and payment status all become mandatory in scenario (b) and irrelevant in (a).

Which is it — and if it's (b) or (c), who is the end user and what's their workflow today without this tool?
