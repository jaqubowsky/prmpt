# prmpt-cli

## Project Overview
CLI tool that scaffolds AI-first development workflows for any project using Claude Code. One command (`npx prmpt-cli`) copies templates, installs plugins, runs an interactive interview skill, and generates comprehensive project documentation — so Claude Code has full context from day one.

## Architecture Pattern
Template-based scaffolding CLI in pure ESM JavaScript — see @docs/ai/ARCHITECTURE.md for details.

## Project Structure
```
bin/
  cli.mjs                  # Entry point (Commander setup)
src/
  commands/
    init.mjs               # Init command (scaffold + launch interview)
    update.mjs              # Smart template update (no overwrite of user edits)
  installers/
    superpowers.mjs         # Plugin installation via execa
  utils/
    banner.mjs              # ASCII art banner
    copy-templates.mjs      # Template copying + variable injection
    detect.mjs              # Project detection (git, package.json, etc.)
templates/                  # Scaffolding templates (12 files)
  claude/
    settings.json
    skills/project-setup/
      SKILL.md              # Interview skill definition
  docs/ai/                  # 6 doc templates
docs/ai/                    # This project's own documentation
```

## Data Layer
No database or external data — reads/writes local files and shells out to `claude` CLI.

## AI Working Rules
### ALWAYS
- Use context7 MCP to check documentation before using any library, framework, or tool — even familiar ones. Your training data may be outdated.
- Use LSP for code navigation: `goToDefinition`, `findReferences`, `hover` instead of grep. Run `findReferences` before renaming or changing signatures. Check LSP diagnostics after edits.
- Read the source file before proposing changes — understand existing patterns first.
- Keep templates/ in sync: if you change the structure of a generated file, update the template AND the SKILL.md that describes it.
- Test `init` and `update` flows manually after changes — there are no automated tests yet.

### NEVER
- Modify `templates/` without explicit user approval — changes affect all downstream users.
- Modify `package.json` (version, deps, bin) without explicit user approval.
- Modify `.claude/skills/project-setup/SKILL.md` without explicit user approval — this is the core interview UX.
- Add dependencies without justification — this is a lightweight CLI tool (4 deps).

### WHEN IN DOUBT
- Stop and ask the user.
- Read the relevant docs/ai/ file.

## References
- Product context:           @docs/ai/PRODUCT.md
- Roadmap & priorities:      @docs/ai/ROADMAP.md
- Coding conventions:        @docs/ai/CONVENTIONS.md
- Component patterns:        @docs/ai/PATTERNS.md
- Testing strategy:          @docs/ai/TESTING.md
- Architecture decisions:    @docs/ai/ARCHITECTURE.md

## PR Checklist
Not applicable — pushing directly to main.
