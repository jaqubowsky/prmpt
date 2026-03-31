Here's what I found in the codebase:

- **Stack**: FastAPI + SQLAlchemy 2.0 + PostgreSQL (UUID primary keys, Alembic for migrations) + Pydantic v2, Python 3.11+
- **Structure**: `src/models/` for SQLAlchemy models + Pydantic schemas (colocated), `src/routes/` for APIRouter handlers, `tests/` for async pytest tests using httpx
- **Current state**: One resource implemented end-to-end — `Invoice` with `list` and `create` endpoints; status field defaults to `"draft"`
- **Tooling**: Ruff (line-length 100, py311 target) for linting; pytest with `testpaths = ["tests"]`; `AGENTS.md` and `docs/ai/` are all placeholder stubs with no real content yet

I'll ask questions one at a time. Let's start with the product, since everything else depends on it.

**What does this API do, and who uses it?** For example: is this an internal tool for a single business to manage their own invoices, a multi-tenant SaaS where each customer has their own invoices, or something else? And who are the end users — developers calling it directly, or a frontend app on behalf of end users?
