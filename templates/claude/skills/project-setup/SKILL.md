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

### Interview order: problem first, tools last

Understand the problem deeply before discussing any technology. The order matters:

**Phase A — The product (resolve fully before moving to Phase B)**
- What does this do? Explain it like you'd tell a friend.
- Who uses it? One person, a team, the public?
- What problem does it solve? What's painful without it?
- What are the key features? What does a user actually DO in the app?
- What's the MVP vs. what comes later?
- Any features that seem simple but have hidden complexity?

Stay in Phase A until you could write a compelling 3-paragraph product description. "Web app for tracking countries" is not enough. WHO tracks countries, WHY, what do they see, what can they do, what makes this different from a spreadsheet?

**Phase B — Roadmap & priorities**
- What are you working on RIGHT NOW?
- What's next after that?
- What can wait? What's explicitly out of scope?

**Phase C — Technical decisions (only after A and B are fully resolved)**
- Stack: what technology and why? (For greenfield: recommend based on what you learned in Phase A)
- Architecture: how is the code organized?
- Data: where does data live, how does it flow?
- Testing: what gets tested, how?
- Conventions: naming, file structure, imports, code style preferences
- Patterns: how should a typical component/module look?

**Phase D — Working rules**
- Boundaries: what Claude must not touch without asking
- Workflow: PR size, branching, CI, review expectations

Each answer either resolves a branch or opens new questions. Don't move on to the next phase until the current one is fully resolved.

Go deep within each phase. Ask follow-ups. "React + Vite" is not a resolved architecture — ask about barrel exports vs direct imports, where types live, how test files are named. These details matter for every future Claude session.

For greenfield projects, always provide concrete options with a recommendation — there's no code to anchor the conversation.

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
