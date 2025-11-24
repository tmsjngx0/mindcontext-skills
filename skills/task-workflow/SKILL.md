---
name: task-workflow
description: Execute complete task lifecycle from analysis through implementation, testing, and completion. Use when user says "work on task", "implement task", "do task", or "start task".
---

# Task Workflow

Complete task from analysis to done.

## When to Use

- Starting work on specific task
- User says "work on task X", "implement task X"

## Workflow

### Phase 1: Analysis

**1.1 Load Task**
```bash
TASK="$1"  # e.g., "3" or "003"
TASK_FILE=$(find .project/epics -name "*$TASK*.md" | head -1)

if [ -z "$TASK_FILE" ]; then
    echo "Task not found: $TASK"
    exit 1
fi

cat "$TASK_FILE"
```

**1.2 Understand Requirements**
- Read acceptance criteria
- Identify files to modify
- Check dependencies complete

**1.3 Code Research**
Use code analysis to:
- Find existing patterns
- Identify related code
- Map architecture

**1.4 Create Plan**
```
TASK READY

Task: #X - [Title]
Epic: [Epic Name]

Requirements understood
Files to modify: [list]
Patterns found: [list]

Implementation checklist:
- [ ] Step 1
- [ ] Step 2
- [ ] Tests

Proceed? (yes/no)
```

### Phase 2: Implementation

**2.1 Select Approach**
Based on task type:
- Backend → Focus on services, APIs
- Frontend → Focus on components, UI
- Refactor → Focus on patterns, tests

**2.2 Implement**
- Follow acceptance criteria
- Use existing patterns
- Write tests alongside code

**2.3 Track Progress**
Update task status:
```bash
sed -i 's/status: open/status: in_progress/' "$TASK_FILE"
```

### Phase 3: Validation

**3.1 Build**
```bash
# Detect and run build
[ -f "package.json" ] && npm run build
[ -f "pom.xml" ] && mvn compile
[ -f "Cargo.toml" ] && cargo build
[ -f "*.csproj" ] && dotnet build
```

**3.2 Test**
```bash
# Run tests
[ -f "package.json" ] && npm test
[ -f "pom.xml" ] && mvn test
[ -f "Cargo.toml" ] && cargo test
[ -f "*.csproj" ] && dotnet test
```

**3.3 Results**
```
VALIDATION

Build: [PASS/FAIL]
Tests: [X/Y passing]

[If failures, offer to fix]
```

### Phase 4: Review

**4.1 Self Review**
Check:
- All acceptance criteria met
- Tests cover new code
- No obvious issues

**4.2 Summary**
```
REVIEW COMPLETE

Acceptance Criteria:
- [x] Criterion 1
- [x] Criterion 2
- [x] Criterion 3

Quality: Good
```

### Phase 5: Completion

**5.1 Update Task Status**
```bash
sed -i 's/status: in_progress/status: done/' "$TASK_FILE"
```

**5.2 Update Progress**
Add to `.project/context/progress.md`

**5.3 Summary**
```
TASK COMPLETE

Task #X: [Title]
Files modified: [count]
Tests added: [count]

Next: "What's my next task?"
```

## Quality Gates

Must pass before completion:
- [ ] Build succeeds
- [ ] Tests pass
- [ ] Acceptance criteria met
- [ ] No regressions

## Notes

- Always validate before completing
- Update task status in frontmatter
- Track in progress.md
- Suggest next task when done
