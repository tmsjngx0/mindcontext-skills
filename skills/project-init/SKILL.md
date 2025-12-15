---
name: project-init
description: Initialize MindContext project with brainstorming-driven design. Creates .project/ structure, CLAUDE.md, and project design through conversational discovery. Use when user says "initialize project", "init project", "set up mindcontext", or "start new project".
---

# Project Init

Initialize any project with MindContext methodology through conversational discovery.

**Note:** For Shadow Engineering (parent + submodule pattern), use `shadow-setup` skill instead.

## When to Use

- Starting a new project (greenfield)
- Adding MindContext to existing project (brownfield)
- User says "initialize project", "init project", "project init", "set up mindcontext"
- User says "quick init" or "init quick" → One-shot mode (no questions)

## Workflow Overview

```
project-init
    │
    ├── 1. Check existing structure
    ├── 2. Detect project type (greenfield vs brownfield)
    ├── 3. Create directory structure
    ├── 4. Create config files
    ├── 5. Create CLAUDE.md (template)
    ├── 6. Create .gitattributes
    │
    ├── 7. PROJECT DISCOVERY (brainstorming)
    │      ↓
    │   Conversational questions (one at a time)
    │      ↓
    │   User mentions reference project?
    │      ↓
    │   ┌─────────────────────────────┐
    │   │  RESEARCH PHASE (optional)  │
    │   │  - Clone reference repo     │
    │   │  - Use plan mode + agents   │
    │   │  - Save to .project/spikes/ │
    │   │  - Resume brainstorming     │
    │   └─────────────────────────────┘
    │      ↓
    │   Creates .project/design.md
    │
    ├── 8. Feature prioritization
    │      "Which feature should we start with?"
    │
    └── 9. Trigger first PRD (optional)
```

---

## Phase 0: Permissions Onboarding (First-time Setup)

On first project initialization, offer to set up recommended permissions for smoother workflow.

### Check if First Time

Look for existing MindContext projects:
- Check if `~/.claude/settings.json` already has git permissions
- If not, this is likely first-time setup

### Permissions Prompt

```
MINDCONTEXT SETUP

For the best experience, add these permissions to your Claude settings.
This allows MindContext skills to run git commands without prompts.

Add to ~/.claude/settings.json:

{
  "permissions": {
    "allow": [
      "Bash(git fetch:*)",
      "Bash(git pull:*)",
      "Bash(git push:*)",
      "Bash(git status:*)",
      "Bash(git branch:*)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git rev-list:*)",
      "Bash(git rev-parse:*)",
      "Bash(git submodule:*)",
      "Bash(git worktree:*)",
      "Bash(jq:*)",
      "Bash(date:*)"
    ]
  }
}

Options:
1. Add permissions now (I'll help merge them)
2. Skip for now (you'll see permission prompts)
3. I've already set this up
```

### If User Chooses Option 1

