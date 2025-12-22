---
name: smart-commit
description: Intelligent git commit using Conventional Commits format. Detects change types, creates granular commits, and auto-detects breaking changes. Use when user says "commit", "smart commit", "commit changes", or "save work".
---

# Smart Commit

Intelligently detect and commit changes using **[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)** format with granular, focused commits.

## Conventional Commits Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | SemVer Impact |
|------|-------------|---------------|
| `feat` | New feature or capability | MINOR |
| `fix` | Bug fix | PATCH |
| `docs` | Documentation only | - |
| `style` | Formatting, whitespace (no code change) | - |
| `refactor` | Code restructuring (no feature/fix) | - |
| `perf` | Performance improvement | - |
| `test` | Adding/updating tests | - |
| `build` | Build system, dependencies | - |
| `ci` | CI/CD configuration | - |
| `chore` | Maintenance tasks | - |
| `revert` | Reverting a previous commit | - |

### Scopes (Recommended)

Scopes add context. Common scopes for this project:

```
feat(skills): add new workflow skill
fix(hooks): handle missing focus.json
docs(readme): update installation guide
refactor(auth): extract token validation
chore(deps): update dependencies
test(api): add endpoint tests
```

### Breaking Changes

Signal breaking changes with `!` or footer:

```
feat!: remove deprecated skill API

feat(api)!: change response format to JSON

feat: update authentication flow

BREAKING CHANGE: Skills now require explicit registration
```

## Granular Commit Philosophy

**Make small, focused commits.** Each commit should:
- Address ONE logical change
- Be independently understandable
- Be independently revertable

**Instead of:**
```
feat: add user authentication with tests and docs
```

**Prefer:**
```
feat(auth): add login endpoint
test(auth): add login endpoint tests
docs(auth): add authentication guide
```

## When to Use

- User says "commit", "smart commit", "commit changes", "save work"
- End of work session when changes need saving
- After completing a task or feature
- When changes span multiple areas (submodule, parent, worktree)

## Change Categories

The skill detects and maps changes to appropriate types:

| Category | Location | Type Mapping |
|----------|----------|--------------|
| **Submodule** | `mindcontext-skills/` or submodules | `feat`/`fix`/`refactor` by content |
| **PRD/Epic** | `.project/prds/`, `.project/epics/` | `docs(prd):` or `docs(epic):` |
| **Context** | `.project/context/` | `docs(context):` |
| **Management** | `docs/`, `scripts/` | `docs:` or `chore(scripts):` |
| **Config** | `.claude/`, `CLAUDE.md` | `chore(config):` |
| **Worktree** | Separate worktree paths | Determined by content |
| **Code** | `src/`, `lib/`, etc. | `feat`/`fix`/`refactor`/`test`/`perf` |
| **Tests** | `test/`, `tests/`, `*.test.*` | `test:` or `test(scope):` |
| **Dependencies** | `package.json`, `requirements.txt` | `build(deps):` or `chore(deps):` |

## Workflow

### Phase 0: Pre-Commit Context Check (Optional)

**Optionally check if project documentation needs updating before committing.**

This phase is **skipped by default** for quick commits. To enable:
- User says "commit with context update" or "full commit"
- Or significant changes detected (new features, breaking changes)

**Step 0.1: Quick Check**

```bash
# Only prompt if significant changes detected
# Skip for: typo fixes, minor edits, WIP commits

# Check if any of these exist and might need updates:
test -f CLAUDE.md && echo "CLAUDE.md exists"
test -f .project/context/progress.md && echo "progress.md exists"
test -f README.md && echo "README.md exists"
test -f CHANGELOG.md && echo "CHANGELOG.md exists"
```

**Step 0.2: Prompt Only if Relevant**

For significant commits (new features, breaking changes), offer context update:

```
Context files may benefit from updates:

[ ] CLAUDE.md - Project guidelines
[ ] progress.md - Session progress
[ ] README.md - User documentation
[ ] CHANGELOG.md - Version history

Update before commit? (y/n/select)
```

**Step 0.3: If User Accepts**

| File | Update With |
|------|-------------|
| `progress.md` | Session summary, changes made |
| `CLAUDE.md` | Project state if structure changed |
| `CHANGELOG.md` | New entry under [Unreleased] |
| `README.md` | Feature list if user-facing changes |

**Step 0.4: Stage Updates**

```bash
git add CLAUDE.md .project/context/progress.md README.md CHANGELOG.md 2>/dev/null
```

---

### Phase 1: Discovery

**Step 1.1: Identify Repository Structure**

```bash
# Check if in git repo
git rev-parse --git-dir 2>/dev/null

# Check for submodules
git submodule status 2>/dev/null

# Check for worktrees
git worktree list 2>/dev/null

# Get current branch
git branch --show-current
```

