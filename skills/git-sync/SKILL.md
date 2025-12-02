---
name: git-sync
description: Sync epic tasks between .project/ structure and GitHub issues. Use when user says "sync to github", "create github issues", "sync epic to issues", or "update github from tasks".
---

# Git Sync

Synchronize FlowForge epic tasks with GitHub issues for integrated project management.

## When to Use

- User says "sync to github", "sync epic", "create issues"
- Need to create GitHub issues from epic tasks
- Update existing GitHub issues from task changes
- Pull GitHub issue status back to tasks
- Bidirectional sync between FlowForge and GitHub

## What It Does

Synchronizes `.project/epics/{epic}/{number}.md` tasks with GitHub issues using the `gh` CLI:

1. **Discovery** - Find all tasks in epic
2. **Match** - Link tasks to existing GitHub issues
3. **Create** - Create GitHub issues for new tasks
4. **Update** - Sync status, assignees, labels
5. **Link** - Add GitHub issue URLs to task frontmatter

## Workflow

### Phase 1: Preparation

**Step 1.1: Verify GitHub CLI**

```bash
# Check gh is installed and authenticated
gh auth status

# If not authenticated:
gh auth login
```

**Step 1.2: Identify Epic**

User can specify:
- Epic name: "sync user-auth epic"
- Epic path: "sync .project/epics/user-auth/"
- Current epic: "sync current epic" (detect from branch or context)

**Step 1.3: Load Epic Tasks**

```bash
# Find all tasks in epic
find .project/epics/{epic-name}/ -name "[0-9][0-9][0-9].md" -type f | sort
```

Read each task file to extract:
- Title (from frontmatter or H1)
- Description (task body)
- Status (frontmatter: `status: open|in_progress|done`)
- Assignee (frontmatter: `assignee:`)
- Labels (frontmatter: `labels:`)
- GitHub issue number (frontmatter: `github_issue:`)

### Phase 2: Sync Strategy

**Option A: Create New Issues**

For tasks without `github_issue` field:

```bash
gh issue create \
  --title "Task #001: {title}" \
  --body "{description}" \
  --label "epic:{epic-name}" \
  --label "task" \
  --assignee "{assignee}"
```

Capture issue number and update task frontmatter:
```yaml
github_issue: 42
github_url: https://github.com/owner/repo/issues/42
```

**Option B: Update Existing Issues**

For tasks with `github_issue` field:

```bash
# Get current GitHub issue state
gh issue view {issue-number} --json state,assignees,labels

# Compare with task state
# Update GitHub if task changed:
gh issue edit {issue-number} \
  --add-label "{new-label}" \
  --add-assignee "{assignee}"

# Update task if GitHub changed
```

**Option C: Bidirectional Sync**

1. Compare task state vs GitHub issue state
2. Determine which is newer (check updated timestamps)
3. Sync from newer to older
4. Handle conflicts by asking user

### Phase 3: Task → GitHub

**Step 3.1: Map Task Status to GitHub**

| FlowForge Status | GitHub State | GitHub Labels |
|------------------|--------------|---------------|
| `open` | open | - |
| `in_progress` | open | `in-progress` |
| `blocked` | open | `blocked` |
| `done` | closed | `completed` |

**Step 3.2: Create Issue per Task**

For each task in epic:

```bash
# Build issue body from task
BODY=$(cat .project/epics/{epic}/{task}.md | sed '1,/^---$/d' | sed '1,/^---$/d')

# Create GitHub issue
ISSUE_NUM=$(gh issue create \
  --title "Task #{task}: {title}" \
  --body "$BODY" \
  --label "epic:{epic-name}" \
  --label "task" \
  --label "{status-label}" \
  --assignee "{assignee}" \
  | grep -oP 'https://github.com/.*/issues/\K\d+')

echo "Created issue #$ISSUE_NUM for task {task}"
```

**Step 3.3: Update Task Frontmatter**

Add GitHub issue metadata to task file:

```yaml
---
title: Task title
status: open
github_issue: 42
github_url: https://github.com/owner/repo/issues/42
synced_at: 2025-12-01T16:00:00Z
---
```

### Phase 4: GitHub → Task

**Step 4.1: Pull Issue Updates**

For each task with `github_issue` field:

```bash
# Get issue data
gh issue view {issue-number} --json state,assignees,labels,updatedAt

# Compare timestamps
GITHUB_UPDATED=$(gh issue view {issue-number} --json updatedAt -q .updatedAt)
TASK_SYNCED=$(grep synced_at .project/epics/{epic}/{task}.md | cut -d: -f2)

# If GitHub newer, update task
```

