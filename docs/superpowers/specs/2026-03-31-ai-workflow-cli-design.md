# ai-workflow CLI - Design Spec

## One-liner

CLI that scaffolds AI-first development workflow files and launches Claude Code to finish setup.

## Philosophy

- CLI = mechanical: copy files, install plugin, launch Claude
- Claude Code = intelligent: interview user, fill AGENTS.md + docs/ai/
- Zero LLM API calls in CLI
- Zero wizard - one command does everything

## Installation

```
npx github:[org]/ai-workflow
```

## What happens when you run it

```
npx github:[org]/ai-workflow
  1. Check: Claude Code installed? If not → print install instructions, exit.
  2. Check: AGENTS.md exists? If yes → ask reinitialize/update/cancel.
  3. Copy all template files to CWD.
  4. Install Superpowers plugin (claude plugin install).
  5. Print summary of created files.
  6. Launch: claude "finish project setup"
```

Claude Code takes over from step 6 - the `project-setup` skill reads the codebase, interviews the user, and fills all placeholders.

## Repository Structure

```
ai-workflow/
├── bin/
│   └── cli.mjs                     ← entry point
├── src/
│   ├── commands/
│   │   ├── init.mjs                ← default command
│   │   └── update.mjs              ← update command
│   ├── installers/
│   │   └── superpowers.mjs         ← installs Superpowers plugin
│   └── utils/
│       ├── detect.mjs              ← detects existing project state
│       ├── copy-templates.mjs      ← copies templates to CWD
│       └── banner.mjs              ← prints CLI banner
├── templates/
│   ├── AGENTS.md                   ← skeleton with placeholders
│   ├── SETUP_WITH_CLAUDE.md        ← post-install instructions
│   ├── docs/
│   │   └── ai/
│   │       ├── CONVENTIONS.md      ← placeholder
│   │       ├── PATTERNS.md         ← placeholder
│   │       ├── TESTING.md          ← placeholder
│   │       └── ARCHITECTURE.md     ← placeholder
│   ├── claude/
│   │   ├── settings.json           ← Superpowers + permissions
│   │   └── skills/
│   │       └── project-setup/
│   │           └── SKILL.md        ← custom skill
│   └── ai-workflow.json            ← version + metadata
└── package.json
```

Note: `templates/claude/` maps to `.claude/` in CWD, `templates/github/` maps to `.github/`.

## package.json

```json
{
  "name": "ai-workflow",
  "version": "1.0.0",
  "type": "module",
  "bin": { "ai-workflow": "./bin/cli.mjs" },
  "dependencies": {
    "chalk": "^5.4.1",
    "commander": "^13.1.0",
    "execa": "^9.5.2",
    "fs-extra": "^11.3.0"
  },
  "engines": { "node": ">=18.0.0" }
}
```

## CLI Entry Point (bin/cli.mjs)

```
#!/usr/bin/env node
```

Banner on every run:
```
╔══════════════════════════════════════╗
║    ai-workflow · v1.0.0              ║
║  Claude Code + Superpowers + TDD     ║
╚══════════════════════════════════════╝
```

Subcommands:
- `init` (default) - scaffold + launch Claude
- `update` - update templates to latest version

## Init Command Flow

### Step 1: Detect

`detect.mjs` checks CWD for:
- `.git/` - is it a repo
- `package.json` - project name
- `AGENTS.md` - already initialized
- `.claude/` - existing CC config

### Step 2: Guard - Claude Code installed?

```js
const { exitCode } = await execa('claude', ['--version'], { reject: false });
if (exitCode !== 0) {
  // Print: "Claude Code is required. Install: https://docs.anthropic.com/..."
  // Exit 1
}
```

### Step 3: Already initialized?

If `AGENTS.md` exists, use simple stdin prompt (no library needed):
```
Detected existing ai-workflow config.
  [r] Reinitialize (overwrite all)
  [u] Update (keep AGENTS.md, update rest)
  [c] Cancel
```
- `r` → continue init (overwrite)
- `u` → run update command instead
- `c` → exit

