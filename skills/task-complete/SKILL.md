---
name: task-complete
description: Complete a task and update MindContext state. Use after feature-dev finishes or after direct implementation. Triggers on "task complete", "done with task", "finish task", "mark task done".
---

# Task Complete

Finalize a task and update project state after implementation.

## When to Use

- After feature-dev Phase 7 (Summary) completes
- After direct implementation of a simple task
- When user says "task complete", "done with task", "finish task"
- When user says "mark task done" or "close task"

## Workflow Overview

```
task-complete
    │
    ├── 1. Identify the task
    ├── 2. Verify completion
    ├── 3. Update task file
    ├── 4. Update progress
    ├── 5. Update epic status
    ├── 6. Git sync (optional)
    └── 7. Suggest next task
```

---

## Instructions

When triggered, perform these steps IN ORDER:

### 1. Identify the Task

Determine which task to complete:
- Check `.project/context/focus.json` for `current_issue`
- If no focus set, ask user which task number
- Locate task file in `.project/epics/{epic}/{number}.md`

### 2. Verify Completion

Before marking complete, verify:
- **Tests pass** (if applicable) - run project's test command
- **Code committed** - check `git status` for uncommitted changes
- **No pending work** - review task acceptance criteria

If verification fails:
```
Cannot mark task complete:
- [ ] Tests failing (run: npm test)
- [ ] Uncommitted changes (3 files)
- [ ] Acceptance criteria #2 not met

Options:
1. Fix issues and try again
2. Mark complete anyway (skip verification)
3. Cancel
```

### 3. Update Task File

Update the task file frontmatter:
- Change `status: in_progress` to `status: done`
- Add `completed: {timestamp}` with current UTC timestamp

### 4. Update Progress

Update `.project/context/progress.md`:

Add to "Completed Today" or "Session Summary" section:
```
- [x] {task-title} ({epic-name}) - {timestamp}
```

Remove from "In Progress" section if present.

### 5. Update Epic Status

Check epic progress:
- Count total tasks in `.project/epics/{epic}/`
- Count completed tasks (status: done)
- Calculate completion percentage

If epic has progress tracking in `epic.md`, update it:
```
## Progress
- Completed: {n}/{total} tasks ({percentage}%)
```

### 5b. Tidy Epic File (if needed)

**Goal:** Keep epic.md focused on remaining work as tasks complete.

**When to tidy:**
- epic.md exceeds ~120 lines
- More than 3 tasks now complete
- Verbose completed task details exist inline in epic.md

**What to archive:**
If epic.md contains detailed descriptions of completed tasks (beyond the task table), move them to:
```
.project/context/archive/epics/{epic-name}/completed-tasks.md
```

**Archive format:**
```markdown
# Completed Tasks - {epic-name}

## Task 001: {title}
Completed: {date}

{original detailed description from epic.md}

---

## Task 002: {title}
...
```

**Keep in epic.md:**
- Frontmatter
- Technical Overview (architecture summary)
- Task status table (compact)
- Active phase details
- Remaining task context

**Don't tidy if:**
- epic.md is under 100 lines (already compact)
- No verbose completed task content exists
- Epic just started (need the planning context)

### 6. Git Sync (Optional)

If GitHub integration is configured:
- Check for `auto_sync_github: true` in `.project/config.json`
- If enabled, invoke git-sync skill to update GitHub issue

### 7. Suggest Next Task

Show completion summary and next steps:

```
TASK COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: {task-title}
Epic: {epic-name}
Status: Done

EPIC PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{completed}/{total} tasks complete ({percentage}%)

[████████░░]

NEXT AVAILABLE TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. #{number} - {title} ({complexity})
2. #{number} - {title} ({complexity})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Continue: "next task" or "start task {number}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Update Focus State

After completion, update `.project/context/focus.json`:
- Clear `current_issue` (set to null or remove)
- Keep `current_epic` (still working on this epic)
- Update `last_updated` timestamp

---

## Epic Completion

If this was the last task in the epic:

```
EPIC COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Epic: {epic-name}
Tasks: {total} completed
Duration: {started} → {completed}

ALL TASKS DONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ {task-1}
✓ {task-2}
✓ {task-3}
...

NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:
1. Start next epic (if available)
2. Create new PRD for next feature
3. Run project status overview

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Task not found | List available in-progress tasks |
| No focus set | Ask which task to complete |
| Task already done | "Task already complete. Reopen?" |
| Tests failing | Show failures, offer to skip |
| Uncommitted changes | Offer to commit or continue |

---

## Examples

### After feature-dev

```
User: task complete

Claude: Completing task from current focus...

Task: Implement OAuth provider abstraction
Epic: user-auth
Verifying...

✓ Tests pass (12/12)
✓ Code committed (abc1234)
✓ Acceptance criteria met (5/5)

Updating task status...
Updating progress...

TASK COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: Implement OAuth provider abstraction
Epic: user-auth
Status: Done

EPIC PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1/5 tasks complete (20%)

[██░░░░░░░░]

NEXT AVAILABLE TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. #002 - Add Google OAuth provider (medium)
2. #003 - Add GitHub OAuth provider (medium)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Continue: "next task" or "start task 002"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Quick completion (skip verification)

```
User: mark task 003 done

Claude: Completing task 003...

Task: Add validation message for empty password
Epic: user-auth

Skip verification and mark complete? (y/n)

User: y

Claude: Task 003 marked complete.

2/5 tasks done in epic "user-auth"

Next: #004 - Add rate limiting to login
```

---

## Integration Points

### With task-start
- task-start sets focus, task-complete clears it
- Both update the same task file
- Enables continuous workflow

### With feature-dev
- After feature-dev Phase 7 Summary
- Captures feature-dev results into MindContext
- Updates all tracking files

### With next-task
- task-complete suggests next tasks
- User can immediately continue with "next task"
- Maintains workflow momentum

### With git-sync
- Optionally syncs completion to GitHub
- Closes GitHub issue if linked
- Updates labels/status

### With compact-context
- task-complete tidies epic.md (completed task details)
- compact-context tidies progress.md (old session summaries)
- Both archive to `.project/context/archive/`
