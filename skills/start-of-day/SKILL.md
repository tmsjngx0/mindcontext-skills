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

## What to Do

### 1. Repository Sync

Run these commands and report results:
- `git fetch origin` - fetch latest
- `git status` - check for uncommitted changes and ahead/behind
- `git submodule update --remote --merge` (if .gitmodules exists)

Report:
- Branch name
- Commits ahead/behind origin
- Uncommitted changes count
- Submodule sync status

### 2. Yesterday's Activity

Gather recent work:
- `git log --oneline --since="24 hours ago" --all` - commits in last 24h
- Check `.project/` for recently modified files (if exists)

Display as bullet list of what was done.

### 3. Today's Plan

Read these files (if they exist):
- `.project/context/focus.json` - current focus, planned tasks
- `.project/context/progress.md` - recent progress notes

Display:
- Current focus/epic/task
- Planned tasks from `next_session_tasks`
- Any in-progress items

### 4. Blockers

Check for:
- Tasks with `status: blocked` in `.project/epics/`
- Merge conflicts (`.git/MERGE_HEAD` exists)

Display blockers or "No blockers".

### 5. Quick Stats

Calculate and display:
- Commits in last 24h (count)
- Uncommitted changes (count)
- Task counts if `.project/epics/` exists (open/active/done)

### 6. Issues

Flag any problems:
- Uncommitted changes
- Unpushed commits
- Merge in progress

### 7. Session Ready

Display next steps:
- `/next` - Continue or find next task
- `/focus` - Check/set current focus
- `/commit` - Commit pending changes

## Output Format

```
START OF DAY - [date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Repository: [name]
Branch: [branch]

REPOSITORY SYNC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [sync status - up to date / X ahead / X behind]

YESTERDAY (What I did)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • [commit or work item]
  • [commit or work item]

TODAY (What I'll do)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Current Focus: [focus name]

  Planned tasks:
    • [task]
    • [task]

BLOCKERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [blockers or "No blockers"]

QUICK STATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Commits (24h): [count]
  Uncommitted changes: [count]
  Tasks: [open] open | [active] active | [done] done

ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [issues or "No issues"]

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

*Today:*
- [planned task]

*Blockers:*
- None
```

## Notes

- Combines session initialization with standup report
- Syncs BEFORE loading context (ensures latest)
- Uses Read tool for files, Bash for git commands
- Triggers on both "sod" and "standup" keywords
