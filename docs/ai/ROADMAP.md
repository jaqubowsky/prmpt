# Roadmap — prmpt-cli

## Current State
MVP complete and published as v1.0.5 on npm. All core features working:
- `init` command with template scaffolding
- `update` command with smart diffing
- Interview skill (4-phase)
- Plugin audit (stack-specific)
- 6 base plugins installed automatically

## Next Phase: Developer Experience
No deadline set. To be done together as one migration:
- **TypeScript migration** — convert .mjs to .ts, add tsconfig, build step
- **Testing** — add test runner (likely Vitest), prioritize:
  - `update.mjs` — complex diffing/versioning logic
  - `copy-templates.mjs` — variable injection
- **Biome** — linter + formatter, replace informal code style with enforced rules

## Deferred / No Timeline
- CI/CD for prmpt-cli itself (GitHub Actions)
- Additional commands beyond init/update
- Plugin marketplace or custom plugin support

## Constraints
- None currently. No deadlines, no external dependencies.
