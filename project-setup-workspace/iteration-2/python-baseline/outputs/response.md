I've looked through the project. Here's what I already know:

- **Stack**: Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic, PostgreSQL (UUID primary keys confirm Postgres)
- **Project name**: `invoice-api` — an API for managing invoices
- **Architecture**: Router-based FastAPI app with SQLAlchemy ORM models; routes live in `src/routes/`, models in `src/models/`
- **Data model**: `Invoice` has `id` (UUID), `client_name`, `amount` (Decimal), `status` (default: `"draft"`), `created_at`
- **Testing**: pytest with `httpx.AsyncClient` and `anyio` for async tests; test for `POST /invoices/` already exists
- **Code style**: ruff with 100-char line length, targeting Python 3.11
- **AGENTS.md**: All sections are placeholders — nothing has been filled in yet

I have some questions to fill in the rest. I'll ask one at a time — you can pick an option or just say "yes" to my suggestion.

---

**What does this API do, and who uses it?**

I can see it manages invoices, but I need to understand the bigger picture to write useful docs.

For example:
- Option A: Internal tool — used by your own team or app to track invoices (e.g., a SaaS backend that creates and manages billing records)
- Option B: Client-facing service — exposed to external clients or partners who submit or query their own invoices
- Option C: Something else — e.g., a microservice that's one piece of a larger billing system

I'd suggest: Option A (internal tool / SaaS backend) because the current data model is simple and there's no authentication layer yet, which is typical of early-stage internal services.
