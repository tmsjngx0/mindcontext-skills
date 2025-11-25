---
name: epic-planning
description: Decompose epic into detailed tasks with dependencies and acceptance criteria. Use when user says "plan epic", "decompose epic", "break down epic", or "create tasks for".
---

# Epic Planning

Break down an epic into actionable tasks.

## When to Use

- Have epic ready to decompose
- User says "plan epic X", "break down X", "create tasks for X"

## Workflow

### 1. Verify Epic Exists

```bash
EPIC="$1"  # e.g., "user-authentication"

if [ ! -f ".project/epics/$EPIC/epic.md" ]; then
    echo "Epic not found: $EPIC"
    echo "Create from PRD first: 'Convert $EPIC PRD to epic'"
    exit 1
fi
```

### 2. Read Epic

Load epic.md and understand:
- Technical approach
- Architecture decisions
- Scope and constraints

### 3. Decompose into Tasks

Create task files in `.project/epics/$EPIC/`:

```bash
# Task file format
cat > .project/epics/$EPIC/001.md << EOF
---
name: [Task Title]
status: open
created: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
depends_on: []
parallel: true
---

# Task: [Title]

## Description
[What needs to be done]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes
[Implementation guidance]

## Files to Modify
- path/to/file1
- path/to/file2

## Effort
Size: S/M/L
EOF
```

### 4. Task Types

Consider creating tasks for:
- **Setup**: Environment, dependencies
- **Data**: Models, schemas, migrations
- **API**: Endpoints, services
- **UI**: Components, pages
- **Tests**: Unit, integration
- **Docs**: README, API docs

### 5. Identify Dependencies

For each task, determine:
- What must complete first (`depends_on`)
- Can run in parallel (`parallel: true/false`)
- Conflicts with other tasks

### 6. Update Epic

Add task summary to epic.md:

```markdown
## Tasks

- [ ] 001 - [Title] (parallel: true)
- [ ] 002 - [Title] (depends: 001)
- [ ] 003 - [Title] (parallel: true)

Total: X tasks
Parallel: Y | Sequential: Z
```

### 7. Summary

```
EPIC DECOMPOSED: $EPIC

Created X tasks:
  001 - [Title]
  002 - [Title]
  ...

Parallel streams: Y
Sequential deps: Z

Next: "Work on task 1" or "Sync to GitHub"
```

## Notes

- Tasks numbered 001, 002, etc.
- Each task has acceptance criteria
- Dependencies tracked in frontmatter
- Aim for 1-3 day tasks
