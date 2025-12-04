---
description: Smart commit - intelligently detect and commit changes across submodules and parent repo
---

# Smart Commit

Intelligently analyze and commit changes across your repository structure.

This will:
1. Detect changes in submodules, worktrees, PRDs, context files, and management docs
2. Categorize changes by type
3. Create appropriate commit messages following project conventions
4. Commit in the correct order (submodules first, then parent)
5. Push changes

## Usage

```bash
/commit              # Quick commit (default)
/commit full         # With context file updates (CLAUDE.md, progress.md, README, CHANGELOG)
```

## Context Update Option

Use "full" or "with context" to update documentation before committing:
- `CLAUDE.md` - Project guidelines
- `.project/context/progress.md` - Session progress
- `README.md` - User documentation
- `CHANGELOG.md` - Version history

Invoke the smart-commit skill: "smart commit" or "full commit"
