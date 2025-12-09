# Changelog

All notable changes to MindContext Skills will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **`task-complete` skill** - Finalize tasks and update MindContext state
  - Use after feature-dev completes or after direct implementation
  - Verifies completion (tests pass, code committed, acceptance criteria)
  - Updates task file, progress.md, epic status
  - Suggests next available tasks
  - Total skills: 23
- **Permissions onboarding in `project-init`** - First-time setup guidance
  - Phase 0 checks if user has git permissions configured
  - Shows recommended permissions JSON for smooth workflow
  - Offers to merge into `~/.claude/settings.json`

### Changed
- **`start-of-day` skill rewritten** - Now declarative instead of procedural
  - No embedded bash scripts (fewer permission prompts)
  - Merged `standup-report` functionality into start-of-day
  - Triggers on "sod", "standup", "what did I do"
  - Cleaner output format with Yesterday/Today/Blockers sections
- **`task-start` skill** - Added TDD integration with feature-dev
  - Now offers THREE options for complex tasks:
    1. feature-dev workflow (exploration + architecture + review)
    2. feature-dev + TDD (same + test-first during implementation)
    3. Implement directly (skip exploration/review)
  - TDD option passes strict Red-Green-Refactor requirements to feature-dev Phase 5
  - Declarative rewrite (no embedded bash scripts)

### Removed
- **`standup-report` skill** - Merged into `start-of-day`
  - All standup functionality now in start-of-day
  - One comprehensive session initialization skill

## [1.1.0] - 2025-12-08

### Added
- **`update-context` skill** - Save session state to context files before memory clear
  - New `/update-context` command
  - Updates focus.json, progress.md with session work
  - Pairs with prime-context for full context cycle

### Changed
- **`/next` command** - Now accepts optional task number
  - `/next` finds next available task
  - `/next 3` starts task #3 directly