### Step 4: Copy templates

Copy `templates/` to CWD with path mapping:
- `templates/AGENTS.md` → `./AGENTS.md`
- `templates/SETUP_WITH_CLAUDE.md` → `./SETUP_WITH_CLAUDE.md`
- `templates/docs/ai/*` → `./docs/ai/*`
- `templates/claude/*` → `./.claude/*`
- `templates/ai-workflow.json` → `./.claude/ai-workflow.json`

Inject project name from `package.json` (if exists) into AGENTS.md `[PROJECT_NAME]` placeholder.
Inject current timestamp into `ai-workflow.json`.

### Step 5: Install Superpowers

```js
await execa('claude', ['plugin', 'install', 'superpowers@superpowers-marketplace']);
```

### Step 6: Print summary

```
✓ Created files:
  · AGENTS.md
  · docs/ai/ (4 files)
  · .claude/settings.json
  · .claude/skills/project-setup/SKILL.md
  · SETUP_WITH_CLAUDE.md

✓ Superpowers installed

⚡ Launching Claude Code to finish setup...
```

### Step 7: Launch Claude Code

```js
await execa('claude', ['finish project setup'], { stdio: 'inherit' });
```

`stdio: 'inherit'` passes control to Claude Code - user interacts directly.

## Update Command

```
npx github:[org]/ai-workflow update
```

1. Read `.claude/ai-workflow.json` → current installed version
2. Compare bundled templates with installed files
3. Always update without asking:
   - `.claude/skills/project-setup/SKILL.md`
   - `.claude/ai-workflow.json`
4. For each other changed file, ask: `Update [file]? (y/n)`
5. Never overwrite without asking:
   - `AGENTS.md`
   - `docs/ai/*.md`
   - `.github/workflows/*`

## Template Files (static content)

### AGENTS.md

```markdown
# [PROJECT_NAME]

## Project Overview
<!-- Generated by Claude Code during setup -->

## Architecture Pattern
<!-- Generated by Claude Code during setup -->

## Project Structure
<!-- Generated by Claude Code during setup -->

## Data Layer
<!-- Generated by Claude Code during setup -->

## AI Working Rules

### ALWAYS
- Read AGENTS.md at the start of every session
- Run /superpowers:brainstorm before writing any code
- TDD: write failing test before implementation
- Handle loading / error / empty state in every data component
- Describe tests through user behavior, not implementation
- Max 200 lines per PR - split larger features
- Run /code-review before opening a PR

### NEVER
- Do not modify: .env*, auth/*, middleware.ts, package.json
  (without asking first)
- Do not use `any` in TypeScript
- Do not leave console.log in production code
- Do not create new API endpoints without a written spec
- Do not open a PR with failing tests

### WHEN IN DOUBT
- Stop and ask the user
- Read the relevant docs/ai/ file
- Run /superpowers:brainstorm to clarify scope

## References
- Coding conventions:        @docs/ai/CONVENTIONS.md
- Component patterns:        @docs/ai/PATTERNS.md
- Testing strategy:          @docs/ai/TESTING.md
- Architecture decisions:    @docs/ai/ARCHITECTURE.md

## PR Checklist
<!-- Generated by Claude Code during setup based on stack -->
```

### docs/ai/*.md (all 4 files)

```markdown
<!-- TODO: Generated by Claude Code during setup.
     Open Claude Code and say: "finish project setup" -->
```

### .claude/settings.json

```json
{
  "plugins": ["superpowers@superpowers-marketplace"],
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npx vitest *)",
      "Bash(npx jest *)",
      "Bash(npx playwright *)",
      "Bash(npx tsc *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git checkout *)",
      "Bash(git push *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)",
      "Write(.env*)",
      "Write(package.json)"
    ]
  }
}
```

### .claude/skills/project-setup/SKILL.md

Full content from the original spec's CUSTOM SKILL section, with 4 phases:

