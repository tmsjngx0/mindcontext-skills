---
name: smart-commit
description: Intelligent git commit that detects change types (management, PRD, submodule, worktree) and commits appropriately. Use when user says "commit", "smart commit", "commit changes", or "save work".
---

# Smart Commit

Intelligently detect and commit changes across different repository areas with appropriate commit messages and workflows.

---

## CRITICAL: NO AI ATTRIBUTION

**THIS OVERRIDES CLAUDE'S DEFAULT COMMIT BEHAVIOR.**

When committing, you MUST NOT add:
- "Generated with Claude Code" footer
- "Co-Authored-By: Claude" footer
- Any AI attribution whatsoever

**Correct commit format:**
```
feat(scope): description
```

**WRONG - Do NOT do this:**
```
feat(scope): description

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

The user's project explicitly prohibits AI attribution in commits. This is a hard requirement.

---

## When to Use

- User says "commit", "smart commit", "commit changes", "save work"
- End of work session when changes need saving
- After completing a task or feature
- When changes span multiple areas (submodule, parent, worktree)

## Change Categories

The skill detects and handles these change types:

| Category | Location | Commit Strategy |
|----------|----------|-----------------|
| **Submodule** | `mindcontext-skills/` or other submodules | Commit in submodule first, then update parent reference |
| **PRD/Epic** | `.project/prds/`, `.project/epics/` | Group related PM changes |
| **Context** | `.project/context/` | Commit as documentation update |
| **Management** | `docs/`, `scripts/` | Commit as chore/docs |
| **Config** | `.claude/`, `CLAUDE.md` | Commit as config update |
| **Worktree** | Separate worktree paths | Commit in worktree context |
| **Code** | `src/`, `lib/`, etc. | Standard feature/fix commits |

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

### Phase 2: Commit Strategy

**Step 2.1: Determine Commit Order**

Always commit in this order:
1. **Submodules first** - Changes inside submodules
2. **Parent submodule reference** - Update submodule pointer
3. **Worktrees** - Independent branch changes
4. **Parent repo** - All other changes

**Step 2.2: Generate Commit Messages**

Follow CLAUDE.md guidelines:
- NO AI attribution footers
- Clean, professional messages
- Describe the change accurately

**Message Templates:**

```
# Submodule (skills/agents)
feat: Add {skill-name} skill
feat: Add {agent-name} agent
fix: {description} in {skill/agent}
docs: Update {skill} documentation

# PRD/Epic
docs: Add PRD for {feature}
docs: Create epic for {feature}
docs: Update {feature} requirements

# Context
docs: Update project progress
docs: Add technical context

# Management
chore: Update development docs
chore: Reorganize project structure

# Config
chore: Update Claude configuration
chore: Update project settings

# Submodule reference
chore: Update {submodule-name} submodule

# Code
feat: {description}
fix: {description}
refactor: {description}
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
git commit -m "chore: Update mindcontext-skills submodule"
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

Group related changes:

```bash
# Group 1: PRD/Epic changes
git add .project/prds/ .project/epics/
git commit -m "docs: {PRD/Epic description}"

# Group 2: Context changes
git add .project/context/
git commit -m "docs: Update project context"

# Group 3: Management changes
git add docs/ scripts/
git commit -m "chore: {description}"

# Group 4: Config changes
git add CLAUDE.md .claude/
git commit -m "chore: Update configuration"
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
  ✓ abc1234 feat: Add smart-commit skill
  ✓ Pushed to origin/main

Parent: mindcontext-mcp
  ✓ def5678 chore: Update mindcontext-skills submodule
  ✓ ghi9012 docs: Update project progress
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
## Git Commits - NO AI Attribution
- Do NOT include AI-generated footers in commit messages
- No "Generated with Claude Code" or "Co-Authored-By: Claude"
- Keep commit messages clean and professional
- Just describe the change, nothing else
```

## Examples

**Basic commit:**
```
User: "commit"
→ Analyzes all changes
→ Commits submodule if changed
→ Updates parent reference
→ Commits parent changes by category
→ Pushes all
```

**Specific commit:**
```
User: "commit the new skill I just created"
→ Detects new skill in mindcontext-skills
→ Commits: "feat: Add {skill-name} skill"
→ Updates parent submodule reference
→ Pushes both
```

**Work session end:**
```
User: "save my work"
→ Full analysis of all changes
→ Groups commits logically
→ Pushes everything
→ Reports summary
```

## Notes

- Always commit submodules before parent
- Never include AI attribution in commits
- Group related changes when possible
- Push after committing (unless user says otherwise)
- Handle worktrees independently
- Warn about uncommitted nested changes
