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

### 1. Show Environment Info

Display:
- Platform (Linux/Mac/Windows)
- Current directory
- Current git branch

### 2. Sync Repository

Run these commands:
1. `git fetch origin`
2. Check if working tree is clean with `git status --short`
3. If clean, check commits behind with `git rev-list --count HEAD..origin/BRANCH`
4. If behind, run `git pull --ff-only`

### 3. Sync Submodules (if present)

If `.gitmodules` exists, run:
`git submodule update --remote --merge`

### 4. Show Progress

Read and display `.project/context/progress.md` if it exists.

### 5. Show Git Status

Display:
- Current branch
- Number of uncommitted changes
- Last 3 commits with `git log --oneline -3`

### 6. Identify Issues

Check for:
- Uncommitted changes (warn user)
- Unpushed commits (warn user)

### 7. Suggest Next Steps

Show:
```
SESSION READY

Suggestions:
- "What's my next task?"
- "Work on task [X]"
- "Show epic status"
```

## Output Format

```
SESSION INIT
============
Platform: [platform]
Location: [directory]
Branch: [branch]

Syncing...
[sync status]

CURRENT PROGRESS
================
[contents of progress.md]

GIT STATUS
==========
Branch: [branch]
Changes: [count] files
[recent commits]

ISSUES
======
[any issues or "None"]

SESSION READY
```

## Notes

- Syncs BEFORE loading context
- Fast-forward only pulls (safe)
- Skips pull if uncommitted changes
- Works with submodules
