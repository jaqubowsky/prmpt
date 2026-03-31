# Architecture — prmpt-cli

## Stack
- **Runtime:** Node.js >=18
- **Module system:** ESM (`"type": "module"`, `.mjs` files)
- **Language:** JavaScript (TypeScript migration planned)
- **CLI framework:** Commander
- **File operations:** fs-extra
- **Process execution:** execa
- **Terminal styling:** chalk

## Why This Stack
- **Pure JS, no build step:** The CLI is simple (~300 LOC). TypeScript would add build complexity for minimal gain at this stage. Planned for later as the project grows.
- **ESM-only:** Modern Node.js, no CommonJS compatibility needed. Matches the ecosystem direction.
- **Commander:** Standard CLI framework, well-documented, minimal overhead.
- **execa:** Needed to spawn `claude` CLI with inherited stdio for interactive interview.
- **fs-extra:** Convenience over raw `fs` — `pathExists`, `readJson`, `copy` simplify template operations.
- **chalk:** Terminal colors for user feedback. Considered alternatives: none needed, chalk is standard.

## Data Flow

```
npx prmpt-cli
    │
    ▼
cli.mjs ─── Commander parses args
    │
    ▼
initCommand()
    ├── isClaudeInstalled() ── execa('claude', ['--version'])
    │                          └── Exit with error if not found
    ├── detectProject(cwd) ── Check: .git/, package.json, AGENTS.md, .claude/
    │                          └── Extract projectName from package.json
    ├── [If AGENTS.md exists] ── Prompt: reinit / update / cancel
    ├── copyTemplates() ── Copy 12 files from templates/ to project root
    │                      ├── Inject projectName into AGENTS.md
    │                      └── Inject timestamps into .claude/prmpt.json
    ├── installPlugins() ── Loop 6 plugins:
    │                        └── execa('claude', ['plugin', 'install', ...])
    └── execa('claude', ['finish project setup'], { stdio: 'inherit' })
         └── Launches interactive interview in Claude Code
```

```
npx prmpt-cli update
    │
    ▼
updateCommand()
    ├── Read .claude/prmpt.json (current version + timestamps)
    ├── Compare with bundled version
    └── For each of 12 files:
         ├── ALWAYS_UPDATE (SKILL.md) → auto-copy
         ├── File missing → auto-copy
         ├── File unchanged → skip
         ├── NEVER_AUTO_UPDATE (docs/ai/*, AGENTS.md) → prompt user
         └── Other → prompt user
```

## Key Decisions

### Template-based scaffolding (not code generation)
Templates are static files with minimal variable injection (`[PROJECT_NAME]`, timestamps). This keeps the tool predictable — users see exactly what they'll get by looking at `templates/`.

**Rejected alternative:** Dynamic code generation based on detected stack. Too complex, too fragile, and the interview skill handles project-specific customization anyway.

### Interview as a Claude Code skill (not built-in logic)
The interview runs inside Claude Code via SKILL.md, not as prmpt-cli code. This means:
- Zero LLM API calls from prmpt-cli itself
- The interview benefits from Claude Code's full capabilities
- Users can re-run the interview independently (`claude finish project setup`)

**Rejected alternative:** Embedding an LLM client in the CLI. Would require API keys, add latency, increase complexity, and duplicate what Claude Code already does.

### Graceful plugin failure
Plugin installation failures are warnings, not errors. The setup continues. This prevents a single network hiccup from blocking the entire workflow.

### Smart update (never silent overwrite)
The update command categorizes files into ALWAYS_UPDATE, NEVER_AUTO_UPDATE, and prompt-based. This protects user edits while allowing safe auto-updates (like SKILL.md which users don't edit).

## Integration Points
- **Claude Code CLI** — spawned via execa for plugin installation and interview launch
- **npm registry** — distributed as `prmpt-cli` package
- **Git** — detected for project awareness, not required
