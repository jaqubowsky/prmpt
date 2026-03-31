```
    █▀█ █▀█ █▀▄▀█ █▀█ ▀█▀
    █▀▀ █▀▄ █ ▀ █ █▀▀  █
    ▀   ▀ ▀ ▀   ▀ ▀    ▀
```

One command to set up any project for AI-first development with Claude Code.

```bash
npx github:[org]/prmpt
```

---

## What it does

**prmpt** scaffolds project context files and launches Claude Code to finish the setup through an intelligent interview.

```
You run prmpt
    │
    ├── Copies skeleton files (AGENTS.md, docs/ai/, CLAUDE.md, settings)
    ├── Installs 6 plugins (superpowers, context7, github, figma, commit-commands, claude-code-setup)
    └── Launches Claude Code
            │
            ├── Reads your codebase silently
            ├── Interviews you about the product (problem-first, tools-last)
            ├── Challenges your decisions, predicts edge cases
            ├── Writes complete project documentation
            ├── Runs plugin audit for your stack
            └── Done. Start building with /using-superpowers
```

## What you get

```
your-project/
├── CLAUDE.md                         → Points Claude to AGENTS.md every session
├── AGENTS.md                         → Lean reference (~80 lines) loaded every session
├── docs/ai/
│   ├── PRODUCT.md                    → Product context, user stories, acceptance criteria
│   ├── ROADMAP.md                    → Priorities, phases, constraints
│   ├── CONVENTIONS.md                → Naming, imports, code style decisions
│   ├── PATTERNS.md                   → How to structure components/modules
│   ├── TESTING.md                    → What to test, how, testing philosophy
│   └── ARCHITECTURE.md              → Stack, schema, data flow, technical decisions
├── .claude/
│   ├── settings.json                 → Plugin config + permissions
│   └── skills/project-setup/SKILL.md → The interview skill
└── .github/                          → CI + AI PR review (generated during interview)
```

## The interview

The `project-setup` skill conducts a thorough interview before writing anything. It's not a survey — it's a collaborative design session where Claude:

- **Starts with the product** — what you're building, for whom, what problem it solves
- **Goes deep** — user stories, acceptance criteria, success metrics, edge cases
- **Pushes back** — challenges bad decisions, predicts problems you haven't thought of
- **Asks one question at a time** — with concrete options and a recommendation
- **Never infers preferences** — reads facts from code, asks about every decision

Only after fully understanding the product does it move to technical questions (stack, architecture, conventions, testing).

## Plugins installed

| Plugin | Purpose |
|---|---|
| `superpowers` | Full dev workflow: brainstorm → plan → TDD → code review → PR |
| `context7` | Always-fresh documentation for any library or framework |
| `github` | Repository management, issues, PRs |
| `commit-commands` | Git commit/push workflows |
| `figma` | Design file access |
| `claude-code-setup` | Codebase analysis and recommendations |

The skill also runs a **plugin audit** at the end, suggesting stack-specific plugins:

| Stack | Suggested plugin |
|---|---|
| TypeScript/JS | `typescript-lsp` |
| Python | `pyright-lsp` |
| Go | `gopls-lsp` |
| Rust | `rust-analyzer-lsp` |
| Java | `jdtls-lsp` |
| C# | `csharp-lsp` |
| PHP | `php-lsp` |
| C/C++ | `clangd-lsp` |
| Swift | `swift-lsp` |
| Kotlin | `kotlin-lsp` |
| Ruby | `ruby-lsp` |
| Elixir | `elixir-ls-lsp` |
| Lua | `lua-lsp` |
| Supabase | `supabase` |
| Playwright | `playwright` |

## After setup

Every new feature follows the Superpowers workflow:

```
/using-superpowers              → Entry point
  └── /superpowers:brainstorm   → Clarify what you're building
  └── /superpowers:write-plan   → Break it into tasks
  └── /superpowers:execute-plan → TDD implementation
  └── /code-review              → Review before merging
```

## Updating

```bash
npx github:[org]/prmpt update
```

Updates skill and config files. Never overwrites your AGENTS.md or docs/ai/ without asking.

## Requirements

- Node.js >= 18
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installed

## How it works (technical)

prmpt is a Node.js CLI with zero LLM API calls. It copies static templates, installs plugins via `claude plugin install`, and launches `claude "finish project setup"`. All intelligence comes from Claude Code + the bundled `project-setup` skill.

```
bin/cli.mjs          → Entry point (commander)
src/commands/init.mjs → Copy templates + install plugins + launch Claude
src/commands/update.mjs → Selective template updates
src/installers/superpowers.mjs → Plugin installation
src/utils/detect.mjs → Project state detection
src/utils/copy-templates.mjs → Template copy with path mapping
src/utils/banner.mjs → ASCII banner
```

---

Built for developers who want to start building with AI, not configuring it.
