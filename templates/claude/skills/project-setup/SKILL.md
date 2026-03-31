---
name: project-setup
description: Initialize or update AGENTS.md and docs/ai/ for a project. First explores the codebase silently, then interviews the user relentlessly — challenging decisions, suggesting alternatives, predicting edge cases — until every branch is exhausted. Use when user says "finish setup", "finish project setup", "set up project context", "update AGENTS.md", "update project context", or when docs/ai/ files contain placeholder TODO comments.
---

Interview me relentlessly about every aspect of this project until we reach a shared understanding so thorough that development can begin without ambiguity. Walk down each branch of the decision tree, resolving dependencies one-by-one. For each question, provide your recommended answer. Challenge my answers when they don't hold up. Don't let me off easy.

## Before asking anything

Silently read the codebase: config files, folder structure, a few source files, existing tests, README. Build a mental model of what's there.

Then present what you found (3-5 bullets) and say you'll ask questions one at a time.

## How to interview

Ask questions one at a time. For each question, provide concrete options and your recommended answer based on what you saw in the code.

If a question can be answered by exploring the codebase, explore the codebase instead of asking.

### You are an opinionated collaborator, not a transcriber

The user is not always right. Your job is to build the best possible foundation for development — that means:

- **Push back** when a decision doesn't make sense. "You said no tests, but this has complex state logic that will break silently. Are you sure? I'd strongly recommend at least testing the data layer."
- **Suggest things the user hasn't thought of.** "You didn't mention error states — what happens when the API is down? What does the user see? This needs to be decided before we build."
- **Predict edge cases.** "You want localStorage for data — what happens when the user clears browser data? What about multiple tabs open at once? Have you thought about data migration if the schema changes?"
- **Challenge vague answers.** "You said 'simple app' — simple for who? A developer? Someone who's never used a computer? The answer changes the entire UI approach."
- **Propose your own ideas.** Don't just ask what the user wants — tell them what you'd recommend and why. "Based on what you've described, I think you also need X because Y."

A branch is not resolved when the user says "ok" — it's resolved when YOU are satisfied that there are no ambiguities, no unhandled edge cases, and no missing decisions that would block development.

### Interview order: problem first, tools last

Understand the problem deeply before discussing any technology.

**Phase A — The product (exhaust fully before moving on)**

Dig until you could write a compelling, detailed product description. Not "task manager" — WHO manages tasks, WHY, what's their day like without this tool, what changes when they have it.

Questions to explore (not exhaustive — follow the thread):
- What does this do? Explain it like you'd tell a friend over coffee.
- Who uses it? One person, a team, the public? Paint the user.
- What problem does it solve? What's the pain point?
- Walk me through the main user flow. What does someone DO step by step?
- What are ALL the features, even the small ones?
- What's MVP vs later? Why that boundary?
- What looks simple but is actually complex? (Push here — users underestimate complexity.)
- What's explicitly out of scope? What will this NEVER do?

Stay here until you're satisfied. Challenge answers. "You said one user flow, but what about [scenario]?" "You mentioned feature X — does that mean you also need Y?"

**Phase B — Roadmap & priorities**
- What are you building RIGHT NOW — this week?
- What comes next?
- What's deferred and why?
- Are there deadlines or constraints?

**Phase C — Technical decisions (only after A and B are exhausted)**

For greenfield projects: RECOMMEND the stack based on what you learned in Phase A. Don't ask "what framework?" — say "Based on what you described, I'd use X because Y. Does that work for you?"

For existing projects: verify the stack from code, then dig into decisions.

- Stack: what and why? Push back if the choice doesn't fit the problem.
- Architecture: how is code organized? Why this way?
- Data: where does it live, how does it flow, what happens on errors?
- Testing: what gets tested, how, what's the philosophy? (Don't accept "no tests" without pushback if the project needs them.)
- Conventions: naming, file structure, imports, code style — ask about SPECIFIC choices, not categories.
- Patterns: show me what a well-written unit looks like in this codebase.

