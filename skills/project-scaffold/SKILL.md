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

```bash
# Check if already exists
if [ -d ".project" ]; then
    echo "FlowForge structure already exists"
    # Ask user: overwrite or skip?
fi

# Check git
git rev-parse --git-dir > /dev/null 2>&1 || echo "Not a git repo - offer to init"
```

### 2. Detect Project Type

```bash
PROJECT_TYPE="minimal"

if [ -f "package.json" ]; then
    grep -q '"react"' package.json && PROJECT_TYPE="frontend-react"
    grep -q '"express"' package.json && PROJECT_TYPE="backend-node"
elif [ -f "pom.xml" ]; then
    PROJECT_TYPE="backend-java"
elif [ -f "Cargo.toml" ]; then
    PROJECT_TYPE="backend-rust"
elif [ -f "requirements.txt" ]; then
    PROJECT_TYPE="backend-python"
elif [ -f "*.csproj" ]; then
    PROJECT_TYPE="backend-dotnet"
fi

echo "Detected: $PROJECT_TYPE"
```

### 3. Create Structure

```bash
# Core directories
mkdir -p .project/prds
mkdir -p .project/epics
mkdir -p .project/context

# Progress tracker
cat > .project/context/progress.md << 'EOF'
# Project Progress

## Current Status
**Health:** Getting Started
**Updated:** [date]

## In Progress
- Initial setup

## Next Steps
1. Create first PRD
2. Plan first epic
3. Start implementation
EOF
```

### 4. Create CLAUDE.md

```bash
cat > CLAUDE.md << 'EOF'
# CLAUDE.md

## Project Overview
[Project description]

## FlowForge Structure
- PRDs: `.project/prds/`
- Epics: `.project/epics/`
- Progress: `.project/context/progress.md`

## Workflow
- Create PRD: "Create a PRD for [feature]"
- Plan Epic: "Plan the [name] epic"
- Work: "Work on task [number]"

## Testing
[Test commands]

## Code Style
Follow existing patterns.
EOF
```

### 5. GitHub Labels (if available)

```bash
if command -v gh &> /dev/null && gh auth status &> /dev/null; then
    gh label create "epic" --color "0E8A16" --force 2>/dev/null
    gh label create "task" --color "1D76DB" --force 2>/dev/null
fi
```

### 6. Summary

```
FLOWFORGE INITIALIZED

Created:
  .project/prds/
  .project/epics/
  .project/context/progress.md
  CLAUDE.md

Next: "Create a PRD for [your-first-feature]"
```

## Notes

- Non-destructive (preserves existing src/, tests/)
- Creates `.project/` hidden directory
- Auto-detects project type
- GitHub integration optional
