# ai-workflow CLI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CLI that scaffolds AI-first development workflow files and launches Claude Code to finish setup.

**Architecture:** Single entry point (`bin/cli.mjs`) dispatches to `init` or `update` commands. Init copies static templates from bundled `templates/` dir to CWD, installs Superpowers plugin, and launches Claude Code. No LLM calls, no wizard, no template engine.

**Tech Stack:** Node.js >=18, ESM, chalk, commander, execa, fs-extra

---

## File Structure

```
ai-workflow/
├── bin/cli.mjs                          ← entry point, commander setup, banner
├── src/
│   ├── commands/init.mjs                ← init flow (detect → guard → copy → install → launch)
│   ├── commands/update.mjs              ← update flow (compare → confirm → overwrite)
│   ├── installers/superpowers.mjs       ← claude plugin install wrapper
│   └── utils/
│       ├── detect.mjs                   ← check CWD for .git, package.json, AGENTS.md, .claude
│       ├── copy-templates.mjs           ← copy templates/ to CWD with path mapping
│       └── banner.mjs                   ← print CLI banner
├── templates/
│   ├── AGENTS.md
│   ├── SETUP_WITH_CLAUDE.md
│   ├── docs/ai/CONVENTIONS.md
│   ├── docs/ai/PATTERNS.md
│   ├── docs/ai/TESTING.md
│   ├── docs/ai/ARCHITECTURE.md
│   ├── claude/settings.json
│   ├── claude/skills/project-setup/SKILL.md
│   └── ai-workflow.json
├── package.json
└── .gitignore
```

---

### Task 1: Project scaffold + package.json

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/kubunito/Work/ai-workflow
git init
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "ai-workflow",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "ai-workflow": "./bin/cli.mjs"
  },
  "dependencies": {
    "chalk": "^5.4.1",
    "commander": "^13.1.0",
    "execa": "^9.5.2",
    "fs-extra": "^11.3.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, `package-lock.json` generated.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: init project with dependencies"
```

---

### Task 2: Banner utility

**Files:**
- Create: `src/utils/banner.mjs`

- [ ] **Step 1: Create banner.mjs**

```js
import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function printBanner() {
  const pkg = JSON.parse(
    readFileSync(join(__dirname, '../../package.json'), 'utf-8')
  );
  const v = pkg.version;

  console.log(chalk.cyan('╔══════════════════════════════════════╗'));
  console.log(chalk.cyan(`║    ai-workflow · v${v.padEnd(19)}║`));
  console.log(chalk.cyan('║  Claude Code + Superpowers + TDD     ║'));
  console.log(chalk.cyan('╚══════════════════════════════════════╝'));
  console.log();
}
```

- [ ] **Step 2: Verify manually**

```bash
node -e "import('./src/utils/banner.mjs').then(m => m.printBanner())"
```

Expected: Banner prints with version 1.0.0.

- [ ] **Step 3: Commit**

```bash
git add src/utils/banner.mjs
git commit -m "feat: add banner utility"
```

---

### Task 3: Detect utility

**Files:**
- Create: `src/utils/detect.mjs`

- [ ] **Step 1: Create detect.mjs**

```js
import { existsSync } from 'node:fs';
import { readJson } from 'fs-extra/esm';
import { join } from 'node:path';

export async function detectProject(cwd) {
  const result = {
    hasGit: existsSync(join(cwd, '.git')),
    hasPackageJson: existsSync(join(cwd, 'package.json')),
    hasAgentsMd: existsSync(join(cwd, 'AGENTS.md')),
    hasClaude: existsSync(join(cwd, '.claude')),
    projectName: null,
  };

  if (result.hasPackageJson) {
    try {
      const pkg = await readJson(join(cwd, 'package.json'));
      result.projectName = pkg.name || null;
    } catch {
      // malformed package.json - ignore
    }
  }

  return result;
}
```

- [ ] **Step 2: Verify manually**

```bash
node -e "import('./src/utils/detect.mjs').then(m => m.detectProject(process.cwd()).then(console.log))"
```

Expected: Object with all fields, `hasPackageJson: true`, `projectName: 'ai-workflow'`.

- [ ] **Step 3: Commit**

```bash
git add src/utils/detect.mjs
git commit -m "feat: add project detection utility"
```

---

### Task 4: Copy templates utility

**Files:**
- Create: `src/utils/copy-templates.mjs`

- [ ] **Step 1: Create copy-templates.mjs**

```js
import { copy, readFile, writeFile, readJson, writeJson, ensureDir } from 'fs-extra/esm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../../templates');

