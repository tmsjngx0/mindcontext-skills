---
name: prime-context
description: Load project context files and establish understanding of the codebase for a new session. Use when user says "prime context", "load context", "get context", or at start of session.
---

# Prime Context

Load essential project context for a new agent session by reading documentation and understanding the codebase structure.

## When to Use

- Starting a new development session
- After `start-of-day` to load detailed context
- User says "prime context", "load context"
- Need to understand the project before working

## Workflow

### 1. Check Context Availability

```bash
# Check for project context directory
ls -la .project/context/ 2>/dev/null

# If not found, check alternate locations
ls -la docs/ 2>/dev/null
ls -la context/ 2>/dev/null
```

If no context directory exists:
```
❌ No context found.

To establish project context:
1. Create .project/context/ directory
2. Add project-overview.md, tech-context.md, progress.md
3. Or use existing README.md and docs/

Continuing with available files...
```

### 2. Load Context Files (Priority Order)

**Priority 1 - Essential Context (load first):**
1. `project-overview.md` - High-level understanding
2. `project-brief.md` - Core purpose and goals
3. `tech-context.md` - Technical stack and dependencies

**Priority 2 - Current State (load second):**
4. `progress.md` - Current status and recent work
5. `project-structure.md` - Directory and file organization

**Priority 3 - Deep Context (load third):**
6. `system-patterns.md` - Architecture and design patterns
7. `product-context.md` - User needs and requirements
8. `project-style-guide.md` - Coding conventions

### 3. Fallback Sources

If context files are missing, extract from:
- `README.md` - Project overview
- `package.json` / `pyproject.toml` / `Cargo.toml` - Tech stack
- Recent git commits - Current progress
- Directory structure - Project organization

```bash
# Check for README
test -f README.md && echo "README.md available"

# Check for config files
ls package.json pyproject.toml Cargo.toml pom.xml build.gradle *.csproj 2>/dev/null

# Recent commits
git log --oneline -10
```

### 4. Git State Check

```bash
# Current branch
git branch --show-current

# Recent activity
git log --oneline -5

# Working tree status
git status --short
```

### 5. Summary Output

```
🧠 Context Primed Successfully

📖 Loaded Context Files:
  ✅ Essential: [X]/3 files
  ✅ Current State: [X]/2 files
  ✅ Deep Context: [X]/3 files

🔍 Project Understanding:
  - Name: [project_name]
  - Type: [project_type]
  - Language: [primary_language]
  - Status: [current_status]
  - Branch: [git_branch]

📊 Key Metrics:
  - Last Updated: [date]
  - Files Loaded: [count]

⚠️ Warnings (if any):
  [list any missing files or issues]

🎯 Ready State:
  ✅ Project context loaded
  ✅ Current status understood
  ✅ Ready for development work

💡 Project Summary:
  [2-3 sentence summary of what the project is and current state]
```

## Error Handling

### Missing Context Directory
```
⚠️ No .project/context/ directory found

Falling back to:
- README.md for project overview
- Config files for tech stack
- Git history for progress

Recommendation: Create context files for better AI assistance
```

### Partial Context
```
⚠️ Partial Context Loaded

Loaded: [list of files]
Missing: [list of missing files]

Continuing with available context.
Suggest running context update to fill gaps.
```

### No Context Available
```
❌ No Project Context Found

Available information:
- Git repository: [yes/no]
- README: [yes/no]
- Config files: [list]

Please provide project context or create:
  .project/context/project-overview.md
  .project/context/tech-context.md
```

## Context File Templates

### project-overview.md
```markdown
---
created: [date]
last_updated: [date]
version: 1.0
---

# Project Overview

## What is this project?
[Brief description]

## Key Features
- [Feature 1]
- [Feature 2]

## Architecture
[High-level architecture description]
```

### tech-context.md
```markdown
---
created: [date]
last_updated: [date]
---

# Technical Context

## Tech Stack
- Language: [language]
- Framework: [framework]
- Database: [database]

## Dependencies
[Key dependencies and why they're used]

## Build & Run
[How to build and run the project]
```

### progress.md
```markdown
---
created: [date]
last_updated: [date]
---

# Progress

## Current Status
[What's currently being worked on]

## Recent Completions
- [Recent work 1]
- [Recent work 2]

## Next Steps
- [Planned work 1]
- [Planned work 2]
```

## Notes

- Load files in priority order for optimal understanding
- Handle missing files gracefully - don't fail completely
- Provide clear summary of what was loaded
- Always check git state for current branch context
- Fallback to standard files if context directory missing
