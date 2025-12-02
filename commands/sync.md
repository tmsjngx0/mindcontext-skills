---
description: Sync epic tasks to GitHub issues and vice versa
---

# Sync to GitHub

Synchronize MindContext epic tasks with GitHub issues for integrated project management.

Invoke the git-sync skill to:
- Create GitHub issues from epic tasks
- Update GitHub issues when tasks change
- Pull GitHub issue status back to tasks
- Maintain bidirectional sync between MindContext and GitHub

The skill will:
1. Find all tasks in the specified epic
2. Match tasks to existing GitHub issues (via `github_issue` field)
3. Create new issues for tasks without GitHub links
4. Update issue status, labels, and assignees to match tasks
5. Pull updates from GitHub back to tasks
6. Resolve conflicts by asking user preference
7. Generate sync summary report

Requires `gh` CLI to be installed and authenticated.
