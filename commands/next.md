---
description: Continue working on current task or find next available task
args:
  - name: task_number
    description: Optional task number to start directly (e.g., "3" or "003")
    required: false
---

# Next

Continue implementation or find the next thing to work on.

## Usage

```bash
/next           # Find next available task
/next 3         # Start task 3 directly
/next 003       # Start task 003 directly
```

## Behavior

### With Task Number: `/next [number]`

When a task number is provided, skip discovery and start the task directly:

1. Parse task number from argument: `$ARGUMENTS`
2. Invoke `task-start` skill with that number
3. Follow task-start workflow (load context, assess complexity, implement or recommend feature-dev)

**Example:**
```
User: /next 3

→ Invoking task-start for task 3...
→ [task-start workflow begins]
```

### Without Task Number: `/next`

Follow the standard discovery workflow:

**1. Check focus state (continue current work)**
   - Read `.project/context/focus.json`
   - If current task exists and is in_progress:
     - Show task details
     - Ask: "Continue working on this task?"
   - If no current task, proceed to step 2

**2. Find next available task**
   - Invoke `next-task` skill
   - Present recommended tasks
   - User can then say "start task X" or "/next X"

## Priority Order (for discovery)

1. **Current focus** - Continue in-progress work
2. **Ready tasks** - Sorted by priority, then task number
3. **Blocked tasks** - Show blockers

## Integration

| Command | Result |
|---------|--------|
| `/next` | Find and recommend next task |
| `/next 3` | Start task 3 directly via task-start |
| `next task` | Same as `/next` (triggers next-task skill) |
| `start task 3` | Same as `/next 3` (triggers task-start skill) |

## Implementation

```
IF $ARGUMENTS contains a number:
    Extract task number
    Invoke task-start skill: "start task $NUMBER"
ELSE:
    Check focus state
    IF in_progress task exists:
        Show task, offer to continue
    ELSE:
        Invoke next-task skill
        Present recommendations
```

Works with MindContext Epic/Task workflow.

See also:
- `/update-plan` for incorporating external LLM review feedback
- `task-start` skill for direct task execution
- `next-task` skill for task discovery
