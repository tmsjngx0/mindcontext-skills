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

### Phase 2: Detect Active Sessions

**Check for multiple active work streams:**

1. **Git worktrees** - Multiple branches checked out simultaneously
   ```bash
   git worktree list
   ```

2. **Recent branches** - Branches with recent commits
   ```bash
   git for-each-ref --sort=-committerdate --count=5 --format='%(refname:short) %(committerdate:relative)' refs/heads/
   ```

3. **Existing focuses** - Check current focus.json for active_focuses array

4. **Open editor sessions** - Check for .vscode/workspace or similar markers

**Ask user if multiple sessions detected:**
```
I detected multiple active work streams:
1. [branch/focus 1] - last active [time]
2. [branch/focus 2] - last active [time]
3. [branch/focus 3] - last active [time]

Which focuses should I track? (comma-separated, or 'all')
```

### Phase 3: Update Focus State

**Update `.project/context/focus.json`:**
```bash
# Check if context directory exists
mkdir -p .project/context

# Read current focus or create new
cat .project/context/focus.json 2>/dev/null || echo "{}"
```

**Focus structure (supports multiple focuses):**
```json
{
  "active_focuses": [
    {
      "id": "unique-slug",
      "type": "plan|epic|task|research",
      "name": "Description of current work",
      "project": "Project name (if multi-project)",
      "path": "Path to relevant file",
      "started": "YYYY-MM-DD",
      "phase": "Current phase",
      "priority": 1,
      "last_active": "YYYY-MM-DDTHH:MM:SSZ"
    }
  ],
  "current_focus": "unique-slug",
  "context_files": {
    "key": "path/to/file"
  },
  "key_decisions": {
    "topic": "decision made"
  },
  "next_session_tasks": [
    "Step 1",
    "Step 2"
  ],
  "last_updated": "YYYY-MM-DDTHH:MM:SSZ"
}
```

**Managing multiple focuses:**

| Action | Behavior |
|--------|----------|
| Add new focus | Append to `active_focuses`, set as `current_focus` |
| Switch focus | Update `current_focus` to different id |
| Complete focus | Remove from `active_focuses` array |
| Pause focus | Keep in array but switch `current_focus` to another |

**Priority levels:**
- 1 = Primary (main work)
- 2 = Secondary (parallel track)
- 3 = Background (monitoring/waiting)

### Phase 4: Update Progress File

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

### Phase 5: Capture Research (if applicable)

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

### Phase 6: Git Status Check

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

### Phase 7: Summary Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONTEXT UPDATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Focus state saved: .project/context/focus.json
✓ Progress updated: .project/context/progress.md
[✓ Research saved: .project/spikes/[name].md]
[✓ Changes committed]

ACTIVE FOCUSES ([count])
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ [current] [name] (P[priority])
  [type]: [phase]

  [other 1] [name] (P[priority])
  [type]: [phase]

  [other 2] [name] (P[priority])
  [type]: [phase]

KEY DECISIONS CAPTURED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [decision 1]
• [decision 2]

NEXT SESSION TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [task 1]
2. [task 2]

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

**CRITICAL:** The `context/` folder should ONLY contain these two files:

| File | Purpose |
|------|---------|
| `.project/context/focus.json` | Current work focus (machine-readable) |
| `.project/context/progress.md` | Progress narrative (human-readable) |

**DO NOT create additional files in `.project/context/`**

If you need to save new content:

| Content Type | Save To | NOT |
|--------------|---------|-----|
| Research findings | `.project/spikes/{topic}.md` | `.project/context/` |
| Technical plans | `.project/plans/{name}.md` | `.project/context/` |
| Architecture docs | `.project/plans/{name}.md` | `.project/context/` |
| Session notes | Append to `progress.md` | New file in context/ |
| Decisions | Update `focus.json` | New file in context/ |

### Why This Matters

- `context/` is for **state tracking** (2 files only)
- `spikes/` is for **research artifacts** (any number of files)
- `plans/` is for **technical documents** (any number of files)
- Random files in `context/` clutters the tracking system

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
