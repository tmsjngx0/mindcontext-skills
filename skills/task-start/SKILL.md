---
name: task-start
description: Begin work on a specific task with intelligent routing to feature-dev for complex tasks. Use when user says "start task", "begin task", "work on issue", or provides a task number.
---

# Task Start

Begin work on a specific task with smart execution routing.

## Workflow

```
task-start [number]
    │
    ├── 1. Find and load task
    ├── 2. Load context (epic, PRD, design.md)
    ├── 3. Update focus state
    ├── 4. Assess complexity
    │      ↓
    │   ┌──────────────────┐
    │   │ Simple or Complex? │
    │   └──────────────────┘
    │      ↓           ↓
    │   Simple      Complex
    │      ↓           ↓
    │   Implement   Recommend
    │   directly    feature-dev
    │      ↓           ↓
    └──────────────────────────
               ↓
         task-complete
```

---

## Step 1: Find Task

Locate task file in `.project/epics/*/{number}.md`

```bash
TASK_FILE=$(find .project/epics -name "${NUMBER}.md" -o -name "0${NUMBER}.md" -o -name "00${NUMBER}.md" 2>/dev/null | head -1)

if [ -z "$TASK_FILE" ]; then
    echo "Task $NUMBER not found"
    echo "Available tasks:"
    find .project/epics -name "*.md" -not -name "epic.md" | sort
    exit 1
fi
```

---

## Step 2: Load Context

Read task and related context:

```
1. Task file: .project/epics/{epic}/{number}.md
2. Epic file: .project/epics/{epic}/epic.md
3. PRD file: .project/prds/{epic}.md (if exists)
4. Design: .project/design.md (if exists)
```

Extract from task:
- Title and description
- Acceptance criteria
- Dependencies
- Current status

---

## Step 3: Update Focus State

```bash
EPIC=$(dirname "$TASK_FILE" | xargs basename)
ISSUE=$(basename "$TASK_FILE" .md)
BRANCH=$(git branch --show-current 2>/dev/null || echo "main")

# Update focus.json (in context/)
cat > .project/context/focus.json << EOF
{
  "current_epic": "$EPIC",
  "current_issue": "$ISSUE",
  "current_branch": "$BRANCH",
  "last_updated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
```

---

## Step 4: Assess Complexity

**Simple Task (implement directly):**
- Single file change
- Bug fix with known location
- Documentation update
- Configuration change
- Test addition for existing code
- Task explicitly marked `complexity: low`

**Complex Task (recommend feature-dev):**
- Touches 3+ files
- Requires understanding existing patterns
- New feature integration
- Architectural decisions needed
- Task mentions "design", "refactor", "integrate", "new system"
- Task explicitly marked `complexity: high`
- Acceptance criteria has 5+ items

**Complexity heuristics:**
```
Check task file for:
- Files listed in task > 2 → complex
- "refactor" in description → complex
- "integrate" in description → complex
- "new" + "system/service/module" → complex
- acceptance_criteria count > 4 → complex
```

---

## Step 5a: Simple Task → Implement Directly

```
"This is a straightforward task. Starting implementation..."

1. Update task status to in_progress
2. Read relevant files
3. Make changes
4. Run tests
5. Mark complete (trigger task-complete)
```

---

## Step 5b: Complex Task → Recommend feature-dev

```
"This task involves [reason]. I recommend using feature-dev for:

✓ Codebase exploration (understand existing patterns)
✓ Architecture design (plan the approach)
✓ Quality review (catch issues early)

Options:
1. Use feature-dev workflow (recommended)
2. Implement directly (skip exploration/review)
"
```

**If user chooses feature-dev:**

Prepare context handoff:

```markdown
## Task: [title]

### From Epic ([epic-name]):
[relevant architecture sections]

### From PRD:
[relevant requirements]

### Task Details:
[full task content]

### Acceptance Criteria:
[from task file]
```

Then launch:

```
/feature-dev [task title]

Context:
[prepared context above]
```

feature-dev will:
- Skip most of Phase 1 (context already provided)
- Run Phase 2: Codebase exploration
- Run Phase 3: Clarifying questions (check PRD/Epic first)
- Run Phase 4: Architecture design
- Run Phase 5: Implementation
- Run Phase 6: Quality review
- Run Phase 7: Summary

---

## Step 6: Update Task Status

When starting (either path):

```bash
# Update frontmatter in task file
sed -i 's/status: .*/status: in_progress/' "$TASK_FILE"

# Add started timestamp if not present
if ! grep -q "started:" "$TASK_FILE"; then
    sed -i "/^---$/a started: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$TASK_FILE"
fi
```

---

## After Completion

When task is done (either path), trigger `task-complete`:

```
1. Mark task as done
2. Update progress.md
3. Update epic progress
4. Suggest next task
```

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Task not found | List available tasks |
| Dependencies not met | Show blockers, suggest completing them first |
| Already in progress | "Continue working on this task?" |
| Already complete | "Task done. Reopen or work on next task?" |

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
[implements directly]
```

### Complex Task
```
User: start task 001

Claude: Loading task 001 from epic "user-auth"...

Task: Implement OAuth provider abstraction
Files: Multiple (src/auth/*, src/middleware/*, tests/*)
Complexity: High (5 files, new system, integration)

This task involves creating a new authentication system.
I recommend using feature-dev for:

✓ Codebase exploration (understand existing auth patterns)
✓ Architecture design (plan OAuth integration)
✓ Quality review (security-sensitive code)

Options:
1. Use feature-dev workflow (recommended)
2. Implement directly

User: 1

Claude: Preparing context for feature-dev...
[launches /feature-dev with context]
```

---

## Integration Notes

### With feature-dev
- MindContext provides: task context, PRD, epic architecture
- feature-dev provides: exploration, implementation, review
- Result flows back to MindContext for tracking

### With task-complete
- After feature-dev Phase 7 completes
- Update task status to done
- Update progress tracking
- Suggest next task
