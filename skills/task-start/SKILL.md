---
name: task-start
description: Begin work on a specific task with analysis and parallel stream support. Use when user says "start task", "begin task", "work on issue", or provides a task number.
---

# Task Start

Begin work on a specific task with context loading, analysis, and optional parallel agent support.

## When to Use

- Starting work on a specific task
- User says "start task 001", "begin task 3", "work on issue 5"
- Need to analyze task before implementation
- Want to launch focused work on one task

## Workflow

### Phase 1: Find Task

**Step 1.1: Locate Task File**

Search for task file:
```bash
# Check standard location
ls .project/epics/*/$TASK.md 2>/dev/null

# Or search by number pattern
find .project/epics -name "*$TASK*.md" -type f
```

**Step 1.2: Verify Task Exists**

If not found:
```
❌ Task #$TASK not found

Search locations checked:
  .project/epics/*/$TASK.md

Available tasks:
  [list nearby task files]

Did you mean one of these?
```

### Phase 2: Load Context

**Step 2.1: Read Task File**

Parse task file for:
- Title and description
- Acceptance criteria
- Dependencies (`depends_on` field)
- Status (`status` field)
- Related files

**Step 2.2: Check Dependencies**

```bash
# Parse depends_on from frontmatter
# Verify each dependency is complete
```

If dependencies not met:
```
⚠️ Task #$TASK has unmet dependencies

Depends on:
  - Task #001: [status]
  - Task #002: [status]

Complete dependencies first, or remove if no longer needed.
```

**Step 2.3: Read Epic Context**

Load parent epic for architecture context:
```bash
# Find epic from task path
epic_name=$(dirname $task_path | xargs basename)
cat .project/epics/$epic_name/epic.md
```

### Phase 3: Analysis

**Step 3.1: Analyze Codebase**

Research existing code:
- Find related implementations
- Identify patterns to follow
- Map files to modify
- Understand architecture

**Step 3.2: Create Implementation Plan**

Build checklist from acceptance criteria:
```
Implementation Plan for Task #$TASK

Files to modify:
  - [file1] - [what to change]
  - [file2] - [what to change]

Steps:
  1. [First step from criteria]
  2. [Second step from criteria]
  3. [Write tests]

Patterns to follow:
  - [existing pattern found]
```

### Phase 4: Setup Work

**Step 4.1: Update Task Status**

Change frontmatter status:
```yaml
status: in_progress
started: [datetime]
```

**Step 4.2: Create Progress Tracking**

Create/update progress file:
```bash
mkdir -p .project/epics/$epic_name/updates/$TASK
```

Create `.project/epics/$epic_name/updates/$TASK/progress.md`:
```markdown
---
task: $TASK
started: [datetime]
status: in_progress
---

# Task #$TASK Progress

## Started
[datetime]

## Work Log
- Starting implementation

## Blockers
(none)
```

### Phase 5: Launch Work

**Option A: Single Focus**

For straightforward tasks:
```
✅ Task #$TASK Ready

Task: [Title]
Epic: [Epic name]

Implementation Plan:
[checklist]

Begin implementation? (yes/no)
```

**Option B: Parallel Streams**

If task has identifiable parallel streams:
```
✅ Task #$TASK Ready

Identified Work Streams:
  Stream A: [description] - [files]
  Stream B: [description] - [files]

Launch parallel agents? (yes/no)
```

### Phase 6: Output Summary

```
🚀 Task Started: #$TASK

Title: [Task title]
Epic: [Epic name]
Branch: [current branch]

Acceptance Criteria:
  - [ ] [Criterion 1]
  - [ ] [Criterion 2]
  - [ ] [Criterion 3]

Files to Modify:
  - [file1]
  - [file2]

Progress Tracking:
  .project/epics/$epic/updates/$TASK/

Commands:
  "continue task" - Resume work
  "task status" - Check progress
  "complete task" - Finish when done
```

## Error Handling

### Task Not Found
```
❌ Task #$TASK not found

Available tasks in current epic:
  #001 - [Title] [status]
  #002 - [Title] [status]

Search all epics? (yes/no)
```

### Dependencies Not Met
```
⚠️ Cannot start task #$TASK

Blocking dependencies:
  - Task #001: not complete

Options:
1. Complete task #001 first
2. Remove dependency (if no longer needed)
3. Start anyway (not recommended)
```

### Already In Progress
```
⚠️ Task #$TASK is already in progress

Started: [datetime]
Last update: [datetime]

Options:
1. Continue where left off
2. Reset and start fresh
3. View current progress
```

### Already Complete
```
✅ Task #$TASK is already complete

Completed: [datetime]

Options:
1. View completion details
2. Reopen task
3. Work on next task
```

## Best Practices

**DO:**
- ✅ Read task file completely before starting
- ✅ Check dependencies are met
- ✅ Load epic context for architecture
- ✅ Create implementation plan
- ✅ Update status to in_progress

**DON'T:**
- ❌ Skip dependency check
- ❌ Start without understanding acceptance criteria
- ❌ Ignore existing patterns in codebase
- ❌ Forget to track progress

## Notes

- Always verify task exists and is valid
- Check and respect dependencies
- Load epic context for architecture guidance
- Update status when starting
- Track progress in updates directory
- Can launch parallel streams if appropriate