**Step 1.2: Analyze Changes**

```bash
# Get all changes (staged + unstaged + untracked)
git status --porcelain

# Check submodule changes
git diff --submodule=diff

# Check for changes in each category
git status --porcelain | grep -E "^\s*[MADRCU\?]"
```

**Step 1.3: Categorize Changes**

Parse `git status` output and categorize:

```
CHANGE ANALYSIS
===============

Submodule Changes:
  mindcontext-skills/
    M  skills/new-skill/SKILL.md
    A  agents/new-agent.md

Parent Repo Changes:
  PRD/Epic:
    M  .project/prds/feature-x.md
    A  .project/epics/feature-x/epic.md

  Context:
    M  .project/context/progress.md

  Management:
    M  docs/architecture.md

  Config:
    M  CLAUDE.md

Worktree Changes:
  .worktrees/feature-branch/
    M  src/feature.ts
```

### Phase 1.5: Breaking Change Detection

**Auto-detect potential breaking changes before committing.**

**Step 1.5.1: Analyze Staged Changes**

```bash
# Check for deleted exports
git diff --staged | grep -E "^-export (function|const|class)"

# Check for changed function signatures
git diff --staged | grep -E "^[-+](async )?(function|const) \w+\s*\("

# Check for major dependency bumps
git diff --staged package.json | grep '"version"'

# Check for removed config options
git diff --staged | grep -E "^-\s+[\"']?\w+[\"']?\s*:"
```

**Step 1.5.2: Breaking Change Patterns**

| Pattern | Detection | Confidence |
|---------|-----------|------------|
| Deleted exports | `-export function/const/class` | High |
| Changed signatures | Parameter changes in functions | Medium |
| Major dep bump | `package.json` version X.0.0 | Medium |
| Removed config | Deleted keys in config files | High |
| Deleted routes | Removed API endpoints | High |

**Step 1.5.3: Prompt if Detected**

```
⚠️ Potential breaking change detected:
  - Removed: export function authenticate()
  - Changed: login(user) → login(user, options)

Add breaking change indicator? (y/n)
```

If user confirms, add `!` to type or `BREAKING CHANGE:` footer.

---

### Phase 2: Commit Strategy

**Step 2.1: Determine Commit Order**

Always commit in this order:
1. **Submodules first** - Changes inside submodules
2. **Parent submodule reference** - Update submodule pointer
3. **Worktrees** - Independent branch changes
4. **Parent repo** - All other changes

**Step 2.2: Generate Commit Messages**

Follow Conventional Commits format:
- NO AI attribution footers
- Use appropriate type and scope
- Keep first line under 72 characters (warn if longer)
- Describe the change accurately

**Step 2.3: Message Length Validation**

```
⚠️ Commit message first line is 85 characters (recommended: ≤72)
  "feat(authentication): add comprehensive user login with OAuth2 support"

Shorten? (y/n)
```

**Message Templates (Conventional Commits):**

```
# Skills/Agents (in submodule)
feat(skills): add {skill-name} skill
feat(agents): add {agent-name} agent
fix(skills): {description} in {skill-name}
docs(skills): update {skill} documentation
refactor(skills): restructure {skill-name}

# PRD/Epic
docs(prd): add {feature} requirements
docs(epic): create {feature} architecture
docs(epic): update {feature} tasks

# Context
docs(context): update project progress
docs(context): capture session state

# Management
docs: update development documentation
chore(scripts): {description}

# Config
chore(config): update Claude configuration
chore(config): update project settings

# Submodule reference
chore(submodule): update {submodule-name}

# Code
feat({scope}): {description}
fix({scope}): {description}
refactor({scope}): {description}
perf({scope}): {description}
test({scope}): {description}

# Dependencies
build(deps): add {package}
build(deps): update {package} to {version}
chore(deps): remove unused {package}

# CI/CD
ci: add GitHub Actions workflow
ci: update deployment config

# Breaking Changes
feat({scope})!: {description}
# or with footer:
feat({scope}): {description}

BREAKING CHANGE: {explanation}
```

### Phase 3: Execute Commits

**Step 3.1: Commit Submodule Changes**

```bash
# Enter submodule
cd mindcontext-skills

# Stage and commit
git add -A
git commit -m "{appropriate message}"

# Push submodule
git push

# Return to parent
cd ..
```

**Step 3.2: Update Submodule Reference**

```bash
# Stage submodule pointer update
git add mindcontext-skills

# Commit reference update
git commit -m "chore(submodule): update mindcontext-skills"
```

**Step 3.3: Commit Worktree Changes**

```bash
# For each worktree with changes
cd .worktrees/{branch-name}
git add -A
git commit -m "{appropriate message}"
git push
cd ../..
```

**Step 3.4: Commit Parent Changes**

