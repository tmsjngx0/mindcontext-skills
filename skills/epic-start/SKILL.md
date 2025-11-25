---
name: epic-start
description: Begin work on an epic by creating branch, analyzing ready tasks, and launching parallel agents. Use when user says "start epic", "begin epic", "work on epic", or "launch epic".
---

# Epic Start

Launch work on an epic by creating the branch, identifying ready tasks, and optionally launching parallel agents.

## When to Use

- Starting work on a new epic
- User says "start epic X", "begin epic X", "work on epic X"
- Have an epic ready with tasks defined
- Want to launch coordinated work

## Workflow

### Phase 1: Validation

**Step 1.1: Verify Epic Exists**
```bash
# Check for epic file
test -f .project/epics/$EPIC/epic.md || echo "❌ Epic not found"
```

If epic not found:
```
❌ Epic '$EPIC' not found

Available epics:
[list from .project/epics/]

To create an epic:
1. Create PRD first: "create prd for [feature]"
2. Then: "plan epic [feature]"
```

**Step 1.2: Check Working Directory**
```bash
# Check for uncommitted changes
git status --porcelain
```

If uncommitted changes:
```
❌ Uncommitted changes detected

Please commit or stash changes first:
  git add . && git commit -m "WIP"
  # or
  git stash push -m "WIP before epic"
```

### Phase 2: Branch Setup

**Step 2.1: Create or Enter Branch**
```bash
# Check if branch exists
if ! git branch -a | grep -q "epic/$EPIC"; then
    # Create new branch
    git checkout main
    git pull origin main
    git checkout -b epic/$EPIC
    git push -u origin epic/$EPIC
    echo "✅ Created branch: epic/$EPIC"
else
    # Use existing branch
    git checkout epic/$EPIC
    git pull origin epic/$EPIC
    echo "✅ Using existing branch: epic/$EPIC"
fi
```

### Phase 3: Task Analysis

**Step 3.1: Read Epic Structure**

Read `.project/epics/$EPIC/epic.md` and all task files:
- Parse frontmatter for `status`, `depends_on` fields
- Build dependency graph
- Identify ready tasks

**Step 3.2: Categorize Tasks**

```
Task Status:
  Ready: [tasks with no unmet dependencies]
  Blocked: [tasks waiting on dependencies]
  In Progress: [tasks already started]
  Complete: [finished tasks]
```

**Step 3.3: Display Task Summary**

```
📋 Epic: $EPIC

Tasks Overview:
  Total: [count]
  Ready: [count]
  Blocked: [count]
  In Progress: [count]
  Complete: [count]

Ready to Start:
  #001 - [Task title]
  #002 - [Task title]

Blocked:
  #003 - [Task title] (depends on #001)
  #004 - [Task title] (depends on #001, #002)
```

### Phase 4: Launch Work

**Option A: Sequential (Single Task)**

For simpler workflows, start one task:
```
Starting task #001: [Title]

Use "work on task 001" to begin implementation
```

**Option B: Parallel (Multiple Agents)**

For parallel execution, launch agents for ready tasks:

```
🚀 Launching Parallel Work

Task #001: [Title]
  → Agent started

Task #002: [Title]
  → Agent started

Monitor progress with task status updates.
```

### Phase 5: Setup Tracking

**Step 5.1: Create Execution Status**

Create `.project/epics/$EPIC/execution-status.md`:
```markdown
---
started: [datetime]
branch: epic/$EPIC
---

# Execution Status

## Active Work
- Task #001 - [Title] - Started [time]
- Task #002 - [Title] - Started [time]

## Queued
- Task #003 - Waiting for #001
- Task #004 - Waiting for #001, #002

## Completed
- (none yet)
```

### Phase 6: Output Summary

```
🚀 Epic Started: $EPIC

Branch: epic/$EPIC
Status: Active

Tasks:
  ✓ Ready: [count] tasks
  ⏸ Blocked: [count] tasks

Started Work:
  #001 - [Title]
  #002 - [Title]

Next Steps:
  - Work on ready tasks
  - Monitor with "epic status $EPIC"
  - When done: "merge epic $EPIC"

Commands:
  "work on task 001" - Start specific task
  "what's next" - Get next ready task
  "epic status" - Check progress
```

## Error Handling

### Epic Not Found
```
❌ Epic '$EPIC' not found

Check available epics:
  ls .project/epics/

Or create from PRD:
  "plan epic [name]"
```

### Branch Conflict
```
❌ Cannot create branch

Error: [git error message]

Try:
  git branch -d epic/$EPIC  (delete local)
  git fetch --prune         (clean remote refs)
```

### No Ready Tasks
```
⚠️ No tasks ready to start

All tasks are either:
  - Blocked by dependencies
  - Already in progress
  - Complete

Check task dependencies in epic.md
```

## Best Practices

**DO:**
- ✅ Verify epic exists before starting
- ✅ Check for uncommitted changes
- ✅ Create branch from clean main
- ✅ Analyze dependencies before launching
- ✅ Track execution status

**DON'T:**
- ❌ Start without checking git status
- ❌ Launch blocked tasks
- ❌ Ignore dependency order
- ❌ Skip branch creation

## Notes

- Always creates/uses `epic/$EPIC` branch pattern
- Respects task dependencies
- Can launch sequential or parallel work
- Tracks execution status in epic directory
- Works with worktrees if configured
