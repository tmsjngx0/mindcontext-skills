---
name: project-scaffold
description: Initialize FlowForge project structure with .project/ directory, CLAUDE.md, and GitHub integration. Use when user says "initialize project", "set up flowforge", "scaffold project", or "create project structure".
---

# Project Scaffold

Initialize or migrate any project to use FlowForge methodology.

## When to Use

- Setting up a new project
- Adding FlowForge to existing project
- User says "initialize project", "set up flowforge", "scaffold"

## Workflow

### 1. Check Existing Structure

First, check if `.project/` directory already exists.
If it does, ask user whether to overwrite or skip.

Also check if this is a git repository. If not, offer to initialize git.

### 2. Detect Project Type

Look for these files to determine project type:
- `package.json` with "react" → frontend-react
- `package.json` with "express" → backend-node
- `pom.xml` → backend-java
- `Cargo.toml` → backend-rust
- `requirements.txt` or `pyproject.toml` → backend-python
- `*.csproj` or `*.sln` → backend-dotnet
- None of above → minimal

Report detected type to user.

### 3. Create Directory Structure

Create these directories:
- `.project/prds/`
- `.project/epics/`
- `.project/context/`

### 4. Create Progress File

Create `.project/context/progress.md` with:

```markdown
# Project Progress

## Current Status
**Health:** Getting Started
**Updated:** [current date]

## In Progress
- Initial setup

## Next Steps
1. Create first PRD
2. Plan first epic
3. Start implementation
```

### 5. Create CLAUDE.md

Create `CLAUDE.md` in project root with:

```markdown
# CLAUDE.md

## Project Overview
[Project description - ask user or detect from package.json/README]

## FlowForge Structure
- PRDs: `.project/prds/`
- Epics: `.project/epics/`
- Progress: `.project/context/progress.md`

## Workflow
- Create PRD: "Create a PRD for [feature]"
- Plan Epic: "Plan the [name] epic"
- Work: "Work on task [number]"

## Testing
[Detect test command or ask user]

## Code Style
Follow existing patterns in the codebase.
```

### 6. GitHub Labels (Optional)

If `gh` CLI is available and authenticated, create labels:
- `epic` (green)
- `task` (blue)

### 7. Summary

Show user:

```
FLOWFORGE INITIALIZED

Created:
  .project/prds/
  .project/epics/
  .project/context/progress.md
  CLAUDE.md

Detected: [project type]

Next: "Create a PRD for [your-first-feature]"
```

## Notes

- Non-destructive (preserves existing src/, tests/, etc.)
- Creates `.project/` as hidden directory
- Auto-detects project type
- GitHub integration is optional
