# PRODUCT.md

## What It Is

A lightweight, login-free task manager for small teams. A team gets a single shared link — anyone with the link sees and edits the same task board. No accounts, no onboarding, no friction.

## The Problem It Solves

Small teams (student groups, early startup squads) waste time on task coordination overhead: spreadsheets go stale, chat threads get lost, full project tools like Jira are overkill. This tool gives a team a shared task board they can open in seconds and actually use during a sprint.

Without this tool: tasks live in Slack threads and Google Docs, nothing has a clear owner, nothing has a priority, and nobody knows what's actually blocking the sprint.

With this tool: every task is visible to the whole team, has an owner, has a priority, and the board is the single source of truth.

## Who Uses It

**Primary persona — Small team member (3–8 people)**
- Student project groups mid-sprint, or early startup squads running a weekly cycle
- Not technical necessarily; expects a tool that works immediately without setup
- Opens the shared link on whatever device they're on (laptop, phone)
- Creates tasks in under 5 seconds, assigns to a teammate, sets priority, moves on
- Doesn't want to log in or manage an account

**No admin persona.** There is no owner, no role hierarchy. Everyone with the link has full edit access.

## Core User Flows

### Flow 1 — Starting a team board
1. One team member visits the app (e.g., root URL or a "create board" action)
2. A unique board link is generated
3. That person shares the link with teammates (copy/paste, message)
4. Teammates open the link — the board is immediately visible and editable

### Flow 2 — Creating a task
1. Team member opens the shared board link
2. Clicks "Add task" (or equivalent)
3. Enters task title
4. (Optional) assigns to a team member name
5. Sets priority: low / medium / high
6. Submits — task appears on the board instantly for all viewers

### Flow 3 — Editing a task
1. Team member clicks on an existing task
2. Changes title, assignee, and/or priority
3. Saves — change is visible to the whole team

### Flow 4 — Deleting a task
1. Team member clicks delete on a task
2. Task is removed from the board

### Flow 5 — Managing the sprint
1. Team opens the board at the start of a sprint
2. They create tasks for the week, assign each to a person
3. During the sprint, members update their tasks
4. At the end of the sprint, all tasks are visible with their current state

## Key Domain Concepts

| Term | Meaning |
|---|---|
| **Board** | A shared task list identified by a unique link. One team = one board (for MVP). |
| **Task** | A unit of work with a title, assignee, priority, and a `completed` boolean (already in the codebase). Whether "completed" is surfaced as a visible checkbox in the MVP UI is an open question — it was not explicitly included or excluded in the product description. **Needs a decision before building the task card.** |
| **Member** | A name on the board — not an account. Members are defined by the names assigned to tasks, not by login. A team member types their own name when assigning. |
| **Priority** | One of three levels: `low`, `medium`, `high`. Displayed visually on the task card. |
| **Board link** | The unique URL that identifies the board. Anyone with the link can read and write. |

> **Architecture note:** The current codebase has a `user_id` field on tasks, implying an authenticated user model. This is incorrect for the intended product. Identity is board-scoped and member-name-based. `user_id` should be replaced with `assignee` (a plain string name) and the board concept needs a `board_id` (the shared identifier). This is a significant schema mismatch to resolve before development.

## User Stories with Acceptance Criteria (MVP)

### US-1: Create a task

**As a team member, I want to create a task so that the team can track work.**

Acceptance criteria:
- Given I am on the board, when I submit a task title, then a new task appears on the board within 5 seconds
- The task displays: title, assignee (if set), priority badge
- Priority defaults to `medium` if not set
- Empty title is rejected with an inline error — task is not created
- Task is immediately visible if another team member refreshes the board

### US-2: Assign a task to a team member

**As a team member, I want to assign a task to someone so that ownership is clear.**

Acceptance criteria:
- Assignee is a free-text name field (not a dropdown of registered users)
- Assignee name is displayed on the task card
- A task can be unassigned (assignee field left blank)
- Assignee can be changed via edit

### US-3: Set task priority

**As a team member, I want to set a priority so that we know what to work on first.**

Acceptance criteria:
- Priority is one of: `low`, `medium`, `high`
- Priority is visually distinct on the task card (e.g., color badge)
- Priority can be changed via edit
- Filtering by priority is a v2 feature — not required in MVP

### US-4: Edit a task

**As a team member, I want to edit a task so that I can update its details as things change.**

Acceptance criteria:
- I can change: title, assignee, priority
- Changes persist after page refresh
- Empty title on save is rejected with an inline error

### US-5: Delete a task

**As a team member, I want to delete a task so that the board stays clean.**

Acceptance criteria:
- A deleted task disappears from the board
- Deletion is immediate (no undo in MVP)
- Deletion is visible to other team members on next refresh

### US-6: Share a board via link

**As a team member, I want to share the board link so that my team can access it without creating accounts.**

Acceptance criteria:
- Opening the board link shows the board with no login prompt
- The link works on any device and browser
- Anyone with the link can create, edit, and delete tasks
- The link is persistent — it does not expire

## Concurrent Editing

**This has not been fully resolved.** When two people edit the same task simultaneously, one person's changes will silently overwrite the other's (last-write-wins at the database level).

For MVP: accept last-write-wins. Do not implement optimistic locking or conflict UI.

**Risk:** teams will hit this during active sprints. A future version should use Supabase Realtime subscriptions to detect and surface conflicts, or switch to operational transform. This must be tracked as a known limitation.

**Developer note:** do NOT implement stale-check logic in MVP. Log a TODO comment near the update function.

## Success Metrics

- A team can create a board, share the link, and have all members on it in under 60 seconds
- A single task (title + assignee + priority) can be created in under 5 seconds
- Sharing the board link works instantly — no loading state longer than 2 seconds on initial open
- A team of 3–8 can manage a full sprint (create, update, delete tasks over 1 week) without hitting data loss or broken state

## Explicit Non-Goals (MVP)

- No user accounts or authentication
- No due dates (v2)
- No filtering by assignee or priority (v2)
- No multiple boards per team (one board per link, period)
- No task comments or activity history
- No notifications (email, push, in-app)
- No undo / soft delete
- No real-time live updates (v2 with Supabase Realtime)
- No mobile-native app — web only
- No export or integrations
