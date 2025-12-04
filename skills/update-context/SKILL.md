---
name: update-context
description: Update project context files with current session information before clearing memory or switching contexts. Use when user says "update context", "save context", "sync context", or before running prime-context.
---

# Update Context

Capture current session knowledge into context files so it persists across memory clears and session switches.

## When to Use

- Before clearing Claude's memory/context
- Before switching to a different task or project
- After significant discoveries or decisions
- User says "update context", "save context", "sync context"
- Before running `prime-context` to refresh

## Workflow

### Phase 1: Gather Current Session Info

**What to capture:**
- Current focus (what we're working on)
- Key decisions made this session
- Important discoveries about the codebase
- Research findings
- Next steps identified
- Blockers or open questions

**Ask user if unclear:**
```
What should I capture from this session?
1. Current focus and progress
2. Key decisions made
3. Research findings
4. All of the above
5. Custom (you specify)
```

### Phase 2: Update Focus State

**Update `.project/context/focus.json`:**
```bash
# Check if context directory exists
mkdir -p .project/context

# Read current focus or create new
cat .project/context/focus.json 2>/dev/null || echo "{}"
```

**Focus structure:**
```json
{
  "current_focus": {
    "type": "plan|epic|task|research",
    "name": "Description of current work",
    "path": "Path to relevant file",
    "started": "YYYY-MM-DD",
    "phase": "Current phase"
  },
  "context_files": {
    "key": "path/to/file"
  },
  "key_decisions": {
    "topic": "decision made"
  },
  "next_steps": [
    "Step 1",
    "Step 2"
  ],
  "last_updated": "YYYY-MM-DDTHH:MM:SSZ"
}
```

### Phase 3: Update Progress File

**Update `.project/context/progress.md`:**

```markdown
# Project Progress

**Last Updated:** [timestamp]
**Current Phase:** [phase name]

---

## Current Focus

**[Type]:** [name]
**Location:** [path]

### Key Decisions
- [decision 1]
- [decision 2]

### Research Artifacts
- [path 1] - [description]
- [path 2] - [description]

---

## Session Summary

[What was accomplished this session]

---

## Next Steps

- [ ] [step 1]
- [ ] [step 2]

---

## Open Questions / Blockers

- [question or blocker]
```

### Phase 4: Capture Research (if applicable)

If research was conducted, ensure it's saved:

```bash
# Check for unsaved research
ls .project/spikes/ 2>/dev/null
ls .project/analysis/ 2>/dev/null
```

Prompt if research should be documented:
```
Research conducted this session:
- [topic 1]
- [topic 2]

Save to .project/spikes/[name].md? (y/n)
```

### Phase 5: Git Status Check

```bash
# Show what's changed
git status --short

# Check for uncommitted context files
git status --short .project/
```

**If context files modified:**
```
Context files have changes:
  M .project/context/progress.md
  M .project/context/focus.json

Options:
1. Commit context update now
2. Leave uncommitted (will be there next session)
3. Show diff first
```

### Phase 6: Summary Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONTEXT UPDATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Focus state saved: .project/context/focus.json
✓ Progress updated: .project/context/progress.md
[✓ Research saved: .project/spikes/[name].md]
[✓ Changes committed]

CURRENT FOCUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[type]: [name]
Phase: [current phase]

KEY DECISIONS CAPTURED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [decision 1]
• [decision 2]

NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [step 1]
2. [step 2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready to clear memory and run prime-context
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Quick Mode

For fast updates without prompts:

```
User: "quick update context"
```

**Quick mode behavior:**
1. Auto-detect current focus from recent activity
2. Update focus.json with timestamp
3. Append session summary to progress.md
4. Skip git commit (leave for user)
5. Output brief confirmation

## Integration with Prime Context

**Recommended flow:**
```
1. update-context  → Save current session
2. /clear          → Clear Claude's memory
3. prime-context   → Load fresh context
```

This ensures continuity across memory boundaries.

## Context File Locations

| File | Purpose |
|------|---------|
| `.project/context/focus.json` | Current work focus (machine-readable) |
| `.project/context/progress.md` | Progress narrative (human-readable) |
| `.project/spikes/*.md` | Research artifacts |
| `.project/plans/*.md` | Technical plans |

## Error Handling

### No .project/ directory
```
⚠️ No .project/ directory found

Options:
1. Create minimal context structure
2. Use alternate location (docs/, context/)
3. Skip context update
```

### Permission Issues
```
❌ Cannot write to .project/

Check file permissions and try again.
```

## Notes

- Always preserves existing content (appends, doesn't overwrite)
- Creates directories if missing
- Works with or without git
- Pairs with prime-context for full cycle
- Quick mode for fast iterations
