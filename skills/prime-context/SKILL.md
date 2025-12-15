---
name: prime-context
description: Load project context files and establish understanding of the codebase for a new session. Use when user says "prime context", "load context", "get context", or at start of session.
---

# Prime Context

Load essential project context for a new agent session by reading documentation and understanding the codebase structure.

## When to Use

- Starting a new development session
- After `start-of-day` to load detailed context
- User says "prime context", "load context"
- Need to understand the project before working

## Workflow

### 1. Check Context Availability

```bash
# Check for project context directory
ls -la .project/context/ 2>/dev/null

# If not found, check alternate locations
ls -la docs/ 2>/dev/null
ls -la context/ 2>/dev/null
```

If no context directory exists:
```
❌ No context found.

To establish project context:
1. Create .project/context/ directory
2. Add project-overview.md, tech-context.md, progress.md
3. Or use existing README.md and docs/

Continuing with available files...
```

### 2. Load Context Files

MindContext uses **3 core files** for project context:

| File | Purpose | Required |
|------|---------|----------|
| `.project/context/focus.json` | Current work state (machine-readable) | Yes |
| `.project/context/progress.md` | Session narrative, recent work | Yes |
| `.project/design.md` | Project vision, tech stack, roadmap | Yes |

**Load in this order:**

1. **`focus.json`** - What are we working on right now?
2. **`progress.md`** - What happened recently? What's next?
3. **`design.md`** - What is this project? How is it built?

### 3. Fallback Sources

If the 3 core files are missing, fall back to:

| Missing File | Fallback Source |
|--------------|-----------------|
| `design.md` | `README.md` + `package.json`/`pyproject.toml` |
| `progress.md` | `git log --oneline -10` |
| `focus.json` | Assume no active focus |

```bash
# Check for fallback sources
test -f README.md && echo "README.md available"
ls package.json pyproject.toml Cargo.toml go.mod 2>/dev/null
git log --oneline -10 2>/dev/null
```

**If no context exists at all:**
```
⚠️ No MindContext files found.

Run "project init" to set up context for this project.

Continuing with README.md and git history...
```

### 4. Git State Check

```bash
# Current branch
git branch --show-current

# Recent activity
git log --oneline -5

# Working tree status
git status --short
```

### 5. Summary Output

```
🧠 Context Primed Successfully

📖 Loaded Context Files:
  [✅|⚠️] focus.json    - [status: loaded | missing | empty]
  [✅|⚠️] progress.md   - [status: loaded | missing | used fallback]
  [✅|⚠️] design.md     - [status: loaded | missing | used fallback]

🎯 Current Focus:
  [From focus.json - or "No active focus" if null]

🔍 Project Understanding:
  - Name: [project_name]
  - Type: [greenfield|brownfield]
  - Language: [primary_language]
  - Branch: [git_branch]

📊 Recent Progress:
  [2-3 bullet points from progress.md or git log]

⚠️ Warnings (if any):
  [list any missing files or issues]

💡 Ready to work. Current focus: [focus summary or "none set"]
```

## Error Handling

### Missing Context Directory
```
⚠️ No .project/ directory found

This project hasn't been initialized with MindContext.

Options:
1. Run "project init" to set up MindContext
2. Continue with README.md and git history (limited context)

Falling back to available files...
```

### Partial Context
```
⚠️ Partial Context Loaded

Loaded: [list of files found]
Missing: [list of files not found]

Continuing with available context.
Run "project init" to create missing files.
```

### No Context Available
```
❌ No Project Context Found

Available information:
- Git repository: [yes/no]
- README: [yes/no]
- Config files: [list]

To set up MindContext, run: "project init"
```

## Context File Reference

MindContext uses exactly 3 context files:

### 1. focus.json
```json
{
  "current_focus": {
    "type": "epic|task|bugfix|refactor",
    "name": "Description",
    "epic": "epic-name",
    "task": "001",
    "started": "2025-01-01",
    "phase": "implementation"
  },
  "key_decisions": {
    "topic": "decision made"
  },
  "next_session_tasks": [
    "Task 1",
    "Task 2"
  ],
  "last_updated": "2025-01-01T12:00:00Z"
}
```

### 2. progress.md
```markdown
# Project Progress

**Last Updated:** [date]
**Current Branch:** [branch]

## Current Focus
[What we're working on]

## Recent Activity
- [Recent work 1]
- [Recent work 2]

## Next Steps
1. [Step 1]
2. [Step 2]

## Session Notes
[Any important notes]
```

### 3. design.md
```markdown
---
name: project-name
type: greenfield|brownfield
created: [date]
---

# Project Design: [Name]

## Vision
[What this project does]

## Technical Stack
- Language: [language]
- Framework: [framework]

## Feature Roadmap
[Features planned]

## Out of Scope
[What we're not building]
```

## Notes

- Load all 3 files in order: focus.json → progress.md → design.md
- Handle missing files gracefully - fall back to README/git
- Always check git state for current branch context
- If no context exists, suggest running "project init"