**Step 4.2: Update Task Status**

```bash
# Get GitHub issue state
STATE=$(gh issue view {issue-number} --json state -q .state)

# Map to FlowForge status
if [ "$STATE" = "CLOSED" ]; then
  # Update task status to done
  sed -i 's/^status: .*/status: done/' .project/epics/{epic}/{task}.md
fi
```

### Phase 5: Conflict Resolution

**If both changed:**

```
⚠️ SYNC CONFLICT

Task #003: User Login Form
  Task status: in_progress (updated: 2025-12-01 10:00)
  GitHub #42: open (updated: 2025-12-01 11:00)

GitHub is newer. Apply GitHub state to task?
  1. Yes - update task to match GitHub
  2. No - update GitHub to match task
  3. Skip - leave both unchanged
  4. Manual - open both for review
```

### Phase 6: Summary Report

```
🔄 GITHUB SYNC COMPLETE

Epic: user-authentication
Repository: owner/repo

Created Issues:
  #42 - Task #001: Create login form
  #43 - Task #002: Add validation
  #44 - Task #003: Integrate with API

Updated Issues:
  #40 - Task #004: Status updated to in-progress

Updated Tasks:
  Task #005: Synced assignee from GitHub

Conflicts Resolved: 0

Next sync: Use "sync epic user-authentication" again
View issues: gh issue list --label "epic:user-authentication"
```

## Advanced Features

### Epic-Level Labels

Auto-apply epic label to all issues:
```bash
gh issue create --label "epic:{epic-name}"
```

### Milestone Integration

Link epic to GitHub milestone:
```bash
# Create milestone for epic
gh api repos/{owner}/{repo}/milestones -f title="{epic-name}" -f description="{epic description}"

# Add issues to milestone
gh issue edit {issue-number} --milestone "{epic-name}"
```

### Task Dependencies

Map `depends_on` to GitHub issue dependencies:
```yaml
depends_on:
  - 001
  - 002
```

Add to issue body:
```markdown
**Dependencies:**
- #40 (Task #001)
- #41 (Task #002)
```

### Acceptance Criteria as Checklist

Convert task acceptance criteria to GitHub checklist:

From task:
```markdown
## Acceptance Criteria
- Login form accepts email and password
- Form validates input
- Error messages display correctly
```

To GitHub issue body:
```markdown
## Acceptance Criteria
- [ ] Login form accepts email and password
- [ ] Form validates input
- [ ] Error messages display correctly
```

## Command Examples

```bash
# Sync specific epic
"sync user-auth epic to github"

# Sync all epics
"sync all epics to github"

# Pull updates from GitHub
"sync from github to tasks"

# Bidirectional sync
"sync epic with github"

# Dry run (show what would happen)
"preview github sync for user-auth"
```

## Error Handling

### GitHub CLI Not Installed
```
❌ GitHub CLI not found

Install gh CLI:
  macOS: brew install gh
  Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md
  Windows: See https://github.com/cli/cli/blob/trunk/docs/install_windows.md

Then authenticate:
  gh auth login
```

### Not Authenticated
```
❌ Not authenticated with GitHub

Run: gh auth login

Follow the prompts to authenticate with GitHub.
```

### No Epic Found
```
❌ Epic not found: user-auth

Available epics:
  - authentication
  - payment-processing
  - user-profile

Specify epic: "sync authentication epic"
```

### Rate Limit Hit
```
⚠️ GitHub API rate limit reached

Synced 42 of 100 tasks before hitting limit.
Rate limit resets at: 2025-12-01 17:30:00 UTC

Resume sync after rate limit resets.
```

## Best Practices

**DO:**
- ✅ Sync regularly to keep systems aligned
- ✅ Use epic labels to group related issues
- ✅ Include task numbers in issue titles
- ✅ Link back to tasks from GitHub issues
- ✅ Handle conflicts thoughtfully

**DON'T:**
- ❌ Sync too frequently (respect rate limits)
- ❌ Manual edit of `github_issue` field
- ❌ Delete GitHub issues without updating tasks
- ❌ Change issue titles without updating tasks

## Notes

- Uses `gh` CLI for all GitHub operations
- Respects GitHub API rate limits
- Maintains bidirectional links
- Preserves both systems as source of truth
- Conflict resolution requires user input