- **Agent simplification** - Reduced from 4 to 3 agents
  - Created `tdd-agent` for TDD enforcement during feature-dev Phase 5
  - Removed `developer-agent` (replaced by tdd-agent)
  - Removed `qa-agent` (use feature-dev's code-reviewer)
  - Agents: pm-agent, architect-agent, tdd-agent
- **`smart-commit` skill** - Added optional pre-commit context check
  - Use `/commit full` to update CLAUDE.md, progress.md, README, CHANGELOG before committing
  - Default `/commit` skips context check for quick commits
- **`/project-init` command** - Replaces `/shadow` command
  - `/shadow` removed (use `shadow-setup` skill via natural language)
  - `/project-init` triggers brainstorming-driven project initialization
- **Focus state path** - Standardized to `.project/context/focus.json`
  - Fixed inconsistent references to `.project/state/focus.json`
  - Affected: start-of-day, end-of-day, epic-start, task-workflow, next, update-plan

### Fixed
- **Consistent focus.json location** - All skills now use `.project/context/focus.json`

## [1.0.0] - 2025-12-04

First public release of MindContext Skills.

### Added
- **`.project/plans/` folder** - Technical planning outside PRD→Epic flow
  - Architecture plans, migration strategies, integration plans
  - Documented in README with usage guide
  - Complements prds/, epics/, spikes/ structure

- **Worktree documentation** - Shadow Engineering now includes multi-branch workflow
  - Use `.git/info/exclude` for local excludes (not `.gitignore`)
  - Worktrees for parallel branch development
  - Clear guidance on parent vs submodule paths

### Changed
- **Renamed `project-scaffold` → `project-init`** - Brainstorming-driven project initialization
  - Conversational discovery flow (one question at a time)
  - Greenfield vs brownfield detection
  - Creates `.project/design.md` with project vision
  - Feature prioritization before first PRD

- **Deprecated agents** - `architect-agent` and `qa-agent` now recommend feature-dev plugin
  - feature-dev's `code-architect` replaces architect-agent
  - feature-dev's `code-reviewer` replaces qa-agent
  - Original agents kept for reference but marked deprecated
  - Reduces token usage (no Serena dependency)

- **Version reset** - Renumbered from internal v2.x to v1.0.0 for public release
- **Owner updated** - Repository moved to tmsjngx0/mindcontext-skills

### Migration from rc.1
- `project-scaffold` triggers still work but will use `project-init`
- Existing projects don't need changes
- Consider using feature-dev plugin for architecture/review work

---

## Pre-release History (Internal v2.x)

## [2.4.1] - 2025-12-03

### Added
- **`.gitattributes` configuration** - project-scaffold now creates `.gitattributes` for consistent line endings
  - Enforces LF (Unix-style) line endings across all platforms
  - Prevents CRLF/LF conflicts between Windows, Mac, and WSL
  - Covers all common source code file types
  - Handles binary files appropriately
  - Includes Windows-specific files (`.bat`, `.cmd`, `.ps1`) with CRLF
  - Automatically normalizes existing files in brownfield projects

### Fixed
- **Cross-platform line ending issues** - No more "whitespace only" diffs in git

## [2.4.0] - 2025-12-03

### Added
- **Automatic focus state management** - Focus now updates automatically throughout workflow
  - `task-start` - Sets focus when starting a task
  - `task-workflow` - Updates focus at start and completion
  - `epic-start` - Sets focus when starting an epic
  - `end-of-day` - Refreshes focus timestamp before session ends

### Changed
- **Complete session continuity** - Focus state persists through entire workflow
  - Task start: Records epic, issue, branch, timestamp
  - Task completion: Updates timestamp to reflect actual completion time
  - Epic start: Records epic and branch (no specific issue yet)
  - End of day: Captures final session state

### Fixed
- **Focus state gaps** - No longer loses context if Claude crashes
  - Focus updates happen at key workflow points
  - Timestamps accurately reflect last activity
  - Session state survives accidental exits

## [2.3.1] - 2025-12-03

### Changed
- **start-of-day skill** - Now displays focus state from `.project/state/focus.json`
  - Shows last working epic, issue, and branch
  - Displays issue details (title, status) if available
  - Suggests how to continue work based on focus state
  - Provides guidance if no focus is set
  - Integrates seamlessly with `/next` command workflow

### Fixed
- **Focus state integration** - `/sod` now properly restores context of what you were working on

## [2.3.0] - 2025-12-03

### Removed
- **tdd-workflow skill** - Removed to eliminate conflict with superpowers plugin
  - superpowers provides superior TDD enforcement with micro-task granularity
  - MindContext now focuses on strategic planning layer
  - Users should install superpowers for TDD workflows

### Added
- **Plugin ecosystem documentation** - README now explains how MindContext complements other plugins
  - MindContext + superpowers integration guide
  - MindContext + feature-dev integration guide
  - Combined workflow examples showing all three plugins together
  - Clear division of responsibilities (Strategy/Analysis/Execution layers)

### Changed
- **plugin.json** - Updated description to reflect 22 skills and plugin complementarity
  - Version bumped from 2.2.0 → 2.3.0
  - Description now mentions superpowers and feature-dev compatibility
- **Total skills: 22** (23 - 1 removed tdd-workflow)

## [2.2.0] - 2025-12-03

### Added
- **External LLM review workflow** - New command for incorporating feedback from ChatGPT, Claude web, or other LLMs
  - `/update-plan` - Incorporate external review feedback into current issue/task
  - Works with existing MindContext Epic/Task structure
  - Updates issue files directly with improvements from review

### Changed
- **`/next` command` - Clarified documentation for continuing current work or finding next task

## [2.1.1] - 2025-12-03

### Fixed
- **Skill wording clarity** - Corrected language in 4 skills to clarify that main Claude agent spawns subagents, not the skills themselves
  - `task-workflow` - Changed "Invoke developer-agent" to "When main Claude agent spawns developer-agent"
  - `tdd-workflow` - Changed "Invoke developer-agent" to "When main Claude agent spawns developer-agent"
  - `task-start` - Changed "Invoke developer-agent" to "When main Claude agent spawns developer-agent"
  - `epic-start` - Removed "launching parallel agents" language, clarified main agent spawns developer-agents

## [2.1.0] - 2025-12-02

### Added
- **epic-create skill** - Convert PRD to technical Epic (completes PRD → Epic → Tasks workflow)
- **focus-state skill** - Manage current work focus (epic/issue/branch tracking)
- **State management** - `config.json` and `.project/state/focus.json` for project configuration
- **Workflow commands (5 new)** - `/prd`, `/epic`, `/plan`, `/focus`, `/next`

### Removed
- **entity-manage skill** - Violated architecture (skills cannot spawn agents)
- **Analysis commands (6 removed)** - `/analyze`, `/debug`, `/find`, `/review`, `/trace`, `/security`
  - Use natural language instead: "analyze this code", "debug this error", etc.
  - Main Claude agent routes to correct subagent automatically

### Changed
- **Commands simplified** - From 11 to 10 workflow-focused commands
- **project-scaffold skill** - Now creates `.project/state/` directory and state files
- **README** - Updated skill table, added commands section, clarified natural language usage
- **Total skills: 23** (21 existing + 2 new - 1 removed)

### Fixed
- **Architecture compliance** - No skills spawn agents (per official Claude Code docs)
- **Workflow gap** - PRD → Epic conversion now works via epic-create skill

## [1.1.0] - 2025-11-25

### Added
- **Session & Reporting Skills (4 new)**
  - `end-of-day` - Wrap up session, check uncommitted changes
  - `project-status` - Show overall project status and progress
  - `standup-report` - Generate daily standup summary
  - `next-task` - Find next available task to work on

### Changed
- Total skills now: 16

## [1.0.0] - 2025-11-25

### Added
- **Core Skills (12 total)**
  - `project-scaffold` - Initialize MindContext project structure
  - `project-migrate` - Migrate existing PM files to MindContext
  - `start-of-day` - Session initialization with repo sync
  - `prime-context` - Load project context files
  - `session-init` - Initialize work session
  - `prd-create` - Create product requirements documents
  - `epic-planning` - Decompose epics into tasks
  - `epic-start` - Begin epic work with branch setup
  - `task-start` - Start specific task with analysis
  - `task-workflow` - Complete task lifecycle with quality gates
  - `tdd-workflow` - Test-driven development workflow
  - `merge-workflow` - Branch merge with conflict resolution

- **Plugin Infrastructure**
  - `plugin.json` manifest with skills path
  - `marketplace.json` for marketplace distribution
  - README with installation instructions

### Fixed
- Plugin manifest `author` field format (object vs string)
- Marketplace `source` path format (`./` prefix required)
- Removed bash code blocks that caused parse errors

## [0.1.0] - 2025-11-23

### Added
- Initial plugin structure
- Basic skills: prd-create, epic-planning, task-workflow, project-scaffold, session-init