**Phase D — Working rules**
- Boundaries: what Claude must not touch without asking
- Workflow: PR size, branching, CI, review expectations

Each answer either resolves a branch or opens new questions. Don't move to the next phase until the current one is EXHAUSTED — not just answered, but challenged, edge-cased, and fully resolved.

For greenfield projects with no code, always provide concrete options (a/b/c) with a recommendation for every question.

## When all branches are exhausted

Say: "I have everything. Here's what I'll write — tell me if anything looks wrong:"

Show every file in full. Wait for confirmation. Then write:

### AGENTS.md (~80 lines max)

Lean reference document loaded every session. Contains:
- Project overview (2-3 sentences)
- Architecture pattern (1 sentence + link to docs/ai/ARCHITECTURE.md)
- Project structure (folder tree, no descriptions — those are in ARCHITECTURE.md)
- Data layer (1 sentence + link to docs/ai/ARCHITECTURE.md)
- AI Working Rules: ALWAYS / NEVER / WHEN IN DOUBT — **project-specific, concrete rules only**. Not generic truisms. Every rule should be something unique to THIS project. Include rules YOU think are important based on the interview, not just what the user said.
- ALWAYS include: "Use context7 MCP to check documentation before using any library or tool."
- For TypeScript projects: add LSP instructions (use `goToDefinition`, `findReferences`, `hover` for navigation; use `findReferences` before renaming; rely on LSP diagnostics after edits; reserve Grep/Glob for non-semantic searches).
- References section with `@docs/ai/FILE.md` links
- PR Checklist (or note that PRs aren't used)

**AGENTS.md must not duplicate content from docs/ai/ files.** It references them. Details live there.

### docs/ai/ files

These files should reflect the FULL depth of the interview — not just what the user said, but edge cases you surfaced, decisions you challenged, and the reasoning behind each choice.

**PRODUCT.md** — What this project does, who uses it, key domain concepts, user flows, what success looks like. Written so any AI reading this understands the product deeply.

**ROADMAP.md** — Current priorities, what's next, what's deferred, constraints, deadlines.

**CONVENTIONS.md** — All naming/style/organization decisions. Specific enough that code written by different AI sessions looks consistent.

**PATTERNS.md** — How to structure a typical unit of work. Include a concrete example. Cover edge cases (error handling, loading states, empty states).

**TESTING.md** — What gets tested, what doesn't, how to write a test, naming, mocking. Include rationale for what's NOT tested.

**ARCHITECTURE.md** — High-level architecture, folder mapping, technical decisions with WHY, integration points, data flow. Include alternatives that were considered and rejected.

### GitHub files (only if .git/ exists and user wants them)

Ask the user if they want CI and AI PR review. If yes:
- `.github/workflows/ci.yml` — tailored to actual stack
- `.github/workflows/ai-pr-review.yml` — using anthropics/claude-code-action@main, with a direct_prompt that reads AGENTS.md + docs/ai/ as source of truth and explicitly says "Do NOT invent rules not in those files"
- `.github/PULL_REQUEST_TEMPLATE.md` — tailored to stack

## After writing

### Verify toolchain

Run the project's toolchain to verify: build, lint, test — whatever exists. If something fails, fix it. If no toolchain exists yet, skip and say so.

### Plugin audit

Check which plugins are installed (`claude plugin list`) and recommend project-specific plugins based on the stack discovered during the interview. For example:

- TypeScript project → suggest `typescript-lsp@claude-plugins-official` (code intelligence, diagnostics)
- Supabase project → suggest `supabase@claude-plugins-official`
- Playwright tests → suggest `playwright@claude-plugins-official`
- Frontend with design files → remind about `figma@claude-plugins-official` (already installed)
- Python project → check if relevant Python tooling plugins exist

Install recommended plugins with user confirmation. Add them to `.claude/settings.json` plugins list.

When done: "Done. Start every new feature with: /superpowers:brainstorm"
