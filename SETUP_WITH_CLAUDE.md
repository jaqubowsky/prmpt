# Finish setup with Claude Code

## What just happened

prmpt created:
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
/using-superpowers

Full workflow:
brainstorm → write-plan → execute-plan → code-review → PR

## Updating context later

If your project evolves significantly, run:
"update project context"
