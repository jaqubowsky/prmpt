<p align="center">
  <img src="https://raw.githubusercontent.com/jaqubowsky/prmpt/main/assets/banner.webp" alt="prmpt" width="600" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-green.svg" alt="Node >= 18" />
  <img src="https://img.shields.io/badge/Claude_Code-required-purple.svg" alt="Claude Code required" />
  <img src="https://img.shields.io/badge/LLM_API_calls-zero-orange.svg" alt="Zero LLM API calls" />
</p>

One command to set up any project for AI-first development with Claude Code.

## Quick start

```bash
npx prmpt
```

<p align="center">
  <img src="https://raw.githubusercontent.com/jaqubowsky/prmpt/main/assets/demo.gif" alt="prmpt demo" width="700" />
</p>

## How it works

```
npx prmpt
 │
 ├─ Scaffold files (AGENTS.md, docs/ai/, CLAUDE.md, settings)
 ├─ Install plugins (superpowers, context7, github, commit-commands, claude-code-setup)
 └─ Launch Claude Code
     │
     ├─ Explore codebase silently
     ├─ Interview you (problem-first, one question at a time)
     ├─ Write complete project documentation
     ├─ Run plugin audit for your stack
     └─ Done → start building with /using-superpowers
```

## The interview

The `project-setup` skill isn't a survey. It's a collaborative design session:

```
Phase A — Product        What does it do? Who uses it? User stories,
                         acceptance criteria, success metrics, edge cases

Phase B — Roadmap        What now? What next? What's deferred?

Phase C — Technical      Stack, architecture, data flow, testing,
                         conventions, patterns (only after A+B)

Phase D — Working rules  Boundaries, workflow, CI
```

- **Problem first, tools last** — understands WHAT you're building before asking about HOW
- **Pushes back** — challenges decisions, predicts edge cases you haven't considered
- **One question at a time** — concrete options with a recommendation
- **Never infers preferences** — reads facts from code, asks about every decision

## What you get

```
your-project/
├── CLAUDE.md                         → Points Claude to AGENTS.md every session
├── AGENTS.md                         → Lean project reference (~80 lines)
├── docs/ai/
│   ├── PRODUCT.md                    → User stories, acceptance criteria, success metrics
│   ├── ROADMAP.md                    → Priorities, phases, constraints
│   ├── CONVENTIONS.md                → Naming, imports, code style
│   ├── PATTERNS.md                   → Component/module structure
│   ├── TESTING.md                    → What to test, how, philosophy
│   └── ARCHITECTURE.md              → Stack, schema, data flow, decisions
├── .claude/
│   ├── settings.json                 → Plugin config + permissions
│   └── skills/project-setup/SKILL.md → The interview skill
└── .github/                          → CI + AI PR review (tailored to your stack)
```

## Plugins

Five plugins installed automatically:

| Plugin | What it does |
|---|---|
| **superpowers** | Dev workflow: brainstorm, plan, TDD, code review, PR |
| **context7** | Fresh docs for any library — even ones you know well |
| **github** | Repo management, issues, PRs from Claude |
| **commit-commands** | Git commit/push workflows |
| **claude-code-setup** | Codebase analysis and recommendations |

After the interview, a **plugin audit** suggests stack-specific plugins (LSP for your language, Supabase, Playwright, etc.) and installs them.

## After setup

```
/using-superpowers → brainstorm → write-plan → execute-plan → code-review → finish
```

## Updating

```bash
npx prmpt update
```

Updates skill and config files. Never overwrites your AGENTS.md or docs/ai/ without asking.

## Requirements

- Node.js >= 18
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

## License

MIT — do whatever you want with it. See [LICENSE](LICENSE).

---

<sub>Zero LLM API calls. All intelligence comes from Claude Code + the bundled project-setup skill.</sub>
