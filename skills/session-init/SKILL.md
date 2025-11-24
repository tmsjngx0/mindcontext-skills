---
name: session-init
description: Initialize development session with repository sync, context priming, and status overview. Use when user says "start session", "start of day", "sod", "begin work", or "resume work".
---

# Session Init

Prime context and sync repos when starting a work session.

## When to Use

- Starting new work session
- Switching machines
- Resuming after break
- User says "start session", "sod", "start of day"

## Workflow

### 1. Environment Info

```bash
echo "SESSION INIT"
echo "============"
echo "Platform: $(uname -s)"
echo "Location: $(pwd)"
echo "Branch: $(git branch --show-current)"
```

### 2. Sync Repository

```bash
echo "Syncing..."
git fetch origin

# Pull if clean
if [ -z "$(git status --short)" ]; then
    behind=$(git rev-list --count HEAD..origin/$(git branch --show-current) 2>/dev/null || echo 0)
    if [ "$behind" -gt 0 ]; then
        echo "Pulling $behind commits..."
        git pull --ff-only
    else
        echo "Up to date"
    fi
else
    echo "Uncommitted changes - skipping pull"
fi
```

### 3. Sync Submodules

```bash
if [ -f .gitmodules ]; then
    echo "Syncing submodules..."
    git submodule update --remote --merge
fi
```

### 4. Show Progress

```bash
if [ -f .project/context/progress.md ]; then
    echo ""
    echo "CURRENT PROGRESS"
    echo "================"
    cat .project/context/progress.md
else
    echo "No progress file found"
fi
```

### 5. Git Status

```bash
echo ""
echo "GIT STATUS"
echo "=========="
echo "Branch: $(git branch --show-current)"
echo "Changes: $(git status --short | wc -l) files"
echo ""
git log --oneline -3
```

### 6. Issues

```bash
echo ""
echo "ISSUES"
echo "======"

# Uncommitted changes
changes=$(git status --short | wc -l)
[ "$changes" -gt 0 ] && echo "- $changes uncommitted changes"

# Unpushed commits
ahead=$(git rev-list --count origin/$(git branch --show-current)..HEAD 2>/dev/null || echo 0)
[ "$ahead" -gt 0 ] && echo "- $ahead unpushed commits"

[ "$changes" -eq 0 ] && [ "$ahead" -eq 0 ] && echo "None"
```

### 7. Next Steps

```
SESSION READY

Suggestions:
- "What's my next task?"
- "Work on task [X]"
- "Show epic status"
```

## Notes

- Syncs BEFORE loading context
- Fast-forward only pulls
- Skips pull if uncommitted changes
- Works with submodules
