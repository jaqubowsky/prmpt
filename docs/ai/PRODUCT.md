# Product Context — prmpt-cli

## What It Is
A CLI tool that sets up any project for AI-first development with Claude Code. One command scaffolds documentation, installs plugins, and runs an interactive interview that generates comprehensive project context — so Claude Code understands the project deeply from the first session.

## The Problem
Most developers starting with Claude Code don't know **what instructions to give it** or **how to structure project context** for an AI agent to work effectively. They end up with a bare CLAUDE.md or nothing at all, and Claude Code lacks the context to make good decisions. Power users know what to do but waste time repeating the same boilerplate setup for every project.

## Who Uses It

### Primary Persona: Developer New to Claude Code
- Has a project (or is starting one)
- Installed Claude Code but doesn't know how to configure it well
- Needs guidance — the interview skill walks them through product, technical, and workflow decisions
- **Value:** gets a professional AI-first setup without knowing the best practices

### Secondary Persona: Experienced Claude Code User
- Knows what good project context looks like
- Doesn't want to manually create AGENTS.md, docs/ai/, settings.json every time
- **Value:** saves 30+ minutes of boilerplate setup per project

## Core User Flow

1. User has a project (or empty folder) with Claude Code installed
2. Runs `npx prmpt-cli`
3. prmpt-cli detects project structure (git, package.json, existing config)
4. Copies 12 template files (CLAUDE.md, AGENTS.md, docs/ai/, .claude/)
5. Installs 6 base plugins (superpowers, context7, github, commit-commands, figma, claude-code-setup)
6. Launches Claude Code with `finish project setup` prompt
7. Claude Code reads the codebase silently, then starts 4-phase interview:
   - **Phase A:** Product — what, who, why, flows, features, metrics
   - **Phase B:** Roadmap — priorities, deadlines, constraints
   - **Phase C:** Technical — stack, architecture, data, testing, conventions
   - **Phase D:** Working rules — boundaries, workflow
8. Generates 7 documentation files (AGENTS.md + 6x docs/ai/)
9. Runs plugin audit — installs stack-specific plugins (LSP for detected language, Playwright, Supabase, etc.)
10. User starts developing with full Claude Code context

### Update Flow
1. User runs `npx prmpt-cli update`
2. Compares bundled templates with installed versions
3. Auto-updates safe files (SKILL.md)
4. Prompts before overwriting user-edited files
5. Never silently overwrites user changes

## User Stories & Acceptance Criteria

### US-1: First-time setup
**As a** developer new to Claude Code, **I want to** run one command to configure my project, **so that** Claude Code has full context without me knowing the best practices.

**Acceptance criteria:**
- `npx prmpt-cli` works without prior installation
- All 12 template files are copied to correct locations
- 6 base plugins are installed (with graceful failure messages if any fail)
- Claude Code launches and starts the interview automatically
- Interview generates AGENTS.md + 6 docs/ai/ files with project-specific content
- Plugin audit recommends and installs stack-appropriate plugins

### US-2: Smart update
**As a** user who has already set up prmpt-cli, **I want to** update to newer templates without losing my edits, **so that** I get improvements without redoing my work.

**Acceptance criteria:**
- `npx prmpt-cli update` detects version differences
- SKILL.md always updates (safe — no user edits expected)
- User-edited files (AGENTS.md, docs/ai/*) prompt before overwriting
- Unchanged files skip silently
- `.claude/prmpt.json` timestamps update after successful update

### US-3: Existing project detection
**As a** user running `npx prmpt-cli` on a project that already has AGENTS.md, **I want to** choose between reinitializing or updating, **so that** I don't accidentally overwrite my existing setup.

**Acceptance criteria:**
- Detects existing AGENTS.md and prompts: reinit / update / cancel
- Choosing update routes to update flow
- Choosing cancel exits cleanly

### US-4: Interview generates useful docs
**As a** developer, **I want** the interview to produce documentation that is **actually useful for Claude Code**, **so that** subsequent sessions have full project context.

**Acceptance criteria:**
- Interview asks one question at a time
- Pushes back on vague answers
- Covers all 4 phases before generating docs
- Generated docs are specific to the project (not generic boilerplate)
- AGENTS.md stays under ~80 lines

## Success Metrics
- User goes from `npx prmpt-cli` to fully configured project in **one session**
- After setup, Claude Code has full project context and doesn't ask redundant questions
- `update` never silently overwrites user changes
- Interview produces documentation that is project-specific, not generic boilerplate

## Non-Goals
- **Not a code generator** — doesn't create application code, components, APIs, or schemas
- **Not an LLM API caller** — zero API calls, all intelligence from Claude Code + bundled skill
- **Not production deployment** — generates CI/CD workflow files (GitHub Actions for tests, AI PR review) but doesn't manage hosting, servers, or CD pipelines
- **Not framework-specific** — works with any stack, any language
