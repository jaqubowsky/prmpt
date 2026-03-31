# Testing Strategy — prmpt-cli

## Current State
No automated tests. The project is ~300 LOC with straightforward logic. Testing is planned as part of the TypeScript migration (see ROADMAP.md).

## What Should Be Tested (Priority Order)

### High Priority
1. **`update.mjs`** — Complex decision logic:
   - ALWAYS_UPDATE vs NEVER_AUTO_UPDATE vs prompt-based update
   - Version comparison
   - Detection of user-modified files vs untouched templates
   - Edge case: missing `.claude/prmpt.json`

2. **`copy-templates.mjs`** — Template processing:
   - `[PROJECT_NAME]` injection into AGENTS.md
   - Timestamp injection into prmpt.json
   - All 12 files copied to correct paths
   - Idempotency (running twice doesn't corrupt files)

### Medium Priority
3. **`detect.mjs`** — Project detection:
   - Correctly identifies git, package.json, AGENTS.md, .claude/
   - Handles malformed package.json
   - Handles missing files gracefully

### Low Priority / Not Worth Testing
- **`banner.mjs`** — Pure visual output, no logic
- **`cli.mjs`** — Commander wiring, tested by using the CLI
- **`installers/superpowers.mjs`** — Thin wrapper around execa, would require mocking `claude` CLI

## Planned Setup
- **Runner:** Vitest (fast, ESM-native, good DX)
- **Style:** To be decided during implementation
- **Location:** To be decided during implementation
- **Mocking:** Minimal — mock filesystem (fs-extra) and process execution (execa), not business logic

## Manual Testing (Current)
Until automated tests exist, test changes manually:
1. Run `npx . init` in a test directory
2. Verify all 12 files are created with correct content
3. Run `npx . update` and verify smart diffing behavior
4. Check that `claude` launches with the interview skill
