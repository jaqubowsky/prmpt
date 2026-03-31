Here's what I found in the codebase:

- **Completely greenfield project** — only two files exist: `package.json` (name: `my-new-app`, version `0.0.1`, no dependencies) and `AGENTS.md` (all placeholder content, nothing filled in yet).
- **No source code, no tests, no framework, no tooling** — there is no `src/`, no `node_modules`, no lock file, no build config, no `.git/`.
- **No docs/ai/ directory** — none of the referenced files (`PRODUCT.md`, `ROADMAP.md`, etc.) exist yet.
- **No stack decision has been made** — `package.json` has zero dependencies, so the language/framework is wide open.
- **No README** — there's nothing describing what this project is supposed to be.

I'll ask questions one at a time to build up a complete picture before writing anything. Let's start at the beginning.

---

**Question 1 — What is this project?**

Explain it like you'd tell a friend over coffee. Not "a web app" — what does it actually DO, and why does it need to exist? What's the problem it solves?

My recommended starting point: before picking any technology, I want to understand the product deeply enough that the stack choice becomes obvious. So resist the urge to jump to "it's a React app" — tell me the problem first.
