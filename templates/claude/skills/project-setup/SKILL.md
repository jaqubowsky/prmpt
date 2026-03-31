---
name: project-setup
description: Initialize or update AGENTS.md and docs/ai/ for a project. First explores the codebase silently, then interviews the user relentlessly about every decision — conventions, naming, patterns, testing, architecture, product context, roadmap. Use when user says "finish setup", "finish project setup", "set up project context", "update AGENTS.md", "update project context", or when docs/ai/ files contain placeholder TODO comments.
---

Interview me relentlessly about every aspect of this project until we have enough context to write complete, project-specific documentation. Walk down each branch of the decision tree, resolving dependencies one-by-one.

## Before asking anything

Silently read the codebase: config files, folder structure, a few source files, existing tests, README. Build a mental model of what's there.

Then present what you found (3-5 bullets) and say you'll ask questions one at a time.

## The interview

Ask questions one at a time. For each question, provide concrete options and your recommended answer based on what you saw in the code.

If a question can be answered by exploring the codebase, explore the codebase instead of asking.

**Do not infer decisions the user should make.** You can infer facts (what stack is used, what files exist). You cannot infer preferences (how to name files, what conventions to follow, what to test, how to structure components). When in doubt, ask.

### What to ask about (not a fixed list — follow the conversation)

Start with the product — without understanding WHAT we're building, questions about HOW don't make sense.

- **Product**: What this does, who it's for, what problem it solves
- **Roadmap**: What's the priority now, what's next, what can wait
- **Conventions**: File naming, variable naming, import ordering, code style preferences beyond the linter
- **Patterns**: How a typical component/module/handler should be structured, what reusable patterns to follow
- **Testing**: What to test, what not to test, how tests should be written, naming conventions for tests
- **Architecture**: Why this stack, why this structure, key technical decisions
- **Data flow**: How data gets to components, what happens on errors, loading/empty states
- **Boundaries**: What Claude must not touch without asking
- **Workflow**: PR size, branching, CI, review expectations

Each answer either resolves a branch or opens new questions. Don't move on until a branch is fully resolved — meaning you could write it down unambiguously.

Go deep. "React + Vite + TypeScript" is not enough. Ask about: Do you want barrel exports or direct imports? Named exports or default? Where do types live — colocated or in a types folder? How do you name test files — `.test.ts` next to the file or in `__tests__/`? These details matter for every future Claude session.

For greenfield/empty projects with no code yet, options are especially important — there's nothing in the codebase to anchor the conversation. Always provide concrete options (e.g., "web app, API, CLI, library") with a recommendation when the project is blank.

## When all branches are resolved

Say: "I have everything. Here's what I'll write — tell me if anything looks wrong:"

Show every file in full. Wait for confirmation. Then write:

### AGENTS.md (~80 lines max)

Lean reference document loaded every session. Contains:
- Project overview (2-3 sentences)
- Architecture pattern (1 sentence + link to docs/ai/ARCHITECTURE.md)
- Project structure (folder tree, no descriptions — those are in ARCHITECTURE.md)
- Data layer (1 sentence + link to docs/ai/ARCHITECTURE.md)
- AI Working Rules: ALWAYS / NEVER / WHEN IN DOUBT — **project-specific, concrete rules only**. Not generic truisms. Every rule should be something that's unique to THIS project.
- References section with `@docs/ai/FILE.md` links
- PR Checklist (or note that PRs aren't used)

**AGENTS.md must not duplicate content from docs/ai/ files.** It references them. Details live there.

### docs/ai/ files

**PRODUCT.md** — What this project does, who uses it, key domain concepts, what success looks like.

**ROADMAP.md** — Current priorities, what's next, what's deferred, known constraints.

**CONVENTIONS.md** — All the naming/style/organization decisions from the interview. This is the file Claude reads to know how to write code in this project.

**PATTERNS.md** — How to structure a typical unit of work (component, endpoint, module). Include a concrete example from the codebase if one exists.

**TESTING.md** — What gets tested, what doesn't, how to write a test here, test naming, mocking strategy.

**ARCHITECTURE.md** — High-level architecture, folder mapping, key technical decisions and WHY they were made, integration points.

### GitHub files (only if .git/ exists and user wants them)

Ask the user if they want CI and AI PR review. If yes:
- `.github/workflows/ci.yml` — tailored to actual stack
- `.github/workflows/ai-pr-review.yml` — using anthropics/claude-code-action@main, with a direct_prompt that reads AGENTS.md + docs/ai/ as source of truth and explicitly says "Do NOT invent rules not in those files"
- `.github/PULL_REQUEST_TEMPLATE.md` — tailored to stack

## After writing

Run the project's toolchain to verify: build, lint, test — whatever exists. If something fails, fix it. If no toolchain exists yet, skip and say so.

When done: "Done. Start every new feature with: /superpowers:brainstorm"
