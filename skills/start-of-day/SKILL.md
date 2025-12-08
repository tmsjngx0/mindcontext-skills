---
name: start-of-day
description: Initialize development session with repo sync, context priming, work state overview, and standup report. Use when user says "start of day", "sod", "init session", "morning sync", "standup", "daily standup", or "what did I do".
---

# Start of Day

Complete session initialization with repository sync, context loading, and standup report.

## When to Use

- Starting a new work session
- Morning standup meetings
- Switching workstations
- Resuming after a break
- User says "sod", "start of day", "morning sync", "standup", "what did I do"

## Workflow

### 1. Session Header

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  START OF DAY - $(date +%Y-%m-%d)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Repository: $(basename $(git rev-parse --show-toplevel 2>/dev/null || echo 'Not a git repo'))"
echo "Branch: $(git branch --show-current 2>/dev/null || echo 'N/A')"
```

### 2. Sync with Remote

**CRITICAL:** Pull latest BEFORE priming context.

```bash
echo ""
echo "REPOSITORY SYNC"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Sync main repository
git fetch origin
if [ -z "$(git status --short)" ]; then
    current_branch=$(git branch --show-current)
    behind=$(git rev-list --count HEAD..origin/$current_branch 2>/dev/null || echo "0")
    ahead=$(git rev-list --count origin/$current_branch..HEAD 2>/dev/null || echo "0")
    if [ "$behind" -gt 0 ]; then
        echo "  Pulling $behind commit(s)..."
        git pull --ff-only
    fi
    if [ "$ahead" -gt 0 ]; then
        echo "  ⚠️ $ahead unpushed commit(s)"
    fi
    if [ "$behind" -eq 0 ] && [ "$ahead" -eq 0 ]; then
        echo "  ✓ Up to date"
    fi
else
    echo "  ⚠️ Uncommitted changes - skipping pull"
fi

# Sync submodules if present
if [ -f .gitmodules ]; then
    echo "  Syncing submodules..."
    git submodule update --remote --merge 2>/dev/null
fi
```

### 3. Yesterday's Activity (Standup)

```bash
echo ""
echo "YESTERDAY (What I did)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Git commits in last 24 hours
commits=$(git log --oneline --since="24 hours ago" --all 2>/dev/null)
if [ -n "$commits" ]; then
    echo "$commits" | while read line; do
        echo "  • $line"
    done
else
    echo "  (no commits in last 24h)"
fi

# Recently modified project files
if [ -d ".project" ]; then
    recent=$(find .project -name "*.md" -mtime -1 2>/dev/null | head -5)
    if [ -n "$recent" ]; then
        echo ""
        echo "  Modified files:"
        echo "$recent" | while read f; do
            echo "    - $(basename $f)"
        done
    fi
fi
```

### 4. Today's Plan (Current Focus + Next Tasks)

```bash
echo ""
echo "TODAY (What I'll do)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check focus state
if [ -f ".project/context/focus.json" ]; then
    current_focus=$(jq -r '.current_focus.name // empty' .project/context/focus.json 2>/dev/null)
    if [ -n "$current_focus" ]; then
        echo "  Current Focus: $current_focus"
    fi

    # Show next session tasks
    next_tasks=$(jq -r '.next_session_tasks[]? // empty' .project/context/focus.json 2>/dev/null)
    if [ -n "$next_tasks" ]; then
        echo ""
        echo "  Planned tasks:"
        echo "$next_tasks" | while read task; do
            echo "    • $task"
        done
    fi
fi

# Find in-progress tasks from epics
if [ -d ".project/epics" ]; then
    in_progress=$(grep -rl "status:.*in_progress" .project/epics 2>/dev/null | head -3)
    if [ -n "$in_progress" ]; then
        echo ""
        echo "  In-progress:"
        echo "$in_progress" | while read f; do
            title=$(grep "^# " "$f" | head -1 | sed 's/^# //')
            echo "    • $title"
        done
    fi
fi
```

### 5. Blockers

```bash
echo ""
echo "BLOCKERS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

blockers=0

# Check for blocked tasks
if [ -d ".project/epics" ]; then
    blocked=$(grep -rl "status:.*blocked" .project/epics 2>/dev/null)
    if [ -n "$blocked" ]; then
        echo "$blocked" | while read f; do
            title=$(grep "^# " "$f" | head -1 | sed 's/^# //')
            echo "  ⚠️ $title"
            blockers=$((blockers + 1))
        done
    fi
fi

# Check for merge conflicts
if [ -f .git/MERGE_HEAD ]; then
    echo "  ❌ Merge in progress - resolve conflicts"
    blockers=$((blockers + 1))
fi

if [ "$blockers" -eq 0 ]; then
    echo "  ✓ No blockers"
fi
```

### 6. Quick Stats

```bash
echo ""
echo "QUICK STATS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Commit count (24h)
commit_count=$(git log --oneline --since="24 hours ago" --all 2>/dev/null | wc -l)
echo "  Commits (24h): $commit_count"

# Uncommitted changes
changes=$(git status --short | wc -l)
echo "  Uncommitted changes: $changes"

# Task counts if epics exist
if [ -d ".project/epics" ]; then
    open=$(grep -rl "status:.*open" .project/epics 2>/dev/null | wc -l)
    in_prog=$(grep -rl "status:.*in_progress" .project/epics 2>/dev/null | wc -l)
    done=$(grep -rl "status:.*done\|status:.*completed" .project/epics 2>/dev/null | wc -l)
    echo "  Tasks: $open open | $in_prog active | $done done"
fi
```

### 7. Issues & Warnings

```bash
echo ""
echo "ISSUES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

issues=0

# Uncommitted changes
if [ -n "$(git status --short)" ]; then
    echo "  ⚠️ Uncommitted changes"
    issues=$((issues + 1))
fi

# Unpushed commits
ahead=$(git rev-list --count origin/$(git branch --show-current)..HEAD 2>/dev/null || echo "0")
if [ "$ahead" -gt 0 ]; then
    echo "  ⚠️ $ahead unpushed commit(s)"
    issues=$((issues + 1))
fi

if [ "$issues" -eq 0 ]; then
    echo "  ✓ No issues"
fi
```

### 8. Session Ready

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SESSION READY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next Steps:"
echo "  • '/next' - Continue or find next task"
echo "  • '/focus' - Check/set current focus"
echo "  • '/commit' - Commit pending changes"
```

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  START OF DAY - 2025-12-08
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Repository: my-project
Branch: main

REPOSITORY SYNC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ Up to date

YESTERDAY (What I did)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • abc1234 feat: Add user authentication
  • def5678 fix: Resolve login bug

TODAY (What I'll do)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Current Focus: API Integration

  Planned tasks:
    • Implement OAuth flow
    • Add unit tests

BLOCKERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ No blockers

QUICK STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Commits (24h): 2
  Uncommitted changes: 0
  Tasks: 3 open | 1 active | 5 done

ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ No issues

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESSION READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next Steps:
  • '/next' - Continue or find next task
  • '/focus' - Check/set current focus
  • '/commit' - Commit pending changes
```

## Slack/Teams Format

If user asks for copyable standup format:

```
**Daily Standup - [date]**

*Yesterday:*
- [commit/work item]
- [commit/work item]

*Today:*
- [planned task]
- [planned task]

*Blockers:*
- None
```

## Notes

- Combines session initialization with standup report
- Syncs BEFORE loading context (ensures latest)
- Shows yesterday's git commits and modified files
- Displays today's plan from focus state and tasks
- Highlights blockers clearly
- Provides quick stats overview
- Works with submodules
- Triggers on both "sod" and "standup" keywords
