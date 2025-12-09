---
name: task-start
description: Begin work on a specific task with intelligent routing to feature-dev for complex tasks. Use when user says "start task", "begin task", "work on issue", or provides a task number.
---

# Task Start

Begin work on a specific task with smart execution routing.

## Workflow Overview

```
task-start [number]
    │
    ├── 1. Find and load task
    ├── 2. Load context (epic, PRD, design.md)
    ├── 3. Update focus state
    ├── 4. Assess complexity
    │       ↓
    │   ┌──────────────────┐
    │   │ Simple or Complex │
    │   └──────────────────┘
    │       ↓           ↓
    │    Simple      Complex
    │       ↓           ↓
    │   Implement    Offer options:
    │   directly     1. feature-dev
    │       │        2. feature-dev + TDD
    │       │        3. Implement directly
    │       ↓           ↓
    └───────────────────────
               ↓
         task-complete
```

---

## Instructions

When triggered, perform these steps IN ORDER:

### 1. Find the Task

Search for the task file in `.project/epics/*/`:
- Look for `{number}.md`, `0{number}.md`, or `00{number}.md`
- If not found, list available tasks and ask which one

### 2. Load Context

Read and understand:
- **Task file** - title, description, acceptance criteria, status
- **Epic file** - `epic.md` in same directory for architecture context
- **PRD file** - `.project/prds/{epic}.md` if exists
- **Design file** - `.project/design.md` if exists

### 3. Update Focus State

Update `.project/context/focus.json` with:
- `current_epic`: epic name (directory name)
- `current_issue`: task number
- `current_branch`: current git branch
- `last_updated`: current timestamp

### 4. Assess Complexity

**Simple Task (implement directly):**
- Single file change
- Bug fix with known location
- Documentation update
- Configuration change
- Test addition for existing code
- Task marked `complexity: low`

**Complex Task (offer feature-dev):**
- Touches 3+ files
- Requires understanding existing patterns
- New feature integration
- Architectural decisions needed
- Contains "design", "refactor", "integrate", "new system"
- Task marked `complexity: high`
- Has 5+ acceptance criteria items

### 5. Present Options Based on Complexity

#### For Simple Tasks:

```
Task: {title}
Files: {file list}
Complexity: Simple

Starting implementation...
```

Then implement directly, run tests, and invoke `task-complete`.

#### For Complex Tasks:

Present THREE options:

```
Task: {title}
Files: {file list}
Complexity: High - {reason}

This task would benefit from structured development:

Options:
1. feature-dev workflow (recommended)
   → Exploration, architecture, implementation, review

2. feature-dev + TDD (strictest)
   → Same as #1, but with test-first during implementation

3. Implement directly
   → Skip exploration/review phases
```

### 6. Execute Based on User Choice

#### Option 1: feature-dev workflow

Prepare context and launch:

```
/feature-dev:feature-dev {task title}

## Context from MindContext

### Task
{task content}

### From Epic ({epic-name})
{relevant architecture sections}

### From PRD
{relevant requirements}

### Acceptance Criteria
{from task file}
```

#### Option 2: feature-dev + TDD

Same as Option 1, but include TDD instruction:

```
/feature-dev:feature-dev {task title}

## Context from MindContext

### Task
{task content}

### From Epic ({epic-name})
{relevant architecture sections}

### From PRD
{relevant requirements}

### Acceptance Criteria
{from task file}

### TDD Requirement
During Phase 5 (Implementation), use strict TDD:
1. Before writing any implementation code, write a failing test
2. Run the test - verify it fails
3. Write minimal code to make the test pass
4. Run the test - verify it passes
5. Refactor if needed
6. Repeat for each behavior

Use the project's test framework. Commit after each Green phase.
```

#### Option 3: Implement directly

Update task status to `in_progress`, then:
1. Read relevant files
2. Make changes
3. Run tests
4. Invoke `task-complete`

### 7. Update Task Status

When starting any path, update the task file:
- Change `status:` to `in_progress`
- Add `started:` timestamp if not present

---

## After feature-dev Completes

When feature-dev Phase 7 (Summary) is done:

1. Capture the implementation summary
2. Invoke `task-complete` to:
   - Mark task as done
   - Update progress.md
   - Update epic progress
   - Suggest next task

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Task not found | List available tasks from `.project/epics/` |
| Dependencies not met | Show blockers, suggest completing them first |
| Already in progress | Ask "Continue working on this task?" |
| Already complete | Ask "Task done. Reopen or work on next task?" |

---

## Examples

### Simple Task

```
User: start task 003

Claude: Loading task 003 from epic "user-auth"...

Task: Add validation message for empty password
Files: src/components/LoginForm.tsx
Complexity: Simple (single file, clear scope)

Starting implementation...
[implements directly, runs tests, invokes task-complete]
```

### Complex Task

```
User: start task 001

Claude: Loading task 001 from epic "user-auth"...

Task: Implement OAuth provider abstraction
Files: Multiple (src/auth/*, src/middleware/*, tests/*)
Complexity: High - new system with 5+ acceptance criteria

This task would benefit from structured development:

Options:
1. feature-dev workflow (recommended)
   → Exploration, architecture, implementation, review

2. feature-dev + TDD (strictest)
   → Same as #1, but with test-first during implementation

3. Implement directly
   → Skip exploration/review phases

User: 2

Claude: Launching feature-dev with TDD requirement...

/feature-dev:feature-dev Implement OAuth provider abstraction

## Context from MindContext

### Task
[full task content]

### From Epic (user-auth)
[architecture sections]

### Acceptance Criteria
- OAuth provider interface defined
- Google provider implemented
- Token refresh handling
- Unit tests for all providers
- Integration test for auth flow

### TDD Requirement
During Phase 5 (Implementation), use strict TDD...
```

---

## Integration Points

### With feature-dev
- **MindContext provides:** task context, PRD, epic architecture, TDD requirements
- **feature-dev provides:** exploration, architecture, implementation, review
- **Result flows back** to MindContext via task-complete

### With tdd-agent
- When Option 2 is chosen, TDD instructions guide implementation
- Can also spawn `tdd-agent` directly for stricter enforcement
- tdd-agent handles Red-Green-Refactor cycles

### With task-complete
- Invoked after implementation (any path)
- Updates task status to done
- Updates progress tracking
- Suggests next task
