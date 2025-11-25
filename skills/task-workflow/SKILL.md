---
name: task-workflow
description: Execute complete task lifecycle from analysis through implementation, testing, review, and completion with quality gates. Use when user says "work on task", "implement task", "do task", or "start task".
---

# Task Workflow

Execute complete task lifecycle with guided orchestration, quality gates, and systematic completion tracking.

## When to Use

- Starting work on a specific task/issue
- User says "work on task X" or "implement issue Y"
- Need guided workflow from analysis → implementation → review → completion
- Want systematic task execution with quality gates

## What It Does

Orchestrates a complete task workflow:
1. **Analyze** - Deep understanding of requirements and existing code
2. **Plan** - Create implementation checklist
3. **Implement** - Write code following patterns
4. **Validate** - Compile, test, and verify
5. **Review** - Quality check against criteria
6. **Complete** - Update status and document

## Workflow Phases

### Phase 1: Analysis & Planning

**Step 1.1: Load Task Context**

Find task file in `.project/epics/*/XXX.md` where XXX is the task number.
Read the task file and extract:
- Title and description
- Acceptance criteria
- Dependencies
- Related files

**Step 1.2: Deep Code Research**

Analyze codebase to:
- Find existing implementations to follow
- Identify patterns in use
- Map files that need modification
- Understand architecture context

**Step 1.3: Create Implementation Plan**

Build checklist based on:
- Acceptance criteria from task
- Files to modify (from research)
- Testing approach
- Quality requirements

**Output Format:**
```
📋 TASK READY FOR IMPLEMENTATION

Task: #[X] - [Title]
Epic: [Epic name]

✓ Requirements understood
✓ Existing patterns identified
✓ Files to modify: [list]

Estimated Complexity: [Low/Medium/High]

Implementation Checklist:
- [ ] [Step from acceptance criteria]
- [ ] [Step from acceptance criteria]
- [ ] [Tests for new functionality]

Proceed? (yes/no)
```

### Phase 2: Implementation

**Step 2.1: Select Approach**

Based on task type, focus on:
- **Backend** → Services, APIs, data layer
- **Frontend** → Components, UI, state
- **Full-stack** → End-to-end changes
- **Refactoring** → Code quality, patterns

**Step 2.2: Implement Changes**

Follow these principles:
- Match existing code patterns
- Write tests alongside code
- Keep changes focused
- Don't over-engineer

**Step 2.3: Update Task Status**

Change task frontmatter status from `open` to `in_progress`:
```yaml
status: in_progress
```

**Step 2.4: Track Progress**

Update checklist as items complete:
```
⚙️ IMPLEMENTATION IN PROGRESS

Progress:
- [x] Step 1 complete
- [x] Step 2 complete
- [ ] Step 3 in progress
- [ ] Tests pending

Files modified: [list]
```

### Phase 3: Validation

**Step 3.1: Build Check**

Run appropriate build command for the project:
```bash
# Detect project type and run build
# Node.js: npm run build
# .NET: dotnet build
# Java: mvn compile
# Rust: cargo build
# Python: syntax check
```

**Expected Results:**
- ✓ Build successful → proceed to testing
- ✗ Build failed → show errors, fix before continuing

**Step 3.2: Test Execution**

Run appropriate test command:
```bash
# Node.js: npm test
# .NET: dotnet test
# Java: mvn test
# Rust: cargo test
# Python: pytest
```

**Expected Results:**
- ✓ All tests passing → proceed to review
- ⚠ Tests failing → analyze failures, fix

**Step 3.3: Validation Summary**
```
🧪 VALIDATION RESULTS

Build: [✓/✗] [Status message]
Tests: [✓/✗] [X/Y passing]

Status: [READY FOR REVIEW / NEEDS FIXES]
```

### Phase 4: Review

**Step 4.1: Acceptance Criteria Check**

Review each criterion from task file:
```
Acceptance Criteria Validation:
- [✓] Criterion 1
  Evidence: [file:line references]
- [✓] Criterion 2
  Evidence: [file:line references]
- [✗] Criterion 3
  Status: MISSING - [reason]

Overall: [COMPLETE / INCOMPLETE]
```

**Step 4.2: Code Quality Check**

Verify:
- [ ] Code follows existing patterns
- [ ] No obvious bugs or issues
- [ ] Tests cover new functionality
- [ ] No regressions introduced

**Step 4.3: Review Summary**
```
🔍 REVIEW COMPLETE

Quality Score: [Good/Needs Work]

Acceptance Criteria: [X/Y] met
Test Coverage: [Adequate/Needs more]
Code Quality: [Good/Issues found]

[If issues found, list them]

Ready for completion? (yes/no)
```

### Phase 5: Refinement (If Needed)

**Step 5.1: Fix Issues**