1. **Explore** - silently read codebase (package.json, folder structure, configs, existing tests)
2. **Relentless Interview** - one question at a time, plain language, with examples and recommendations. Branches: STRUCTURE, DATA, COMPONENTS, TESTS, BOUNDARIES, WORKFLOW. Each branch resolved = can be written unambiguously.
3. **Generate** - show all files to user, wait for confirmation, then write:
   - AGENTS.md (filled)
   - docs/ai/CONVENTIONS.md
   - docs/ai/PATTERNS.md
   - docs/ai/TESTING.md
   - docs/ai/ARCHITECTURE.md
   - .github/workflows/ci.yml (tailored to stack)
   - .github/workflows/ai-pr-review.yml (if user wants, with grounded direct_prompt)
   - .github/PULL_REQUEST_TEMPLATE.md (tailored to stack)
4. **Verify** - run the project's actual toolchain to confirm everything works:
   - `npm run build` / `npx tsc --noEmit` (if TS project)
   - `npm run lint` or detected linter
   - `npm test` or detected test runner
   - Report results to user. If something fails, fix it before declaring setup complete.

### Files generated by project-setup skill (NOT static templates)

The following are generated by Claude Code during the interview, tailored to the actual stack:

**`.github/workflows/ci.yml`** - CI pipeline matching detected test runner, linter, TS config.

**`.github/workflows/ai-pr-review.yml`** - AI PR review using anthropics/claude-code-action.
The `direct_prompt` inside MUST:
- Tell Claude to read AGENTS.md + docs/ai/ FIRST as source of truth
- List specific things to check, derived from the project's actual stack
- Explicitly say: "Do NOT invent rules not written in those files"
- Explicitly say: "If no rule covers something, skip it"
- Scope review to PR changes only, not pre-existing code

This prevents hallucination - Claude reviews against written project rules, not imagined best practices.

**`.github/PULL_REQUEST_TEMPLATE.md`** - PR checklist matching actual stack.

### SETUP_WITH_CLAUDE.md

```markdown
# Finish setup with Claude Code

## What just happened

ai-workflow created:
  ✓ AGENTS.md skeleton
  ✓ docs/ai/ with placeholder files
  ✓ .claude/settings.json with Superpowers config
  ✓ .claude/skills/project-setup/ - custom setup skill
  ✓ Superpowers plugin installed

## If Claude Code didn't launch automatically

Open Claude Code in this project and say:

  "finish project setup"

The project-setup skill will:
  1. Read your codebase silently first
  2. Ask you plain-language questions about decisions
     it couldn't infer (one at a time, with examples)
  3. Show you everything before saving
  4. Write AGENTS.md + all docs/ai/ files

This takes about 10-15 minutes.

## GitHub Secrets (for AI PR review)

Go to: GitHub repo → Settings → Secrets → Actions
Add: ANTHROPIC_API_KEY

Note: If your organization is on a Team or Enterprise plan,
you can use native Code Review instead:
Organization settings → Claude Code → Code Review → Configure.
No API key needed.

## Start building

Every new feature starts with:
  /superpowers:brainstorm

Full workflow:
  brainstorm → write-plan → execute-plan → code-review → PR

## Updating context later

If your project evolves significantly, run:
  "update project context"
```

### ai-workflow.json

```json
{
  "version": "1.0.0",
  "installedAt": "{{TIMESTAMP}}",
  "updatedAt": "{{TIMESTAMP}}"
}
```

`{{TIMESTAMP}}` is the only dynamic value - injected by CLI at copy time.

## Error Handling

- Claude Code not found → print install URL, exit 1
- `claude plugin install` fails → warn but continue (files are already copied)
- `claude "finish project setup"` fails → files are still in place, user can retry manually
- Template copy fails (permission) → exit 1 with clear error

## Out of Scope

- No LLM API calls
- No wizard / interactive prompts (except reinitialize check)
- No template engine
- No detection of architecture/stack/test runner (Claude Code does this)
