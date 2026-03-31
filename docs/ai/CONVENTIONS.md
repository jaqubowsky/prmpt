# Conventions — prmpt-cli

## File Naming
- **kebab-case** for all files: `copy-templates.mjs`, `detect.mjs`
- **Extension:** `.mjs` (ESM modules)
- **Entry point:** `bin/cli.mjs`

## Exports
- **Named exports only** — no default exports
- Example: `export function initCommand()`, `export const PATH_MAP`

## Imports
- Full relative paths **with extension**: `import { detectProject } from '../utils/detect.mjs'`
- Package imports without paths: `import chalk from 'chalk'`

## Code Style
- **No semicolons**
- **Single quotes** for strings
- **No enforced formatter** (Biome planned for later)
- **Async/await** for all async operations (no raw promises)

## Folder Structure
```
bin/          → CLI entry points
src/commands/ → Command handlers (one file per command)
src/utils/    → Shared utilities
src/installers/ → Plugin/tool installation logic
templates/    → Scaffolding templates shipped with the package
docs/ai/      → This project's own AI documentation
```

## Naming
- Command files: verb name matching CLI command (`init.mjs`, `update.mjs`)
- Utility files: descriptive of function (`detect.mjs`, `banner.mjs`, `copy-templates.mjs`)
- Functions: camelCase, descriptive (`detectProject`, `copyTemplates`, `installPlugins`)
- Constants: UPPER_SNAKE_CASE (`PATH_MAP`, `REQUIRED_PLUGINS`, `ALWAYS_UPDATE`)

## Dependencies
- Keep minimal — currently 4 deps (chalk, commander, execa, fs-extra)
- Justify any new dependency before adding
