# Patterns — prmpt-cli

## Typical Command Handler

Commands live in `src/commands/`. Each exports a single async function:

```javascript
import chalk from 'chalk'
import { someUtil } from '../utils/some-util.mjs'

export async function myCommand() {
  try {
    // 1. Detect/validate state
    const state = await detectSomething()

    // 2. Do work
    await doTheWork(state)

    // 3. Report success
    console.log(chalk.green('Done.'))
  } catch (err) {
    console.error(chalk.red('Error:'), err.message)
    process.exit(1)
  }
}
```

### Key patterns:
- **Top-level try/catch** with `chalk.red` error + `process.exit(1)`
- **No abstractions** — direct calls to fs-extra, execa, chalk
- **No classes** — plain functions
- **Sequential steps** — detect state, do work, report

## Typical Utility

Utilities in `src/utils/` export pure or near-pure functions:

```javascript
import fs from 'fs-extra'

export async function detectProject(cwd) {
  const hasGit = await fs.pathExists(path.join(cwd, '.git'))
  const hasPackageJson = await fs.pathExists(path.join(cwd, 'package.json'))

  let projectName = null
  if (hasPackageJson) {
    try {
      const pkg = await fs.readJson(path.join(cwd, 'package.json'))
      projectName = pkg.name || null
    } catch {
      // malformed package.json — continue without name
    }
  }

  return { hasGit, hasPackageJson, projectName }
}
```

### Key patterns:
- **Error swallowing only when fallback is safe** (e.g., malformed JSON → continue without name)
- **Return objects** with named properties, not positional values
- **No side effects** (no console.log in utils — that's the command's job)

## Plugin Installation

Installers in `src/installers/` wrap execa calls:

```javascript
import { execa } from 'execa'

export async function installPlugin(name) {
  try {
    await execa('claude', ['plugin', 'install', `${name}@claude-plugins-official`])
    return { name, success: true }
  } catch {
    return { name, success: false }
  }
}
```

### Key patterns:
- **Return result object** instead of throwing — caller decides how to report
- **Graceful failure** — plugin install failure doesn't stop the workflow

## Edge Cases
- **No git repo:** `init` still works, just skips git-dependent features
- **No package.json:** `projectName` falls back to `null`, AGENTS.md uses placeholder
- **Malformed package.json:** caught silently, treated as missing
- **Plugin install failure:** reported as warning, doesn't block remaining installs
- **Existing AGENTS.md:** user prompted to reinit/update/cancel before any changes
