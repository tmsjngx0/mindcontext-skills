---
name: compact-context
description: Archive old session summaries from progress.md to keep it focused. Use when user says "compact context", "slim down progress", "archive old sessions", or "clean up context".
---

# Compact Context

Archive old session summaries from progress.md while preserving full history.

## When to Use

- User says "compact context", "slim down progress"
- User says "archive old sessions", "clean up context"
- progress.md exceeds ~150 lines
- More than 7-10 session summaries accumulated

## What This Skill Does

**Archives from progress.md:**
- Session summaries older than 7 days
- Old "Completed Today" lists
- Historical key decisions (keeps recent 5)

**Does NOT touch:**
- epic.md (tidied by task-complete instead)
- focus.json (always current state)
- Active session content

## Archive Location

```
.project/context/archive/
└── sessions/
    ├── 2025-12.md    # This month's archived sessions
    └── 2025-11.md    # Previous month
```

## Workflow

### 1. Analyze

```bash
# Check progress.md size
wc -l .project/context/progress.md

# Count sessions
grep -cE "^## Session|^### [0-9]{4}-[0-9]{2}-[0-9]{2}" .project/context/progress.md
```

Report:
```
progress.md: {n} lines, {n} sessions (oldest: {date})
```

### 2. Extract Old Sessions

Identify sessions older than 7 days by date patterns:
- `## Session Summary (2025-12-07)`
- `### 2025-12-07`

Move these to archive, keeping:
- Current session
- Last 2-3 sessions (recent context)

### 3. Archive Format

```markdown
# Archived Sessions - December 2025

---

## 2025-12-07

{original session content}

---

## 2025-12-05

{original session content}
```

### 4. Rebuild Slim progress.md

Keep structure, just fewer sessions:

```markdown
# Project Progress

**Last Updated:** {today}
**Current Phase:** {phase}

---

## Current Focus
{unchanged}

---

## Recent Sessions

### {Today}
{current}

### {Yesterday or recent}
{brief}

[Older sessions: .project/context/archive/sessions/]

---

## Next Steps
{unchanged}
```

### 5. Report

```
COMPACTION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

progress.md: {before} → {after} lines
Archived: {n} sessions → archive/sessions/{month}.md
```

---

## Modes

**Default:** Archive sessions older than 7 days
```
compact context
```

**Aggressive:** Keep only today's session
```
compact context --aggressive
```

**Preview:** Show what would be archived
```
compact context --preview
```

---

## Error Handling

| Situation | Action |
|-----------|--------|
| No progress.md | "No progress file found" |
| Already compact | "File is already slim ({n} lines). No action needed." |
| No old sessions | "No sessions older than 7 days found." |

---

## Integration with task-complete

Epic.md tidying happens in **task-complete**, not here:
- When a task completes, task-complete archives its detailed description
- Keeps epic.md focused on remaining work
- See task-complete skill for that logic

This skill focuses only on progress.md session history.
