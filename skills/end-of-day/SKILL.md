---
name: end-of-day
description: Wrap up development session by checking uncommitted changes, unpushed commits, and updating context. Use when user says "end of day", "eod", "wrap up", "done for today", or "switching workstations".
---

# End of Day

Check all worktrees for uncommitted changes, unpushed commits, and update context before ending the session.

## When to Use

- Ending the work day
- Switching workstations
- Taking a break
- User says "eod", "end of day", "wrap up", "done for today"

## Workflow

### Phase 1: Check All Worktrees

**Step 1.1: List Worktrees**
```bash
git worktree list
```

**Step 1.2: Check Each Worktree**

For each worktree:
```bash
cd [worktree-path]
git status --short
git branch -vv  # Check ahead/behind status
```

Detect issues:
- Uncommitted changes (modified files)
- Untracked files
- Unpushed commits (ahead of remote)
- No remote tracking

### Phase 2: Generate Status Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  END OF DAY STATUS CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Worktrees: [count]

STATUS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Worktree: [path]
Branch: [branch] → origin/[branch]
Status: [✓ Clean / ⚠ X uncommitted changes]
Remote: [✓ Up to date / ⚠ X commits ahead]
[If issues, list files]

[Repeat for each worktree...]
```

### Phase 3: Update Context

**Update Focus Timestamp:**
```bash
# Refresh focus.json timestamp to reflect end of session
if [ -f ".project/context/focus.json" ]; then
    jq --arg ts "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
       '.last_updated = $ts' \
       .project/context/focus.json > /tmp/focus.json && \
       mv /tmp/focus.json .project/context/focus.json
    echo "✓ Focus state updated"
fi
```

**Update Progress Context:**
If `.project/context/` exists:
```bash
# Update progress.md with session summary
# Record what was worked on today
```

### Phase 4: Commit Context Changes

Auto-commit context files if changed:
```bash
# Stage context files
git add .project/context/*.md

# Commit if changes
git diff --cached --quiet || git commit -m "Update context at end of day"
```

### Phase 4b: Context File Health Check

Check if context files are getting large:
```bash
# Check progress.md line count
progress_lines=$(wc -l < .project/context/progress.md 2>/dev/null || echo "0")

# Check session count
session_count=$(grep -cE "^## Session|^### [0-9]{4}-[0-9]{2}-[0-9]{2}" .project/context/progress.md 2>/dev/null || echo "0")
```

**If progress.md > 150 lines OR > 10 sessions:**
```
💡 CONTEXT FILE MAINTENANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

progress.md is growing large ({n} lines, {n} sessions)

Consider running: "compact context"
→ Archives old sessions to .project/context/archive/
→ Keeps progress.md slim and focused
```

**If already compact (<100 lines):**
Skip this message entirely.

### Phase 5: Final Summary

```
ISSUES FOUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠ Uncommitted Changes: [count] worktrees
⚠ Unpushed Commits: [count] worktrees

RECOMMENDED ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[worktree-name]:
  → [specific action needed]
  → Command: [git command to fix]

SAFE TO SWITCH?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[✅ YES / ❌ NO - reasons]
```

## Exit Statuses

**✅ CLEAN - Safe to switch:**
- All worktrees clean
- All commits pushed
- Context updated

**⚠ WARNINGS - Review before switching:**
- Untracked files (might be intentional)
- Local-only branches

**❌ ISSUES - Must address:**
- Uncommitted changes
- Unpushed commits
- Merge conflicts in progress

## Quick Actions

Offer to help resolve issues:
```
Quick Actions:
1. Commit all with generated messages
2. Push all unpushed commits
3. Stash all changes
4. Show details for specific worktree
```

## Edge Cases

### Detached HEAD
- Flag as warning
- Suggest creating branch

### Merge in Progress
- Flag as error (must resolve)
- Show conflict files

### No Remote Tracking
- Flag as warning
- Suggest `git push -u origin [branch]`

### Offline
- Skip remote checks
- Report "Remote status unknown (offline)"

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  END OF DAY STATUS CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Worktree statuses...]

CONTEXT UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Context files updated
✓ Session state recorded

SAFE TO SWITCH?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Status and recommendations]
```

## Notes

- Read-only by default (just reports status)
- Works with submodules and worktrees
- Pairs with start-of-day skill
- Handles offline scenarios
- Provides actionable recommendations
