---
name: next-job
description: Find and suggest the next available job/task to work on based on dependencies and priority. Use when user says "next job", "what's next job", "give me next job", or "what job should I work on".
---

# Next Job

Alias for `next-task` - Find the next available job/task based on dependencies, priority, and current progress.

## When to Use

- Just finished a job/task
- Starting fresh work
- User says "next job", "what's next job", "what job should I work on"
- Need job/task recommendation

## Workflow

This skill uses the same logic as `next-task`:

### Step 1: Find Open Tasks

```bash
# Find all open tasks
for epic_dir in .project/epics/*/; do
    for task in "$epic_dir"/*.md; do
        status=$(grep "^status:" "$task" | head -1)
        # Check if open
    done
done
```

### Step 2: Check Dependencies

For each open task:
```bash
# Get dependencies
deps=$(grep "^depends_on:" "$task" | head -1)

# Check if all deps are done
for dep in $deps; do
    dep_status=$(grep "^status:" ".project/epics/*/$dep.md")
    # If any dep not done, task is blocked
done
```

### Step 3: Prioritize Ready Tasks

Order by:
1. Priority field (if exists)
2. Task number (lower = earlier)
3. Epic priority
4. Can run in parallel (bonus)

### Step 4: Present Recommendations

```
📋 NEXT AVAILABLE JOB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ #[task] - [title]
   Epic: [epic-name]
   Priority: [high/medium/low]
   [If parallel: 🔄 Can run in parallel]

   Why this job:
   - [reason: first in queue / high priority / unblocks others]

OTHER READY JOBS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • #[task] - [title] ([epic])
  • #[task] - [title] ([epic])
  • #[task] - [title] ([epic])

BLOCKED JOBS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • #[task] - Waiting on #[dep]
  • #[task] - Waiting on #[dep], #[dep]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary: [X] jobs ready, [Y] blocked

Start recommended job? Say "work on task [X]"
```

## Job Selection Logic

```
1. Filter: Only open jobs (status: open)
2. Filter: No unmet dependencies
3. Sort by:
   - Priority (high > medium > low)
   - Task number (001 before 002)
   - Unblocks others (tasks that are dependencies)
4. Recommend top job
```

## Special Cases

### No Jobs Available
```
📋 NO JOBS AVAILABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All jobs are either:
  • Already in progress
  • Blocked by dependencies
  • Completed

Suggestions:
  → Check blocked jobs for unblock opportunities
  → Create new epic: "create prd for [feature]"
  → Review completed work
```

### All Jobs Blocked
```
⚠️ ALL JOBS BLOCKED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Blocked jobs:
  • #[task] → needs #[dep]
  • #[task] → needs #[dep]

To unblock:
  → Complete external dependency
  → Remove dependency if no longer needed
  → Work on blocking job in different epic
```

### In-Progress Jobs Exist
```
📋 NEXT JOB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ You have jobs in progress:
  • #[task] - [title] (started [date])

Options:
1. Continue current job
2. Start new job anyway (parallel work)

Ready jobs if you want something new:
  • #[task] - [title]
```

## Output Format

```
📋 NEXT JOB: #[X] - [Title]

Epic: [epic-name]
Priority: [priority]

Ready to start? Say "work on task [X]"
```

## Notes

- Alias for `next-task` skill (same functionality)
- "Job" and "task" are used interchangeably
- Respects task dependencies
- Prioritizes jobs that unblock others
- Warns about in-progress jobs
- Suggests alternatives if no jobs ready
- Works with `.project/epics/` structure
