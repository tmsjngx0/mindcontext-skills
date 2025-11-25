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

Find task file in `.project/epics/*/XXX.md` where XXX is the task number.
Read the task file and display its contents.

**1.2 Understand Requirements**

From the task file, identify:
- Acceptance criteria
- Files to modify
- Dependencies (check if complete)

**1.3 Code Research**

Use code analysis to:
- Find existing patterns in codebase
- Identify related code
- Map architecture

**1.4 Present Plan**

Show user:
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
- Backend work → Focus on services, APIs
- Frontend work → Focus on components, UI
- Refactoring → Focus on patterns, tests

**2.2 Implement**

- Follow acceptance criteria exactly
- Use existing patterns found in codebase
- Write tests alongside code

**2.3 Track Progress**

Update task frontmatter status from `open` to `in_progress`.

### Phase 3: Validation

**3.1 Build**

Run appropriate build command:
- Node.js: `npm run build`
- Java: `mvn compile`
- Rust: `cargo build`
- .NET: `dotnet build`
- Python: Check syntax

**3.2 Test**

Run appropriate test command:
- Node.js: `npm test`
- Java: `mvn test`
- Rust: `cargo test`
- .NET: `dotnet test`
- Python: `pytest`

**3.3 Report Results**

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

Change task frontmatter status from `in_progress` to `done`.

**5.2 Update Progress**

Add entry to `.project/context/progress.md`.

**5.3 Final Summary**

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