If review found issues:
- Address each issue
- Re-run build and tests
- Re-validate criteria

**Step 5.2: Final Validation**
```
Final Quality Check:
[✓] All issues addressed
[✓] All tests passing
[✓] Code quality acceptable
[✓] Acceptance criteria met

Status: READY FOR COMPLETION
```

### Phase 6: Completion

**Step 6.1: Update Task Status**

Change task frontmatter status to `done`:
```yaml
status: done
completed: [date]
```

**Step 6.2: Update Progress Tracking**

Add entry to `.project/context/progress.md`:
```markdown
### [Date]
- Completed Task #X: [Title]
  - [Key accomplishment]
  - [Files changed]
```

**Step 6.3: Prepare Commit**

Generate commit message:
```
feat: [Brief description from task title]

- [Change 1]
- [Change 2]
- [Change 3]

Task #X complete
```

**Step 6.4: Final Summary**
```
✅ TASK COMPLETED

Task #[X]: [Title]
Epic: [Epic name]

Summary:
- Files Modified: [count]
- Tests Added: [count]
- Quality: Validated

Changes committed: [yes/no]

Next Steps:
- Ask "What's my next task?"
- Or work on another epic
```

## Quality Gates

Mandatory gates before completion:

**Gate 1: Analysis Complete**
- ✓ Requirements understood
- ✓ Existing patterns identified
- ✓ Implementation approach clear

**Gate 2: Implementation Valid**
- ✓ Code compiles successfully
- ✓ All tests pass
- ✓ No obvious runtime errors

**Gate 3: Criteria Met**
- ✓ All acceptance criteria validated
- ✓ Evidence documented
- ✓ Quality acceptable

## Error Handling

### Build Fails
```
❌ Build Failed

Errors:
[Show exact build errors]

Options:
1. Fix errors now
2. Show me the errors to fix manually
3. Abort task

What would you like to do?
```

### Tests Fail
```
⚠️ Tests Failing

Failed Tests:
- [Test name]: [Failure reason]
- [Test name]: [Failure reason]

Options:
1. Analyze test failures
2. Fix failing tests
3. Review test expectations (may be test issue)

What would you like to do?
```

### Criteria Not Met
```
⚠️ Acceptance Criteria Incomplete

Missing:
- [ ] [Criterion not met]

Options:
1. Implement missing criterion
2. Mark as partial completion
3. Discuss scope change

What would you like to do?
```

## Best Practices

**DO:**
- ✅ Analyze code before implementation
- ✅ Compile and test before review
- ✅ Verify all acceptance criteria
- ✅ Use proper commit messages
- ✅ Update task status at each phase

**DON'T:**
- ❌ Skip quality gates
- ❌ Close task with failing tests
- ❌ Proceed without user confirmation on key decisions
- ❌ Over-engineer or add unrequested features

## Example Usage

### Example 1: Standard Task
```
User: "Work on task 3"

Workflow:
→ Loads task #3 from .project/epics/
→ Analyzes codebase for patterns
→ Presents implementation plan
→ User confirms
→ Implements changes
→ Build: ✓ Success
→ Tests: ✓ All passing
→ Criteria: ✓ All met
→ Updates task status to done
→ Suggests next task

Result: ✅ Task 3 complete
```

### Example 2: Task with Issues
```
User: "Work on task 7"

Workflow:
→ Analysis complete
→ Implementation complete
→ Build: ✓ Success
→ Tests: ⚠️ 2 failing
→ Analyzes failures
→ User: "Fix tests"
→ Fixes test issues
→ Re-tests: ✓ All passing
→ Criteria: ✓ All met
→ Completes task

Result: ✅ Task 7 complete (with test fixes)
```

## Response Templates

### Analysis Phase
```
📋 TASK ANALYSIS COMPLETE

Task: #[X] - [Title]
Epic: [Name]
Complexity: [Low/Medium/High]

Code Research:
- Found [N] existing patterns to follow
- Identified [M] files to modify

Implementation Checklist:
[Checklist items]

Proceed with implementation? (yes/no)
```

### Implementation Phase
```
⚙️ IMPLEMENTATION IN PROGRESS

Progress:
- Files modified: [list]
- Tests created: [count]
- Current step: [what's happening]

[Status updates as work progresses...]
```

### Validation Phase
```
🧪 VALIDATION RESULTS

Build: [✓/✗] [Status]
Tests: [✓/✗] [X/Y passing]

Next: [Review / Fix issues]
```

### Completion Phase
```
✅ TASK COMPLETED

Task #[X]: [Title]

Summary:
- Files: [count] modified
- Tests: [count] added
- Criteria: All met

Next: Ask "What's my next task?"
```

## Notes

- Always validate before completing
- Update task status in frontmatter
- Track progress in progress.md
- Suggest next task when done
- Keep implementations focused and simple
