---
name: project-reinit
description: Reference documentation for reinit flow. Called automatically from project-init when existing MindContext project detected. Triggers on "reinit project", "update templates", "refresh mindcontext".
---

# Project Reinit

**Note:** This flow is automatically triggered by `project-init` when an existing MindContext project is detected. You can also trigger it directly with "reinit project".

Update an existing MindContext project with the latest templates, CLAUDE.md sections, and structure recommendations without losing customizations.

## When to Use

- Automatically called when running `project-init` on existing project
- MindContext skills updated with new CLAUDE.md template sections
- New config options available
- Structure recommendations changed
- User says "reinit project", "update templates", "refresh mindcontext"

## What This Does vs. project-init

| Aspect | project-init | project-reinit |
|--------|--------------|----------------|
| Target | New/empty projects | Existing projects |
| CLAUDE.md | Creates from template | Merges new sections |
| design.md | Creates via brainstorming | Preserves existing |
| Customizations | N/A | Preserved |
| Destructive | No (won't overwrite) | No (merge only) |

## Workflow

### Phase 1: Detect Current State

```bash
# Check for MindContext structure
ls -la .project/ 2>/dev/null
cat CLAUDE.md 2>/dev/null | head -20

# Get current versions/checksums
wc -l CLAUDE.md .project/config.json 2>/dev/null
```

**Report:**
```
PROJECT REINIT CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: [name]
MindContext: [yes/partial/no]

Current Files:
  CLAUDE.md         [exists/missing] ({n} lines)
  .project/         [exists/missing]
  config.json       [exists/missing]

Template Version: [from mindcontext-skills]
```

### Phase 2: Identify Updates Needed

Compare current CLAUDE.md sections against template:

**Template sections to check:**
1. `## Project Overview` - User content, preserve
2. `## CRITICAL RULES` - Template content, may need update
3. `## MindContext Structure` - Template content, may need update
4. `## Context Folder Rules` - NEW section, add if missing
5. `## Workflow - USE MINDCONTEXT SKILLS` - Template content, may need update
6. `## Shadow Engineering` - Template content, may need update
7. `## Testing` - User content, preserve
8. `## Code Style` - User content, preserve

**Detection logic:**
```bash
# Check for missing sections
grep -q "## Context Folder Rules" CLAUDE.md || echo "MISSING: Context Folder Rules"
grep -q "## MindContext Structure" CLAUDE.md || echo "MISSING: MindContext Structure"
grep -q "archive/" CLAUDE.md || echo "OUTDATED: Structure missing archive/"
```

### Phase 3: Show Update Plan

```
UPDATES AVAILABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLAUDE.md:
  [+] ADD: "Context Folder Rules" section (new)
  [~] UPDATE: "MindContext Structure" (archive/ folder added)
  [=] KEEP: "Project Overview" (user content)
  [=] KEEP: "Testing" (user content)

config.json:
  [=] No changes needed

.project/ structure:
  [+] ADD: context/archive/ directory

Apply these updates? (y/n/preview)
```

### Phase 4: Apply Updates (Merge Strategy)

**For CLAUDE.md:**

1. **Read existing file** into sections (split by `## `)
2. **Identify user sections** (Project Overview, Testing, Code Style)
3. **Identify template sections** that need updating
4. **Merge:**
   - Keep user sections verbatim
   - Replace outdated template sections
   - Add missing template sections at appropriate location

**Section merge order:**
```markdown
# CLAUDE.md

## Project Overview          ← USER (preserve)
## Project Design            ← USER (preserve)
## CRITICAL RULES            ← TEMPLATE (update)
## MindContext Structure     ← TEMPLATE (update)
## Context Folder Rules      ← TEMPLATE (add if missing)
## Workflow                  ← TEMPLATE (update)
## Shadow Engineering        ← TEMPLATE (update if present)
## Testing                   ← USER (preserve)
## Code Style                ← USER (preserve)
```

**For missing directories:**
```bash
mkdir -p .project/context/archive/sessions
mkdir -p .project/context/archive/epics
```

### Phase 5: Confirm Changes

```
REINIT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updated:
  ✓ CLAUDE.md - Added "Context Folder Rules" section
  ✓ CLAUDE.md - Updated "MindContext Structure"
  ✓ Created .project/context/archive/

Preserved:
  ✓ Project Overview (your content)
  ✓ Testing section (your content)
  ✓ All .project/ files unchanged

Backup: .claude-backup/CLAUDE.md.bak (if needed)
```

---

## Modes

### Full Reinit (default)
Updates all template sections:
```
reinit project
```

### CLAUDE.md Only
Just update CLAUDE.md template sections:
```
reinit claude.md
update claude template
```

### Preview Only
Show what would change without applying:
```
reinit project --preview
```

### Force (no prompts)
Apply all updates without confirmation:
```
reinit project --force
```

---

## Section Classification

**Template sections (can be updated):**
- `## CRITICAL RULES`
- `## MindContext Structure`
- `## Context Folder Rules`
- `## Workflow - USE MINDCONTEXT SKILLS`
- `## Shadow Engineering - File Locations`

**User sections (always preserved):**
- `## Project Overview`
- `## Project Design`
- `## Testing`
- `## Code Style`
- Any custom sections added by user

**Detection heuristic:**
- If section contains `[Filled from` or `[Detect or ask` → User section
- If section contains `IMPORTANT:` or `NEVER` or `CRITICAL` → Template section
- If section matches known template patterns → Template section
- Otherwise → Assume user section, preserve

---

## Handling Edge Cases

### No CLAUDE.md exists
```
No CLAUDE.md found. Options:
1. Create from template (run project-init)
2. Create minimal CLAUDE.md with just template sections
3. Skip CLAUDE.md update
```

### Heavily customized CLAUDE.md
If structure is unrecognizable:
```
CLAUDE.md has custom structure.

Options:
1. Append new sections at end
2. Show sections to add (manual merge)
3. Skip CLAUDE.md (just update directories)
```

### Conflicting content
If user modified a template section:
```
"MindContext Structure" section appears customized.

Options:
1. Replace with latest template
2. Keep your version
3. Show diff
```

---

## Template Sections (Current)

These are the template sections from project-init that reinit will sync:

### Context Folder Rules (NEW)
```markdown
## Context Folder Rules

**The context/ folder should ONLY contain:**
| File | Purpose |
|------|---------|
| `focus.json` | Current work focus (machine-readable) |
| `progress.md` | Progress narrative (human-readable) |
| `archive/` | Historical content (created by compact-context) |

**DO NOT create additional files in context/**

| Content Type | Save To | NOT |
|--------------|---------|-----|
| Research findings | `.project/spikes/{topic}.md` | `context/` |
| Technical plans | `.project/plans/{name}.md` | `context/` |
| Session notes | Append to `progress.md` | New file in context/ |
| Architecture docs | `.project/plans/{name}.md` | `context/` |

**Why:** context/ is for state tracking only. Clutter breaks automation.
```

### MindContext Structure (UPDATED)
```markdown
## MindContext Structure
\`\`\`
.project/
├── design.md
├── config.json
├── prds/
├── epics/
├── plans/
├── spikes/
└── context/
    ├── progress.md
    ├── focus.json
    └── archive/           ← NEW
        ├── sessions/
        └── epics/
\`\`\`
```

---

## Examples

### Basic reinit
```
User: reinit project

Claude: Checking project structure...

PROJECT REINIT CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: my-app
MindContext: yes

UPDATES AVAILABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLAUDE.md:
  [+] ADD: "Context Folder Rules" section
  [~] UPDATE: "MindContext Structure" (archive/ added)

.project/:
  [+] ADD: context/archive/ directories

Apply updates? (y/n)

User: y

Claude:
REINIT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ CLAUDE.md updated (2 sections)
✓ Created .project/context/archive/

Your customizations preserved.
```

### Preview mode
```
User: reinit project --preview

Claude:
PREVIEW - No changes will be made

Would update CLAUDE.md:
  + Add "Context Folder Rules" after "MindContext Structure"
  ~ Update "MindContext Structure" to include archive/

Would create:
  + .project/context/archive/sessions/
  + .project/context/archive/epics/

Run without --preview to apply.
```

---

## Notes

- Always creates backup before modifying CLAUDE.md
- Preserves all user content and customizations
- Safe to run multiple times (idempotent)
- Works with both greenfield and brownfield projects
- Pairs with project-init for fresh setups