const PATH_MAP = [
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { src: 'SETUP_WITH_CLAUDE.md', dest: 'SETUP_WITH_CLAUDE.md' },
  { src: 'docs/ai/CONVENTIONS.md', dest: 'docs/ai/CONVENTIONS.md' },
  { src: 'docs/ai/PATTERNS.md', dest: 'docs/ai/PATTERNS.md' },
  { src: 'docs/ai/TESTING.md', dest: 'docs/ai/TESTING.md' },
  { src: 'docs/ai/ARCHITECTURE.md', dest: 'docs/ai/ARCHITECTURE.md' },
  { src: 'claude/settings.json', dest: '.claude/settings.json' },
  { src: 'claude/skills/project-setup/SKILL.md', dest: '.claude/skills/project-setup/SKILL.md' },
  { src: 'ai-workflow.json', dest: '.claude/ai-workflow.json' },
];

export async function copyTemplates(cwd, { projectName }) {
  const copied = [];

  for (const { src, dest } of PATH_MAP) {
    const srcPath = join(TEMPLATES_DIR, src);
    const destPath = join(cwd, dest);

    await ensureDir(dirname(destPath));
    await copy(srcPath, destPath);
    copied.push(dest);
  }

  // Inject project name into AGENTS.md
  if (projectName) {
    const agentsPath = join(cwd, 'AGENTS.md');
    let content = await readFile(agentsPath, 'utf-8');
    content = content.replace('[PROJECT_NAME]', projectName);
    await writeFile(agentsPath, content);
  }

  // Inject timestamp into ai-workflow.json
  const jsonPath = join(cwd, '.claude/ai-workflow.json');
  const meta = await readJson(jsonPath);
  const now = new Date().toISOString();
  meta.installedAt = now;
  meta.updatedAt = now;
  await writeJson(jsonPath, meta, { spaces: 2 });

  return copied;
}

export { PATH_MAP };
```

- [ ] **Step 2: Verify manually (dry test in /tmp)**

```bash
mkdir -p /tmp/test-ai-workflow && node -e "
import('./src/utils/copy-templates.mjs')
  .then(m => m.copyTemplates('/tmp/test-ai-workflow', { projectName: 'my-app' }))
  .then(console.log)
  .catch(console.error)
"
```

Expected: Error because templates don't exist yet. That's fine - we'll create them in Task 6.

- [ ] **Step 3: Commit**

```bash
git add src/utils/copy-templates.mjs
git commit -m "feat: add template copy utility"
```

---

### Task 5: Superpowers installer

**Files:**
- Create: `src/installers/superpowers.mjs`

- [ ] **Step 1: Create superpowers.mjs**

```js
import { execa } from 'execa';
import chalk from 'chalk';

export async function installSuperpowers() {
  try {
    await execa('claude', ['plugin', 'install', 'superpowers@superpowers-marketplace']);
    return { success: true };
  } catch (error) {
    console.log(chalk.yellow('⚠ Could not install Superpowers automatically.'));
    console.log(chalk.yellow('  Run manually: claude plugin install superpowers@superpowers-marketplace'));
    return { success: false };
  }
}

