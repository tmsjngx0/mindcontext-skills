---
name: start-of-day
description: Initialize development session with repo sync, context priming, and work state overview. Use when user says "start of day", "sod", "init session", "morning sync", or "what's my status".
---

# Start of Day

Prime context and show current work state when starting a development session.

## When to Use

- Starting a new work session
- Switching workstations
- Resuming after a break
- User says "sod", "start of day", "morning sync"

## Workflow

### 1. Detect Environment

Show current context:

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  START OF DAY - SESSION INITIALIZATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Platform: $(uname -s)"
echo "Location: $(pwd)"
echo "Repository: $(basename $(git rev-parse --show-toplevel 2>/dev/null || echo 'Not a git repo'))"
echo "Branch: $(git branch --show-current 2>/dev/null || echo 'N/A')"
```

### 2. Sync with Remote

**CRITICAL:** Pull latest BEFORE priming context.

**Sync main repository:**
```bash
echo ""
echo "Syncing main repository..."
git fetch origin
if [ -z "$(git status --short)" ]; then
    current_branch=$(git branch --show-current)
    behind=$(git rev-list --count HEAD..origin/$current_branch 2>/dev/null || echo "0")
    if [ "$behind" -gt 0 ]; then
        echo "  Pulling $behind commit(s)..."
        git pull --ff-only
    else
        echo "  ✓ Up to date"
    fi
else
    echo "  ⚠️ Uncommitted changes - skipping pull"
fi
```

**Sync submodules (if present):**
```bash
if [ -f .gitmodules ]; then
    echo "Syncing submodules..."
    git submodule update --remote --merge
fi
```

**Sync worktrees (if any):**
```bash
echo "Checking worktrees..."
git worktree list --porcelain 2>/dev/null | grep "^worktree " | cut -d' ' -f2 | while read wt; do
    wt_name=$(basename "$wt")
    cd "$wt" 2>/dev/null && {
        if [ -z "$(git status --short)" ]; then
            git fetch origin 2>/dev/null
            echo "  ✓ $wt_name: synced"
        else
            echo "  ⚠️ $wt_name: uncommitted changes"
        fi
    }
done
```

### 3. Load Project Context

Read key context files:

```bash
# Check for project context
if [ -d ".project/context" ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "PROJECT CONTEXT"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Show progress if exists
    if [ -f ".project/context/progress.md" ]; then
        echo ""
        echo "Current Progress:"
        head -50 .project/context/progress.md
    fi
fi

# Check for CLAUDE.md
if [ -f "CLAUDE.md" ]; then
    echo ""
    echo "Project Guidelines: CLAUDE.md found"
fi
```

### 4. Show Focus State

**Check what you were working on:**
```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CURRENT FOCUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f ".project/context/focus.json" ]; then
    # Read focus state
    current_epic=$(jq -r '.current_epic // "none"' .project/context/focus.json)
    current_issue=$(jq -r '.current_issue // "none"' .project/context/focus.json)
    current_branch=$(jq -r '.current_branch // "none"' .project/context/focus.json)
    last_updated=$(jq -r '.last_updated // "never"' .project/context/focus.json)

    if [ "$current_epic" != "none" ] || [ "$current_issue" != "none" ]; then
        echo "Last Working On:"
        [ "$current_epic" != "none" ] && echo "  Epic: $current_epic"
        [ "$current_issue" != "none" ] && echo "  Issue: $current_issue"
        [ "$current_branch" != "none" ] && echo "  Branch: $current_branch"
        echo "  Last Updated: $last_updated"
        echo ""

        # Show issue details if available
        if [ "$current_issue" != "none" ] && [ "$current_epic" != "none" ]; then
            issue_file=".project/epics/$current_epic/$current_issue.md"
            if [ -f "$issue_file" ]; then
                echo "Issue Details:"
                # Extract title from issue file (first heading)
                grep "^# " "$issue_file" | head -1 | sed 's/^# /  /'
                # Extract status if present
                status=$(grep "^status:" "$issue_file" | head -1 | cut -d: -f2 | tr -d ' ')
                [ -n "$status" ] && echo "  Status: $status"
                echo ""
                echo "Continue with: '/next' or 'work on task $current_issue'"
            fi
        elif [ "$current_epic" != "none" ]; then
            echo "Continue with: 'work on epic $current_epic' or '/next'"
        fi
    else
        echo "No active focus"
        echo ""
        echo "Start work with:"
        echo "  • 'what's next' - Find next available task"
        echo "  • 'start epic X' - Begin specific epic"
        echo "  • 'work on task X' - Resume specific task"
    fi
else
    echo "Focus tracking not initialized"
    echo ""
    echo "Initialize with: 'focus on epic X' or 'work on task X'"
fi
```

### 5. Show Work State

**Current branch status:**
```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CURRENT WORK STATE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Git status summary
echo "Branch: $(git branch --show-current)"
echo "Status: $(git status --short | wc -l) uncommitted changes"
echo ""

# Recent commits
echo "Recent commits:"
git log --oneline -5
```

**All worktrees (if applicable):**
```bash
echo ""
echo "Worktrees:"
git worktree list 2>/dev/null || echo "No worktrees"
```

### 6. Check for Issues

Flag problems that need attention:

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ISSUES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

issues=0

# Check for uncommitted changes
if [ -n "$(git status --short)" ]; then
    echo "⚠️ Uncommitted changes in current directory"
    issues=$((issues + 1))
fi

# Check for unpushed commits
ahead=$(git rev-list --count origin/$(git branch --show-current)..HEAD 2>/dev/null || echo "0")
if [ "$ahead" -gt 0 ]; then
    echo "⚠️ $ahead unpushed commit(s)"
    issues=$((issues + 1))
fi

# Check for merge conflicts
if [ -f .git/MERGE_HEAD ]; then
    echo "❌ Merge in progress - resolve conflicts"
    issues=$((issues + 1))
fi

if [ "$issues" -eq 0 ]; then
    echo "✓ No issues detected"
fi
```

### 7. Provide Next Steps

Based on state, suggest actions:

```
SESSION READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Repository synced
✓ Context loaded
✓ Focus state restored
✓ Work state analyzed

Next Steps:
1. Review any issues above
2. Continue focused work with '/next'
3. Or start new task/epic

Ready to proceed!
```

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  START OF DAY - SESSION INITIALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Platform: [Linux/Darwin/WSL]
Location: [current path]
Repository: [repo name]
Branch: [current branch]

SYNC WITH REMOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[sync results]

CURRENT FOCUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Last Working On:
  Epic: [epic-name]
  Issue: [issue-number]
  Branch: [branch-name]
  Last Updated: [timestamp]

Issue Details:
  [Issue title]
  Status: [status]

Continue with: '/next' or 'work on task [number]'

CURRENT WORK STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[branch, status, recent commits]

ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[any problems detected]

SESSION READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[next steps]
```

## Notes

- Always syncs BEFORE loading context (ensures latest docs/memories)
- Reads `.project/context/focus.json` to restore last working state
- Shows issue details if available (title, status)
- Suggests how to continue based on focus state
- Uses fast-forward only pulls for safety
- Skips auto-pull if uncommitted changes exist
- Works with submodules and worktrees
- Detects platform automatically
