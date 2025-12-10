---
name: plugin-update
description: Update MindContext plugin to latest version. Use when user says "update plugin", "update mindcontext", "upgrade plugin", or "get latest skills".
---

# Plugin Update

Update the MindContext skills plugin to the latest version from the marketplace.

## When to Use

- User says "update plugin", "update mindcontext", "upgrade plugin"
- User says "get latest skills", "refresh plugin"
- After seeing a new release announcement
- Periodically to stay current

## Workflow

```
plugin-update
    │
    ├── 1. Check current version
    ├── 2. Check for updates
    ├── 3. Show changelog (if available)
    ├── 4. Confirm update
    └── 5. Update plugin
```

---

## Instructions

### 1. Check Current Installation

Find where MindContext is installed:

```
Check ~/.claude/plugins/ for mindcontext-skills
- Note current version from plugin.json
- Note installation source (marketplace or local)
```

### 2. Check for Updates

**For marketplace installation:**
```
The plugin manager handles updates. Use:
/plugin update mindcontext-skills@{marketplace}
```

**For local development installation:**
```
cd to plugin directory
git fetch origin
git log HEAD..origin/main --oneline
```

### 3. Show What's New

If updates are available, show summary:

```
MINDCONTEXT UPDATE AVAILABLE

Current: v{current}
Latest:  v{latest}

What's New:
- [feature 1]
- [feature 2]
- [fix 1]

Full changelog: {github-url}/CHANGELOG.md
```

### 4. Confirm and Update

```
Update MindContext to v{latest}?

1. Yes, update now
2. Show full changelog first
3. Skip for now
```

### 5. Execute Update

**Marketplace installation:**
```bash
# Plugin manager command
/plugin update mindcontext-skills@{marketplace}
```

**Local installation:**
```bash
cd ~/.claude/plugins/mindcontext-skills
git pull origin main
```

### 6. Verify Update

After update:
```
Check new version in plugin.json
Confirm skills are accessible
```

---

## Output

```
MINDCONTEXT UPDATED

Version: v{old} → v{new}

New Skills:
- {skill-name} - {description}

Updated Skills:
- {skill-name} - {what changed}

Restart Claude Code to use new features.
```

---

## Checking Version Without Updating

If user just wants to check version:

```
MINDCONTEXT STATUS

Version: v{version}
Source: {marketplace|local}
Location: {path}

Skills: {count} installed
Agents: {count} available
Commands: {count} available

Latest Release: v{latest} ({date})
Status: {Up to date | Update available}
```

---

## Troubleshooting

### Plugin not found
```
MindContext not installed. Install with:
/plugin marketplace add tmsjngx0/mindcontext-skills
/plugin install mindcontext-skills@tmsjngx0
```

### Update failed
```
Update failed. Try manual update:
1. /plugin uninstall mindcontext-skills@{source}
2. /plugin install mindcontext-skills@{source}

Or check: {github-issues-url}
```

### Local changes conflict
```
You have local modifications to MindContext.
Options:
1. Stash changes and update
2. Keep local version
3. Show diff
```

---

## Integration Notes

### With project-init
- After plugin update, new project-init features available immediately
- Existing projects don't need migration

### With start-of-day
- start-of-day can mention if plugin update is available
- "MindContext v{new} available - say 'update plugin' to upgrade"

---

## Examples

### Quick Update
```
User: update plugin

Claude: Checking MindContext version...

Current: v1.1.0
Latest:  v1.2.0

What's New:
- task-complete skill added
- task-start TDD integration
- project-init research phase

Update now? (y/n)

User: y

Claude: Updating MindContext...
Done! v1.1.0 → v1.2.0

Restart Claude Code to use new features.
```

### Check Version Only
```
User: what version of mindcontext?

Claude: MINDCONTEXT STATUS

Version: v1.1.0
Source: tmsjngx0 marketplace
Location: ~/.claude/plugins/mindcontext-skills

Skills: 24 installed
Agents: 3 available
Commands: 12 available

Status: Up to date
```