Read `~/.claude/settings.json`, merge the permissions array (don't overwrite existing), and write back.

**Important:** Ask user to confirm before modifying their global settings.

### After Permissions

Continue with normal project initialization.

---

## Phase 1: Setup (Steps 1-6)

### 1. Check Existing Structure

```
Check for .project/ directory:
  → Exists with design.md: "Already initialized. Update design?"
  → Exists without design.md: "Structure exists. Add project design?"
  → Doesn't exist: Continue with full setup

Check for git:
  → Not a repo: "Initialize git repository? (recommended)"
```

### 2. Detect Project Type

**Greenfield indicators:**
- No source files (empty or minimal)
- No package.json/pyproject.toml/Cargo.toml
- Fresh git repo or no git

**Brownfield indicators:**
- Existing source code
- Package manager files present
- Git history exists

Detect stack from:
- `package.json` with "react" → frontend-react
- `package.json` with "express"/"fastify" → backend-node
- `pyproject.toml` or `requirements.txt` → python
- `Cargo.toml` → rust
- `go.mod` → golang
- `pom.xml` → java
- `*.csproj` → dotnet

### 3. Create Directory Structure

```bash
mkdir -p .project/prds
mkdir -p .project/epics
mkdir -p .project/plans
mkdir -p .project/spikes
mkdir -p .project/context
```

### 4. Create Config Files

`.project/config.json`:
```json
{
  "tdd_mode": true,
  "auto_sync_github": false,
  "commit_style": "conventional"
}
```

`.project/context/focus.json`:
```json
{
  "current_epic": null,
  "current_issue": null,
  "current_branch": null,
  "last_updated": null
}
```

`.project/context/progress.md`:
```markdown
# Project Progress

## Current Status
**Phase:** Getting Started
**Updated:** [date]

## In Progress
- Project initialization

## Next Steps
1. Complete project design
2. Create first PRD
3. Start implementation
```

### 5. Create CLAUDE.md

```markdown
# CLAUDE.md

## Project Overview
[Filled from design.md after brainstorming]

## Project Design
See `.project/design.md` for full project vision and feature roadmap.

## CRITICAL RULES

### Git Commits - NO AI ATTRIBUTION
**IMPORTANT:** Never add AI-generated footers to git commit messages:
- NO "Generated with Claude Code" footer
- NO "Co-Authored-By: Claude" or similar
- NO AI attribution of any kind
- Keep commit messages clean, professional, human-authored style
- Just describe the change, nothing else

### File Organization - Use .project/ Structure
All project management files go in `.project/`:
- PRDs → `.project/prds/{feature-name}.md`
- Epics → `.project/epics/{feature-name}/epic.md`
- Tasks → `.project/epics/{feature-name}/001.md`, `002.md`, etc.
- Plans → `.project/plans/{plan-name}.md`
- Research/spikes → `.project/spikes/{topic}.md`
- Progress/focus → `.project/context/progress.md`, `focus.json`

**EXACT epic/task structure (MUST follow):**
```
.project/epics/{feature-name}/
├── epic.md       # Architecture and implementation plan
├── 001.md        # Task 1 (NOT 001-task-name.md)
├── 002.md        # Task 2
└── 003.md        # Task 3
```

**NEVER create:**
- `epics/{name}/tasks/` subfolder - tasks go directly in epic folder
- `001-task-name.md` format - use `001.md` only
- `doc/`, `docs/`, `docs/plans/`, `design/`, `planning/` folders

### Task Execution
For complex tasks (3+ files, new integrations), use feature-dev plugin:
- `/feature-dev [task description]`
- Provides codebase exploration, architecture design, and code review

## MindContext Structure
```
.project/
├── design.md                    # Project vision and feature roadmap
├── config.json                  # Project settings
├── prds/
│   └── {feature-name}.md        # PRD files (one per feature)
├── epics/
│   └── {feature-name}/          # One folder per epic
│       ├── epic.md              # Architecture/implementation plan
│       ├── 001.md               # Task 1 (simple numbering)
│       ├── 002.md               # Task 2
│       └── 003.md               # Task 3
├── plans/                       # Technical plans (not PRD-driven)
│   └── {plan-name}.md
├── spikes/                      # Research, experiments
│   └── {topic}.md
└── context/
    ├── progress.md              # Session progress
    └── focus.json               # Current focus state
```

**IMPORTANT:** Tasks are `001.md`, `002.md` directly in epic folder.
NOT `tasks/001-task-name.md` or any other format.

## Workflow - USE MINDCONTEXT SKILLS
**IMPORTANT:** Always use MindContext skills for project management. Do NOT improvise your own structure.

| User Request | Say This (triggers skill) | Result |
|--------------|---------------------------|--------|
| "Let's plan X" | "create prd X" | `.project/prds/X.md` |
| "Design X feature" | "create epic X" | `.project/epics/X/epic.md` |
| "Break down X" | "plan epic X" | `.project/epics/X/001.md`, `002.md` |
| "Work on task" | "start task 1" | Updates focus, begins work |

**Standard flow:**
1. `create prd [feature]` → `.project/prds/{feature}.md`
2. `create epic [feature]` → `.project/epics/{feature}/epic.md`
3. `plan epic [feature]` → `.project/epics/{feature}/001.md`, `002.md`, etc.
4. `start task [number]` or `/feature-dev [task]`

**DO NOT:**
- Create `/tasks/` subfolders
- Use `001-task-name.md` naming
- Improvise project management structures
- Skip the PRD → Epic → Tasks flow

## Testing
[Detect or ask: pytest, jest, cargo test, etc.]

## Code Style
Follow existing patterns in codebase.
```

### 6. Create .gitattributes

Create standard .gitattributes for cross-platform line ending consistency.
(Same as current implementation)

---

## Phase 2: Project Discovery (Step 7)

**This is the key new phase - conversational brainstorming.**

### Greenfield Flow (7 questions)

**Opening:**
"Let's define your project. I'll ask a few questions one at a time."

**Q1: What are we building?**
"In one sentence, what is this project?"
→ Open-ended (elevator pitch)

**Q2: Who is it for?**
"Who will use this?"
- [ ] Internal team/company
- [ ] End consumers (B2C)
- [ ] Businesses (B2B)
- [ ] Developers (API/tools)
- [ ] Personal project

**Q3: What problem does it solve?**
"What's the main pain point this addresses?"
→ Open-ended

**Q4: Core features (MVP)**
"What are the 3-5 must-have features for v1?"
→ Open-ended, guide toward concrete list

**Q5: Tech stack**
"Based on [detected/blank], I'd suggest:
- Language: [X] because [reason]
- Framework: [Y] because [reason]

Does this work, or do you have preferences?"
- [ ] Sounds good
- [ ] I have preferences (specify)
- [ ] Let's discuss options

**Q6: Out of scope**
"What should we explicitly NOT build in v1?"
→ Open-ended (important for focus)

**Q7: Constraints**
"Any constraints I should know about?"
- [ ] Timeline pressure
- [ ] Solo developer
- [ ] Learning project
- [ ] Production-critical
- [ ] None significant

**Wrap-up:**
"Here's what I've captured: [summary]

Does this look right? Any adjustments?"

### Brownfield Flow (Auto-Generate + Ask Where to Start)

For existing projects, auto-generate context from codebase analysis, then ask user where to focus.

**Step 1: Auto-Analyze Codebase**

Gather information automatically (no questions):

```bash
# Project purpose
cat README.md 2>/dev/null | head -50

# Tech stack
cat package.json 2>/dev/null | head -30
cat pyproject.toml 2>/dev/null | head -30
cat Cargo.toml 2>/dev/null | head -30
cat go.mod 2>/dev/null | head -20

# Directory structure
find . -type d -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/__pycache__/*' -maxdepth 3 2>/dev/null

# Git history for progress
git log --oneline -20 2>/dev/null
git branch -a 2>/dev/null
git status --short 2>/dev/null
```

**Step 2: Auto-Generate progress.md**

Create `.project/context/progress.md` from git history:

```markdown
# Project Progress

**Last Updated:** [current timestamp]
**Current Branch:** [from git branch --show-current]

---

## Recent Activity

[Extract from git log --oneline -10, grouped by date if possible]

### Recent Commits
- [commit 1 summary]
- [commit 2 summary]
- [commit 3 summary]

### Active Branches
[List from git branch -a, highlight current]

---

## Working State

[From git status]
- Modified files: [count]
- Untracked files: [count]
- Staged changes: [yes/no]

---

## Next Steps

1. [To be determined - ask user]

---

## Session Notes

*Project initialized with MindContext on [date]*
```

**Step 3: Auto-Generate design.md**

Create `.project/design.md` from README + config files:

```markdown
---
name: [from package.json name or directory name]
type: brownfield
created: [timestamp]
analyzed_from: [list of files read]
---

# Project Design: [Project Name]

## Vision

[Extract from README.md - first paragraph or description]

## Technical Stack

### Detected Stack
| Component | Value | Source |
|-----------|-------|--------|
| Language | [detected] | [file] |
| Framework | [detected] | [file] |
| Package Manager | [npm/pip/cargo/etc] | [file] |
| Test Framework | [detected or "Unknown"] | [file] |

### Dependencies (Key)
[List top 5-10 dependencies from package.json/requirements.txt/etc]

## Project Structure

```
[Directory tree from analysis]
```

### Key Directories
| Directory | Purpose |
|-----------|---------|
| [src/] | [inferred purpose] |
| [tests/] | [inferred purpose] |
| ... | ... |

## Existing Features

[Extract from README if available, otherwise mark as "To be documented"]

## Feature Roadmap

### Current State
- [Existing features - to be confirmed with user]

### Planned
- [To be determined - ask user]

## Out of Scope

[To be determined]

## Notes

*This design was auto-generated from codebase analysis. Review and update as needed.*
```

**Step 4: Initialize focus.json (Empty)**

Create `.project/context/focus.json` with no focus set:

```json
{
  "current_focus": null,
  "key_decisions": {},
  "next_session_tasks": [],
  "last_updated": "[timestamp]"
}
```

**Step 5: Show Summary and Ask Where to Start**

```
BROWNFIELD PROJECT ANALYZED

📁 Project: [name]
📍 Location: [path]

📊 Auto-Generated Context:
  ✅ .project/context/progress.md  (from git history)
  ✅ .project/design.md            (from README + config)
  ✅ .project/context/focus.json   (empty - needs your input)

🔍 Detected:
  • Language: [detected]
  • Framework: [detected]
  • Recent commits: [count]
  • Active branches: [list]

📝 Review the generated files - I may have missed things.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHERE WOULD YOU LIKE TO START?

1. 🐛 Fix a bug
2. ✨ Add a new feature
3. 🔧 Refactor/improve existing code
4. 📚 Just exploring - no focus yet
5. 📋 Other (describe)

[User selects]
```

**Step 6: Set Focus Based on Answer**

Based on user's choice:

| Choice | Action |
|--------|--------|
| Fix a bug | Ask "Which bug?" → Create focus with type "bugfix" |
| Add feature | Ask "What feature?" → Suggest starting PRD flow |
| Refactor | Ask "What area?" → Create focus with type "refactor" |
| Exploring | Leave focus.json empty, suggest "prime-context" next time |
| Other | Ask for details → Set appropriate focus |

**Example for "Add a new feature":**
```
"What feature would you like to add?"

[User describes]

"Got it. Would you like to:
1. Create a PRD for this feature (recommended)
2. Jump straight to implementation
3. Just note it for later"
```

If PRD selected → trigger `prd-create` skill with context.

**Step 7: Final Summary**

```
PROJECT INITIALIZED: [project-name]

Created:
  ✅ .project/design.md           ← Auto-generated from codebase
  ✅ .project/context/progress.md ← Auto-generated from git
  ✅ .project/context/focus.json  ← Set to: [focus or "none"]
  ✅ .project/config.json
  ✅ CLAUDE.md
  ✅ .gitattributes

Current Focus: [description or "None - exploring"]

Next: [appropriate next step based on focus]
```

---

## Phase 2.5: Reference Research (Optional)

**IMPORTANT:** If user wants to study a reference project before finalizing design, handle it properly.

### Detecting Research Request

During brainstorming (especially Q5: Tech Stack), user might say:
- "Can we fork/study [project]?"
- "I want to follow [project]'s patterns"
- "Let's look at how [project] does it"
- "Study [project] architecture first"

### Research Flow

When research is requested:

```
1. Pause brainstorming (note what we've captured so far)
      ↓
2. Set up reference project
   - Create _reference/ directory (add to .gitignore)
   - Clone as submodule OR shallow clone:
     git clone --depth 1 [url] _reference/[name]
      ↓
3. Enter plan mode for research
   - Use Explore agents to analyze architecture
   - Use Plan agents to document patterns
      ↓
4. Save research to .project/spikes/
   - Create .project/spikes/reference-[name].md
   - Document: architecture, patterns, key files, decisions
      ↓
5. Exit plan mode
      ↓
6. Resume brainstorming with research context
   - "Based on [project] analysis, I recommend..."
   - Continue to design.md creation
```

### Research Output Location

**CRITICAL:** All research artifacts go in the PROJECT, not Claude's internal files.

| Content | Location | NOT |
|---------|----------|-----|
| Architecture analysis | `.project/spikes/reference-{name}.md` | `~/.claude/plans/` |
| Pattern documentation | `.project/spikes/reference-{name}.md` | Claude memory |
| Final design | `.project/design.md` | `~/.claude/plans/` |

### Research Spike Template

Save to `.project/spikes/reference-{name}.md`:

```markdown
---
name: {project-name} Architecture Analysis
type: reference-research
source: {github-url}
analyzed: {timestamp}
---

# {Project} Architecture Reference

## Overview
[What the project does, why we're studying it]

## Project Structure
```
{key directories and their purposes}
```

## Key Patterns

### Pattern 1: [Name]
- **Where:** [files/directories]
- **How it works:** [description]
- **Adopt for our project:** [yes/no/modified]

### Pattern 2: [Name]
...

## Technology Stack
| Layer | Their Choice | Our Consideration |
|-------|--------------|-------------------|
| Backend | [X] | [same/different + why] |
| Frontend | [X] | [same/different + why] |
| Database | [X] | [same/different + why] |

## Key Files to Study
- `path/to/file.cs` - [why important]
- `path/to/other.cs` - [why important]

## Recommendations for Our Project
1. [Adopt X pattern because...]
2. [Simplify Y because...]
3. [Skip Z because...]

## Open Questions
- [Question needing user input]
```

### Handling Long Clones

For large repositories (like Sonarr ~400MB):

```
"This repository is large. Options:

1. Shallow clone (faster, latest code only)
   git clone --depth 1 [url]

2. Full clone (slower, complete history)
   git clone [url]

3. Skip clone, I'll browse GitHub directly
   (Use WebFetch to analyze key files)

Which do you prefer?"
```

If clone takes time:
- Run in background
- Continue brainstorming other questions
- Return to research when clone completes

### After Research Completes

```
"Research complete! I've documented [project]'s architecture in:
  .project/spikes/reference-{name}.md

Key findings:
- [Pattern 1] - recommend adopting
- [Pattern 2] - recommend simplifying
- [Pattern 3] - recommend skipping

Based on this research, let me update my recommendations...

[Continue with remaining brainstorming questions or proceed to design.md]"
```

---

## Phase 3: Create Design Document (Step 8)

Create `.project/design.md`:

```markdown
---
name: [project-name]
type: [greenfield|brownfield]
created: [timestamp]
---

# Project Design: [Project Name]

## Vision
[2-3 sentence elevator pitch from Q1]

## Problem Statement
[From Q3 - what problem, who has it, why it matters]

## Target Users
- **Primary:** [from Q2]
- **Secondary:** [if any]

## Feature Roadmap

### Phase 1: MVP
| Feature | Description | Priority |
|---------|-------------|----------|
| [feature-1] | [one line] | P0 |
| [feature-2] | [one line] | P0 |

### Phase 2: Enhancement
| Feature | Description | Priority |
|---------|-------------|----------|
| [feature-3] | [one line] | P1 |

### Future Considerations
- [deferred items from out-of-scope]

## Technical Direction

### Stack
- **Language:** [choice + why]
- **Framework:** [choice + why]
- **Database:** [if applicable]
- **Deployment:** [if discussed]

### Key Decisions
- [Any decisions made during brainstorm]

## Out of Scope (v1)
- [Explicit exclusions from Q6]

## Constraints
- [From Q7]

## Success Criteria
- [Inferred from problem/features]
```

### If User Rejects design.md

If the user rejects the design document write, don't abandon - ask why:

```
"You rejected the design document. What would you like to change?

1. Adjust the content (tell me what to change)
2. Do more research first (study a reference project)
3. Start over with different direction
4. Skip design.md for now (not recommended)"
```

**Option 1:** Ask what to change, update, try again.
**Option 2:** Enter research phase (Phase 2.5), then return.
**Option 3:** Restart brainstorming from Q1.
**Option 4:** Proceed without design.md (warn about missing foundation).

---

## Phase 4: Feature Prioritization (Step 9)

After design.md is created:

```
"I've identified these features for MVP:
1. [feature-1] - [one line]
2. [feature-2] - [one line]
3. [feature-3] - [one line]

Which should we tackle first?"
```

User selects, then:

```
"Starting PRD for [selected-feature]..."
→ Trigger prd-create skill with context from design.md
```

Or user can say "I'll create PRDs later" to finish.

---

## Skip Option

For experienced users or quick prototypes:

**Greenfield:**
```
"Would you like to:
1. Define the project now (recommended)
2. Skip to structure only"
```

**Brownfield:**
```
"Would you like to:
1. Document the project vision (recommended)
2. Skip to adding a feature (PRD)
3. Just set up structure"
```

---

## Summary Output

```
PROJECT INITIALIZED: [project-name]

Created:
  .project/design.md           ← Project vision & roadmap
  .project/prds/
  .project/epics/
  .project/plans/
  .project/spikes/
  .project/context/progress.md
  .project/context/focus.json
  .project/config.json
  CLAUDE.md
  .gitattributes

Detected: [greenfield|brownfield] [stack]

Features identified:
  1. [feature-1] ← Ready for PRD
  2. [feature-2]
  3. [feature-3]

Next: "create prd [feature-1]"
```

---

## Integration Notes

### With feature-dev Plugin
CLAUDE.md references feature-dev for complex task execution:
- MindContext handles: PRD → Epic → Task breakdown
- feature-dev handles: Exploration → Architecture → Implementation → Review

### With Shadow Engineering
If shadow-setup calls project-init:
- Runs in submodule context
- Parent tracks branch context separately
- design.md goes in submodule's .project/

---

## Principles (from Superpowers brainstorming)

1. **One question at a time** - Don't overwhelm
2. **Multiple choice when possible** - Easier to answer
3. **Lead with recommendation** - "I'd suggest X because..."
4. **Explore alternatives** - For key decisions, offer 2-3 approaches
5. **Incremental validation** - Confirm understanding before proceeding
6. **YAGNI ruthlessly** - Push back on scope creep
