# FlowForge Skills

> Claude Code skills plugin for FlowForge project management

## Overview

FlowForge brings structured project management to Claude Code through natural language. Simply describe what you want to do and Claude activates the appropriate skill.

## Installation

**Project-level (recommended):**
```bash
# Copy skills to your project
mkdir -p .claude/skills
cp -r flowforge-skills/skills/* .claude/skills/
```

**Personal (all projects):**
```bash
cp -r flowforge-skills/skills/* ~/.claude/skills/
```

## Available Skills

| Skill | Triggers | Description |
|-------|----------|-------------|
| `project-scaffold` | "initialize project", "set up flowforge" | Initialize `.project/` structure |
| `session-init` | "start session", "sod" | Sync repos and prime context |
| `prd-create` | "create prd for X" | Create product requirements doc |
| `epic-planning` | "plan epic X" | Decompose epic into tasks |
| `task-workflow` | "work on task X" | Complete task lifecycle |

## Project Structure

Skills create/use this structure:

```
your-project/
├── .project/
│   ├── prds/           # Product requirements
│   ├── epics/          # Epic definitions
│   │   └── feature/
│   │       ├── epic.md
│   │       └── 001.md  # Tasks
│   └── context/
│       └── progress.md
└── CLAUDE.md
```

## Natural Language Examples

```
"Initialize FlowForge in this project"
"Create a PRD for user authentication"
"Plan the login epic"
"Start my work session"
"Work on task 3"
```

## License

MIT