Group related changes (granular commits by type):

```bash
# Group 1: PRD changes
git add .project/prds/
git commit -m "docs(prd): {feature} requirements"

# Group 2: Epic changes
git add .project/epics/
git commit -m "docs(epic): {feature} architecture"

# Group 3: Context changes
git add .project/context/
git commit -m "docs(context): update project progress"

# Group 4: Management changes
git add docs/
git commit -m "docs: update development documentation"

# Group 5: Config changes
git add CLAUDE.md .claude/
git commit -m "chore(config): update project configuration"

# Group 6: Scripts
git add scripts/
git commit -m "chore(scripts): {description}"
```

**Step 3.5: Push Parent**

```bash
git push
```

### Phase 4: Report

**Commit Summary:**

```
SMART COMMIT COMPLETE
=====================

Submodule: mindcontext-skills
  ✓ abc1234 feat(skills): add smart-commit skill
  ✓ Pushed to origin/main

Parent: flowforge-mcp
  ✓ def5678 chore(submodule): update mindcontext-skills
  ✓ ghi9012 docs(context): update project progress
  ✓ Pushed to origin/main

Worktrees: None

Total: 3 commits across 2 repos
```

## Interactive Mode

When changes are ambiguous, ask user:

```
CHANGES DETECTED
================

I found the following changes:

1. Submodule (mindcontext-skills):
   - New skill: smart-commit
   - Modified: entity-manage skill

2. Parent repo:
   - Modified: .project/context/progress.md
   - Modified: CLAUDE.md

How would you like to commit?

[A] All together (one commit per repo)
[S] Separate commits (group by category)
[M] Manual (I'll guide you through each)
[C] Custom message for all
```

## Special Cases

### No Changes

```
NO CHANGES TO COMMIT
====================

Working directory is clean in:
  ✓ Parent repo
  ✓ mindcontext-skills submodule
  ✓ All worktrees

Nothing to commit.
```

### Uncommitted Submodule Changes

```
⚠️ SUBMODULE HAS UNCOMMITTED CHANGES
=====================================

mindcontext-skills has uncommitted changes that will be lost
if you only commit the parent reference.

Changes in mindcontext-skills:
  M  skills/new-skill/SKILL.md

Options:
[1] Commit submodule first, then parent (recommended)
[2] Skip submodule, commit parent only
[3] Abort
```

### Dirty Worktree

```
⚠️ WORKTREE HAS CHANGES
========================

Worktree: .worktrees/feature-x (branch: feature/x)
  M  src/feature.ts
  A  src/tests/feature.test.ts

This worktree has uncommitted changes.

Options:
[1] Commit worktree changes
[2] Skip worktree
[3] Stash worktree changes
```

### Merge Conflicts

```
❌ CANNOT COMMIT - MERGE CONFLICTS
===================================

The following files have merge conflicts:
  - src/services/UserService.ts
  - .project/epics/auth/epic.md

Please resolve conflicts before committing.

To see conflicts: git diff --name-only --diff-filter=U
```

## Configuration

Respects CLAUDE.md settings:

```markdown
## Git Commits - Conventional Commits + NO AI Attribution
- Use Conventional Commits format: type(scope): description
- Do NOT include AI-generated footers in commit messages
- No "Generated with Claude Code" or "Co-Authored-By: Claude"
- Keep first line under 72 characters
- Make granular commits (one logical change per commit)
```

## Examples

**Basic commit:**
```
User: "commit"
→ Analyzes all changes
→ Detects breaking changes (prompts if found)
→ Commits submodule: "feat(skills): add workflow-status skill"
→ Updates parent: "chore(submodule): update mindcontext-skills"
→ Commits context: "docs(context): update project progress"
→ Pushes all
```

**Specific commit:**
```
User: "commit the new skill I just created"
→ Detects new skill in mindcontext-skills
→ Commits: "feat(skills): add {skill-name} skill"
→ Updates parent: "chore(submodule): update mindcontext-skills"
→ Pushes both
```

**Work session end:**
```
User: "save my work"
→ Full analysis of all changes
→ Groups by type (granular commits)
→ Warns if message > 72 chars
→ Pushes everything
→ Reports summary
```

**Breaking change detected:**
```
User: "commit"
→ Analyzes changes, detects deleted export
→ Prompts: "Breaking change detected. Add indicator? (y/n)"
→ User confirms
→ Commits: "feat(api)!: remove deprecated authenticate function"
→ Pushes
```

## Notes

- Always commit submodules before parent
- Never include AI attribution in commits
- Use Conventional Commits format for all messages
- Make granular commits (one logical change each)
- Warn if first line exceeds 72 characters
- Auto-detect and prompt for breaking changes
- Push after committing (unless user says otherwise)
- Handle worktrees independently
- Warn about uncommitted nested changes