export async function isClaudeInstalled() {
  try {
    await execa('claude', ['--version']);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/installers/superpowers.mjs
git commit -m "feat: add superpowers installer and claude check"
```

---

### Task 6: All template files

**Files:**
- Create: `templates/AGENTS.md`
- Create: `templates/SETUP_WITH_CLAUDE.md`
- Create: `templates/docs/ai/CONVENTIONS.md`
- Create: `templates/docs/ai/PATTERNS.md`
- Create: `templates/docs/ai/TESTING.md`
- Create: `templates/docs/ai/ARCHITECTURE.md`
- Create: `templates/claude/settings.json`
- Create: `templates/claude/skills/project-setup/SKILL.md`
- Create: `templates/ai-workflow.json`

- [ ] **Step 1: Create templates/AGENTS.md**

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

- [ ] **Step 2: Create all 4 placeholder docs/ai/ files**

Each file (`templates/docs/ai/CONVENTIONS.md`, `templates/docs/ai/PATTERNS.md`, `templates/docs/ai/TESTING.md`, `templates/docs/ai/ARCHITECTURE.md`) gets the same content:

```markdown
<!-- TODO: Generated by Claude Code during setup.
     Open Claude Code and say: "finish project setup" -->
```

- [ ] **Step 3: Create templates/claude/settings.json**

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

- [ ] **Step 4: Create templates/claude/skills/project-setup/SKILL.md**

This is the largest template. Full content:

````markdown
---
description: Initialize or update AGENTS.md and docs/ai/ by first exploring the codebase, then interviewing the user about decisions that cannot be inferred. Use when the user says "finish setup", "finish project setup", "set up project context", "update AGENTS.md", or when docs/ai/ contains placeholder comments.
---

## Czym jest ten skill

Lacczy dwa podejscia:
1. Explore-first: czyta kodebase zanim zada jakiekolwiek pytanie
2. Grill-me style: relentless interview - nie konczy dopoki kazda
   galaz drzewa decyzyjnego nie jest w pelni rozwiazana

Wynik: kompletne AGENTS.md i docs/ai/ ktore Claude Code moze
uzywac jako source of truth przy kazdej sesji.

## PHASE 1: EXPLORE (cicho, nie narrate)

Przed zadaniem jakiegokolwiek pytania, przeczytaj:
- package.json -> stack, wersje, scripts, dependencies
- Strukture folderow -> jaki wzorzec architektury jest uzywany
- 2-3 istniejace komponenty jesli istnieja -> naming, patterns
- tsconfig.json -> strictness, path aliases
- eslint / biome config -> obowiazujace reguly
- Istniejace testy jesli sa -> jak sa pisane, co testuja
- Obecny AGENTS.md -> co jest placeholder vs co jest wypelnione

Zbuduj dwie listy wewnetrznie:
  KNOWN   = rzeczy ktore mozesz wywnioskowac z confidence
  UNKNOWN = rzeczy ktorych nie mozesz ustalic bez pytania

Nastepnie powiedz:
"Przejrzalem projekt. Oto co juz wiem:
  - [lista KNOWN - 3-5 punktow]

Mam kilka pytan zeby wypelnic reszte.
Bede pytal po jednym na raz - mozesz wybrac opcje
lub powiedziec 'tak' do mojej propozycji."

## PHASE 2: RELENTLESS INTERVIEW

To jest grill-me zastosowany do project setup.

Zasada nadrzedna: kazda odpowiedz albo rozwiazuje
galaz albo otwiera nowe pytania. Nie koncz Phase 2
dopoki WSZYSTKIE galezie nie sa w pelni rozwiazane.

NIE uzywaj stalej listy pytan.
Pytania wynikaja dynamicznie z odpowiedzi.

FORMAT KAZDEGO PYTANIA (bez wyjatkow):

  [Pytanie prostym jezykiem - zero zargonu]

  Na przyklad:
  - Opcja A: [konkretny opis jak to wyglada w praktyce]
  - Opcja B: [konkretny opis]
  - Opcja C: [jesli potrzeba]

  Proponuje: [twoja rekomendacja] bo [jedno zdanie powodu].

ZASADY FOLLOW-UP:
- User mowi "opcja A" -> zapytaj o edge cases tej opcji
- User mowi "zalezy" -> zapytaj od czego, potem kazdy przypadek
- User mowi "nie wiem" -> daj rekomendacje, zapytaj czy pasuje
- User mowi "tak" lub "ok" -> rozwiazane, przejdz dalej
- Nigdy nie porzucaj watku - jesli cos niejasne, idz glebiej

PRZYKLADY JAK PYTANIA MUSZA WYGLADAC:

  ZLE:  "What's your component architecture strategy?"
  DOBRZE: "Kiedy tworzysz nowy feature, gdzie laduja pliki?

    Na przyklad:
    - Wszystko razem: src/features/produkty/ z komponentami,
      logika i testami w jednym miejscu
    - Rozdzielone: duze reuzywalne rzeczy w src/components/,
      rzeczy specyficzne dla feature przy stronie
    - Flat: wszystko w src/components/, bez podfolderow

    Proponuje: wszystko razem w jednym folderze per feature,
    bo widze ze masz kilka oddzielnych sekcji aplikacji."

  ZLE:  "What's your error handling philosophy?"
  DOBRZE: "Co powinno sie pokazac gdy dane sie nie zaladuja?

    Na przyklad:
    - Spinner podczas ladowania, czerwony komunikat przy bledzie
    - Szare placeholder bloki (skeleton) podczas ladowania,
      przycisk 'sprobuj ponownie' przy bledzie
    - Na razie nic specjalnego, tylko dane

    Proponuje: spinner + komunikat bledu, bo to najprostsze
    i nie widze jeszcze skeleton komponentu w projekcie."

  ZLE:  "What's off-limits for Claude?"
  DOBRZE: "Czy sa foldery ktorych Claude absolutnie nie powinien
    zmieniac bez pytania cie najpierw?

    Na przyklad:
    - Folder z logowaniem/auth (latwo cos zepsuc)
    - Pliki konfiguracji bazy danych
    - Wszystko jest ok, bez ograniczen

    Proponuje: zablokuj folder auth jesli masz, bo bledy
    w auth sa najtrudniejsze do debugowania."

GALEZIE KTORE MUSZA BYC ROZWIAZANE
(liczba pytan w kazdej galezi = dynamiczna):

  [STRUCTURE] Gdzie kod mieszka i dlaczego
  [DATA] Jak dane trafiaja do komponentow i co gdy cos failuje
  [COMPONENTS] Co Claude ma i nie ma generowac
  [TESTS] Co jest testowane, co nie jest i dlaczego
  [BOUNDARIES] Czego Claude nie moze ruszac bez pytania
  [WORKFLOW] Rozmiar PR, oczekiwania przy review

Galaz jest rozwiazana tylko gdy mozesz ja zapisac
jednoznacznie w docs/ai/ bez zadnych domyslow.

## PHASE 3: GENERATE

Wejdz w te faze TYLKO gdy wszystkie galezie sa rozwiazane.

Powiedz:
"Mam wszystko co potrzebuje. Oto co zaraz zapiszę -
powiedz jesli cokolwiek wyglada nie tak zanim to zrobie:"

Pokaz kazdy plik w calosci.
Poczekaj na wyrazne potwierdzenie.
Dopiero wtedy zapisz:
  - AGENTS.md (wszystkie placeholdery wypelnione)
  - docs/ai/CONVENTIONS.md
  - docs/ai/PATTERNS.md
  - docs/ai/TESTING.md
  - docs/ai/ARCHITECTURE.md
  - .github/workflows/ci.yml (dopasowany do stacku)
  - .github/workflows/ai-pr-review.yml (jesli user chce)
  - .github/PULL_REQUEST_TEMPLATE.md (dopasowany do stacku)

Zasady dla ai-pr-review.yml:
Uzyj anthropics/claude-code-action@main.
direct_prompt MUSI:
  - Kazac Claude przeczytac AGENTS.md + docs/ai/ NAJPIERW jako source of truth
  - Wylistowac konkretne rzeczy do sprawdzenia, wynikajace z faktycznego stacku
  - Powiedziec wprost: "Do NOT invent rules not written in those files"
  - Powiedziec wprost: "If no rule covers something, skip it"
  - Ograniczyc review do zmian w PR, nie pre-existing code

## PHASE 4: VERIFY

Po zapisaniu wszystkich plikow, uruchom weryfikacje:
- `npm run build` lub `npx tsc --noEmit` (jesli TS project)
- `npm run lint` lub wykryty linter
- `npm test` lub wykryty test runner

Raportuj wyniki uzytkownikowi.
Jesli cos failuje, napraw zanim oglosisz setup jako ukonczony.

Po ukonczeniu:
"Gotowe. Kontekst projektu jest skonfigurowany.

Kazdy nowy feature zaczynaj od:
  /superpowers:brainstorm"
````

- [ ] **Step 5: Create templates/ai-workflow.json**

```json
{
  "version": "1.0.0",
  "installedAt": null,
  "updatedAt": null
}
```

- [ ] **Step 6: Create templates/SETUP_WITH_CLAUDE.md**

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

- [ ] **Step 7: Commit**

```bash
git add templates/
git commit -m "feat: add all template files"
```

---

### Task 7: Init command

**Files:**
- Create: `src/commands/init.mjs`

- [ ] **Step 1: Create init.mjs**

```js
import chalk from 'chalk';
import { execa } from 'execa';
import { createInterface } from 'node:readline';
import { detectProject } from '../utils/detect.mjs';
import { copyTemplates } from '../utils/copy-templates.mjs';
import { installSuperpowers, isClaudeInstalled } from '../installers/superpowers.mjs';

async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function initCommand() {
  const cwd = process.cwd();

  // Step 1: Guard - Claude Code installed?
  const claudeOk = await isClaudeInstalled();
  if (!claudeOk) {
    console.log(chalk.red('✗ Claude Code is required but not found.'));
    console.log();
    console.log('  Install it from: https://docs.anthropic.com/en/docs/claude-code');
    console.log('  Then run ai-workflow again.');
    process.exit(1);
  }

  // Step 2: Detect existing project
  const project = await detectProject(cwd);

  // Step 3: Already initialized?
  if (project.hasAgentsMd) {
    console.log(chalk.yellow('Detected existing ai-workflow config.'));
    const choice = await ask('  [r] Reinitialize  [u] Update  [c] Cancel: ');

    if (choice === 'c' || (!choice && choice !== 'r' && choice !== 'u')) {
      console.log('Cancelled.');
      process.exit(0);
    }
    if (choice === 'u') {
      const { updateCommand } = await import('./update.mjs');
      return updateCommand();
    }
    // choice === 'r' → continue with init
  }

  // Step 4: Copy templates
  console.log();
  const copied = await copyTemplates(cwd, {
    projectName: project.projectName || 'my-project',
  });

  // Step 5: Install Superpowers
  const sp = await installSuperpowers();

  // Step 6: Print summary
  console.log();
  console.log(chalk.green('✓ Created files:'));
  for (const file of copied) {
    console.log(chalk.gray(`  · ${file}`));
  }
  console.log();
  if (sp.success) {
    console.log(chalk.green('✓ Superpowers installed'));
  } else {
    console.log(chalk.yellow('⚠ Superpowers: manual install needed'));
  }

  // Step 7: Launch Claude Code
  console.log();
  console.log(chalk.cyan('⚡ Launching Claude Code to finish setup...'));
  console.log();

  try {
    await execa('claude', ['finish project setup'], { stdio: 'inherit' });
  } catch {
    console.log();
    console.log(chalk.yellow('Claude Code session ended.'));
    console.log('You can resume setup anytime by running:');
    console.log(chalk.cyan('  claude "finish project setup"'));
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/commands/init.mjs
git commit -m "feat: add init command"
```

---

### Task 8: Update command

**Files:**
- Create: `src/commands/update.mjs`

- [ ] **Step 1: Create update.mjs**

```js
import chalk from 'chalk';
import { readJson, writeJson, copy, readFile, ensureDir } from 'fs-extra/esm';
import { createInterface } from 'node:readline';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PATH_MAP } from '../utils/copy-templates.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../../templates');

const ALWAYS_UPDATE = [
  '.claude/skills/project-setup/SKILL.md',
  '.claude/ai-workflow.json',
];

const NEVER_AUTO_UPDATE = [
  'AGENTS.md',
  'docs/ai/CONVENTIONS.md',
  'docs/ai/PATTERNS.md',
  'docs/ai/TESTING.md',
  'docs/ai/ARCHITECTURE.md',
];

async function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function updateCommand() {
  const cwd = process.cwd();
  const metaPath = join(cwd, '.claude/ai-workflow.json');

  if (!existsSync(metaPath)) {
    console.log(chalk.red('✗ No ai-workflow installation found.'));
    console.log('  Run ai-workflow init first.');
    process.exit(1);
  }

  const currentMeta = await readJson(metaPath);
  console.log(chalk.gray(`Current version: ${currentMeta.version}`));

  const bundledMeta = await readJson(join(TEMPLATES_DIR, 'ai-workflow.json'));
  console.log(chalk.gray(`Bundled version: ${bundledMeta.version}`));
  console.log();

  let updated = 0;

  for (const { src, dest } of PATH_MAP) {
    const srcPath = join(TEMPLATES_DIR, src);
    const destPath = join(cwd, dest);

    if (ALWAYS_UPDATE.includes(dest)) {
      await ensureDir(dirname(destPath));
      await copy(srcPath, destPath);
      console.log(chalk.green(`  ✓ ${dest} (auto-updated)`));
      updated++;
      continue;
    }

    if (!existsSync(destPath)) {
      await ensureDir(dirname(destPath));
      await copy(srcPath, destPath);
      console.log(chalk.green(`  ✓ ${dest} (new file)`));
      updated++;
      continue;
    }

    const currentContent = await readFile(destPath, 'utf-8');
    const bundledContent = await readFile(srcPath, 'utf-8');

    if (currentContent === bundledContent) {
      continue; // no changes
    }

    if (NEVER_AUTO_UPDATE.includes(dest)) {
      const answer = await ask(`  Update ${dest}? (y/n): `);
      if (answer === 'y') {
        await copy(srcPath, destPath);
        console.log(chalk.green(`  ✓ ${dest}`));
        updated++;
      } else {
        console.log(chalk.gray(`  · ${dest} (skipped)`));
      }
      continue;
    }

    const answer = await ask(`  Update ${dest}? (y/n): `);
    if (answer === 'y') {
      await copy(srcPath, destPath);
      console.log(chalk.green(`  ✓ ${dest}`));
      updated++;
    } else {
      console.log(chalk.gray(`  · ${dest} (skipped)`));
    }
  }

  // Update metadata
  const now = new Date().toISOString();
  await writeJson(metaPath, { ...bundledMeta, installedAt: currentMeta.installedAt, updatedAt: now }, { spaces: 2 });

  console.log();
  if (updated > 0) {
    console.log(chalk.green(`✓ Updated ${updated} file(s).`));
  } else {
    console.log(chalk.gray('No updates needed.'));
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/commands/update.mjs
git commit -m "feat: add update command"
```

---

### Task 9: CLI entry point

**Files:**
- Create: `bin/cli.mjs`

- [ ] **Step 1: Create bin/cli.mjs**

```js
#!/usr/bin/env node

import { Command } from 'commander';
import { printBanner } from '../src/utils/banner.mjs';
import { initCommand } from '../src/commands/init.mjs';
import { updateCommand } from '../src/commands/update.mjs';

const program = new Command();

printBanner();

program
  .name('ai-workflow')
  .description('Scaffold AI-first development workflow')
  .version('1.0.0');

program
  .command('init', { isDefault: true })
  .description('Initialize ai-workflow in current project')
  .action(initCommand);

program
  .command('update')
  .description('Update ai-workflow templates to latest version')
  .action(updateCommand);

program.parse();
```

- [ ] **Step 2: Make executable**

```bash
chmod +x bin/cli.mjs
```

- [ ] **Step 3: Test locally**

```bash
node bin/cli.mjs --help
```

Expected: Banner prints, then help output with `init` and `update` commands listed.

- [ ] **Step 4: Commit**

```bash
git add bin/cli.mjs
git commit -m "feat: add CLI entry point"
```

---

### Task 10: End-to-end test in temp directory

**Files:** none (manual verification)

- [ ] **Step 1: Create a test project**

```bash
mkdir -p /tmp/test-project && cd /tmp/test-project && npm init -y
```

- [ ] **Step 2: Run ai-workflow init**

```bash
cd /tmp/test-project && node /Users/kubunito/Work/ai-workflow/bin/cli.mjs
```

Expected:
1. Banner prints
2. Files are copied (AGENTS.md, docs/ai/*, .claude/*, SETUP_WITH_CLAUDE.md)
3. Superpowers install attempted
4. Claude Code launches with "finish project setup"

- [ ] **Step 3: Verify created files**

```bash
ls -la /tmp/test-project/AGENTS.md /tmp/test-project/SETUP_WITH_CLAUDE.md /tmp/test-project/docs/ai/ /tmp/test-project/.claude/settings.json /tmp/test-project/.claude/skills/project-setup/SKILL.md /tmp/test-project/.claude/ai-workflow.json
```

Expected: All files exist.

- [ ] **Step 4: Verify AGENTS.md has project name injected**

```bash
head -1 /tmp/test-project/AGENTS.md
```

Expected: `# test-project` (from package.json name)

- [ ] **Step 5: Test update command**

```bash
cd /tmp/test-project && node /Users/kubunito/Work/ai-workflow/bin/cli.mjs update
```

Expected: Shows current/bundled versions, no updates needed (same version).

- [ ] **Step 6: Test reinitialize detection**

```bash
cd /tmp/test-project && node /Users/kubunito/Work/ai-workflow/bin/cli.mjs
```

Expected: "Detected existing ai-workflow config" prompt with r/u/c options.

- [ ] **Step 7: Cleanup**

```bash
rm -rf /tmp/test-project
```

- [ ] **Step 8: Commit any fixes from e2e testing**

```bash
git add -A && git commit -m "fix: adjustments from e2e testing"
```

(Skip if no fixes needed.)
