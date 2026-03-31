# Project Setup — First Look

Here's what I found in `/tmp/eval-projects/python-api`:

## What's there

**Stack:** FastAPI + SQLAlchemy 2.0 + PostgreSQL (UUID primary keys via `postgresql.UUID`) + Pydantic v2 + Alembic for migrations. Python 3.11+. Dev tooling: pytest + httpx (async client) + ruff.

**Code:** The project is an invoice API at v0.1.0. There are two endpoints under `/invoices`:
- `GET /invoices/` — lists all invoices
- `POST /invoices/` — creates an invoice (fields: `client_name`, `amount`; status defaults to `"draft"`)

The `Invoice` SQLAlchemy model and `InvoiceCreate` Pydantic schema live in `src/models/invoice.py`. One test covers invoice creation using an async HTTP client.

**AGENTS.md:** All sections are placeholders — Project Overview, Architecture Pattern, Data Layer, AI Working Rules (ALWAYS/NEVER), and the PR Checklist are all empty. The six `docs/ai/` reference files (PRODUCT.md, ROADMAP.md, CONVENTIONS.md, PATTERNS.md, TESTING.md, ARCHITECTURE.md) are referenced but don't exist yet.

## One thing worth noting

Both `src/models/invoice.py` and `src/routes/invoices.py` import from `src/db` (for `Base` and `get_db`), but `src/db.py` does not exist in the repo. The project isn't runnable as-is — that file needs to be created (or confirmed missing) before anything can start.

---

## First question

To fill in the most important sections — Project Overview, AI Working Rules, and `docs/ai/PRODUCT.md` — I need to understand the purpose and context:

**What is this API for, and who uses it?** For example: is this a standalone invoicing service you're building as a product, a backend for an internal tool, or a component in a larger system? And is it serving a specific industry or use case (freelancers, a SaaS product, a business's own billing flow)?
