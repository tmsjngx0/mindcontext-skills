---
name: task-workflow
description: Execute complete task lifecycle from analysis through implementation, testing, review, and completion with quality gates. Use when user says "work on task", "implement task", "do task", or "start task".
---

# Task Workflow

Execute complete task lifecycle with intelligent routing to feature-dev or direct implementation.

## Workflow

1. **Load task** - Read task file from `.project/epics/{epic}/{number}.md`
2. **Set focus** - Update `.project/context/focus.json` with current task
3. **Assess complexity** - Determine if task needs feature-dev
4. **Execute** - Route to feature-dev or implement directly
5. **Validate** - Build, test, verify
6. **Complete** - Update status, track progress

## Complexity Assessment

**Simple tasks (implement directly):**
- Single file change
- Bug fix with known location
- Documentation update
- Configuration change

**Complex tasks (recommend feature-dev):**
- Touches 3+ files
- New feature integration
- Architectural decisions needed
- Task mentions "design", "refactor", "integrate"

## Execution Routes

### Simple Task
```
Load task → Set focus → Implement directly → Test → Complete
```

### Complex Task
```
Load task → Set focus → /feature-dev
  → Phase 2: code-explorer (codebase exploration)
  → Phase 3: Clarifying questions
  → Phase 4: code-architect (design)
  → Phase 5: Implementation (with optional TDD via tdd-agent)
  → Phase 6: code-reviewer (quality check)
  → Complete
```

## Focus State Management

```bash
# At task start - Set focus
EPIC=$(dirname "$TASK_FILE" | xargs basename)
ISSUE=$(basename "$TASK_FILE" .md)
BRANCH=$(git branch --show-current)

jq --arg epic "$EPIC" \
   --arg issue "$ISSUE" \
   --arg branch "$BRANCH" \
   --arg ts "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
   '.current_epic = $epic | .current_issue = $issue | .current_branch = $branch | .last_updated = $ts' \
   .project/context/focus.json > /tmp/focus.json && \
   mv /tmp/focus.json .project/context/focus.json

# At task completion - Update timestamp
jq --arg ts "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
   '.last_updated = $ts' \
   .project/context/focus.json > /tmp/focus.json && \
   mv /tmp/focus.json .project/context/focus.json
```

## Quality Gates

- All tests passing
- Build successful
- Acceptance criteria met
- Code quality validated (via code-reviewer if complex)
