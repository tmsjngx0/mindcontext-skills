# MindContext Skills

**Structured project management for Claude Code.** PRDs, epics, tasks, and session management—all through natural language.

## Quick Start

```bash
# Install
/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0

# Initialize your project
"Initialize MindContext in this project"

# Start building
"Create a PRD for user authentication"
```

## Core Workflow

MindContext follows a structured flow from requirements to implementation:

```
PRD → Epic → Tasks → Implementation
```

| Phase | Command | Output |
|-------|---------|--------|
| 1. Requirements | `"create prd for user-auth"` | `.project/prds/user-auth.md` |
| 2. Architecture | `"create epic user-auth"` | `.project/epics/user-auth/epic.md` |
| 3. Planning | `"plan epic user-auth"` | `.project/epics/user-auth/001.md`, `002.md`... |
| 4. Execution | `"start task 001"` | Begin implementation |

**This workflow is enforced.** You can't skip steps without explicit bypass.

## Methodology: SDD + TDD

MindContext uses two complementary approaches:

| Approach | Direction | What It Means |
|----------|-----------|---------------|
| **SDD** (Specification-Driven) | Vertical | PRD → Epic → Tasks. Each level is a contract for the next. |
| **TDD** (Test-Driven) | Horizontal | Per task: write tests first, then implement. |

```
SDD (Vertical)              TDD (Horizontal)
──────────────────────────────────────────────
PRD
  ↓ spec drives
Epic
  ↓ spec drives
Tasks ──────────────────→  Red → Green → Refactor
```

- **SDD ensures** you don't skip planning or treat specs as suggestions
- **TDD ensures** you verify before you ship (via `tdd-agent`)

## Naming Conventions (Strict)

These are **contracts**, not suggestions:

| Element | Format | Example |
|---------|--------|---------|
| Feature names | kebab-case, lowercase | `user-auth` not `UserAuth` |
| Epic folders | Must match PRD name | PRD: `user-auth.md` → Epic: `user-auth/` |
| Task IDs | 3-digit zero-padded | `001`, `002` not `1`, `2` |

## Installation

### From Marketplace (Recommended)

```bash
/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0
```

### Local Development

```bash
/plugin marketplace add ./path/to/mindcontext-skills
/plugin install mindcontext-skills@local
```

### Verify Installation

```
"What MindContext skills do I have?"
```

## Project Structure

```
your-project/
├── .project/
│   ├── prds/           # Product requirements
│   │   └── feature.md
│   ├── epics/          # Implementation plans
│   │   └── feature/
│   │       ├── epic.md # Architecture
│   │       ├── 001.md  # Task 1
│   │       └── 002.md  # Task 2
│   └── context/        # Session state
│       ├── progress.md
│       └── focus.json
└── CLAUDE.md           # AI instructions
```

## Skills Reference

### Session Management
| Skill | Trigger | Description |
|-------|---------|-------------|
| `start-of-day` | "sod", "start of day" | Sync repos, load context, show status |
| `end-of-day` | "eod", "wrap up" | Check uncommitted changes, update context |
| `prime-context` | "prime context" | Load project context |
| `update-context` | "update context" | Save session state |
| `focus-state` | "what am I working on" | Show/set current focus |

### Planning
| Skill | Trigger | Description |
|-------|---------|-------------|
| `prd-create` | "create prd for X" | Create product requirements |
| `epic-create` | "create epic X" | Convert PRD to technical epic |
| `epic-planning` | "plan epic X" | Decompose epic into tasks |
| `epic-start` | "start epic X" | Create branch, begin work |

### Execution
| Skill | Trigger | Description |
|-------|---------|-------------|
| `next-task` | "what's next" | Check focus, find available tasks, start (asks if multiple) |
| `task-start` | "start task 001" | Begin specific task (marks complete when done) |

### Git Operations
| Skill | Trigger | Description |
|-------|---------|-------------|
| `smart-commit` | "commit" | Intelligent commit across repos |
| `git-sync` | "sync to github" | Sync tasks to GitHub issues |

### Project Setup
| Skill | Trigger | Description |
|-------|---------|-------------|
| `project-init` | "initialize project" | Create `.project/` structure |
| `project-status` | "project status" | Show epics, tasks, progress |
| `shadow-setup` | "setup shadow engineering" | Separate AI context from production |

## Slash Commands

Quick access to common operations:

| Command | Description |
|---------|-------------|
| `/sod` | Start of day |
| `/eod` | End of day |
| `/prd` | Create PRD |
| `/epic` | Create epic |
| `/plan` | Plan epic into tasks |
| `/next` | Find and start next task |
| `/commit` | Smart commit |
| `/sync` | Sync to GitHub |

## Agents

MindContext includes specialized agents:

| Agent | Purpose | Used By |
|-------|---------|---------|
| `pm-agent` | Strategic discovery, PRD creation (BMAD methodology) | `create prd` |
| `tdd-agent` | Test-driven development enforcement | `tdd`, `test first` |

### Recommended: feature-dev Plugin

For code exploration, architecture design, and code review, install the **feature-dev** plugin:

```
/plugin install feature-dev@anthropic
```

MindContext + feature-dev gives you the complete workflow:

```
MindContext (Strategy)     →  feature-dev (Implementation)
─────────────────────────────────────────────────────────
PRD creation                  Code exploration
Epic architecture             7-phase development
Task planning                 Code review
Session management            Documentation
```

Without feature-dev, MindContext still handles planning and project management—you just implement tasks manually.

## Shadow Engineering

Keep AI iteration separate from production code:

```
project-shadow/          # AI workspace (messy)
├── .project/            # PRDs, plans
├── .claude/             # AI context
└── actual-project/      # Submodule → clean repo

actual-project/          # What you ship (clean)
├── src/
└── .git                 # Professional commits
```

```
"Setup Shadow Engineering"
```

## FAQ

**Does this work with Cursor/Codex/other tools?**
No. MindContext is specifically for Claude Code's plugin system.

**Do I need to know how to code?**
Basic familiarity with git and terminals. MindContext teaches engineering concepts as you build.

**Is this free?**
Yes. MIT licensed.

## Links

- Repository: https://github.com/tmsjngx0/mindcontext-skills
- Issues: https://github.com/tmsjngx0/mindcontext-skills/issues

## License

MIT
