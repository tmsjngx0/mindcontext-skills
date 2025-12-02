---
name: project-migrate
description: Migrate existing project management files to MindContext structure. Use when user says "migrate project", "convert to mindcontext", "cleanup pm structure", or has existing custom PM files.
---

# Project Migrate

Migrate existing project management structures to MindContext's standard layout, identifying duplicates and organizing context documents.

## When to Use

- Project has existing PM files (custom structure, scattered files)
- User says "migrate to mindcontext", "convert project", "cleanup structure"
- Existing `.claude/commands/` or `.claude/skills/` that overlap with MindContext
- Context files scattered in various locations
- Moving from another PM system

## What It Does

1. **Scan** - Analyze folder structure to find existing PM files
2. **Analyze** - Identify what exists and what overlaps with MindContext
3. **Plan** - Create migration plan with user approval
4. **Migrate** - Move/reorganize files to standard structure
5. **Cleanup** - Remove duplicates, archive old files
6. **Report** - Summary of changes made

## Workflow

### Phase 1: Discovery

**Step 1.1: Analyze Folder Structure**

Dynamically scan the project for PM-related directories and files:

```bash
# Find all directories that might contain PM files
find . -maxdepth 3 -type d \( \
  -name "*project*" -o \
  -name "*pm*" -o \
  -name "*epic*" -o \
  -name "*prd*" -o \
  -name "*task*" -o \
  -name "*context*" \
\) ! -path "./.git/*" ! -path "./node_modules/*" ! -path "./.project/*"

# Check for Claude customizations
find .claude -maxdepth 1 -type d 2>/dev/null

# Find scattered context files
find . -maxdepth 3 -type f \( \
  -name "*progress*.md" -o \
  -name "*context*.md" -o \
  -name "*overview*.md" -o \
  -name "*architecture*.md" -o \
  -name "project-*.md" \
\) ! -path "./.git/*" ! -path "./node_modules/*" ! -path "./.project/*"
```

**Step 1.2: Identify PM Files**

Search for PM-related files by pattern (not by hardcoded paths):

```bash
# Find PRD-like files
find . -type f \( \
  -name "*prd*.md" -o \
  -name "*requirements*.md" -o \
  -name "*specs*.md" \
\) ! -path "./.git/*" ! -path "./node_modules/*" ! -path "./.project/*"

# Find epic-like files
find . -type f \( \
  -name "*epic*.md" -o \
  -name "*feature*.md" \
\) ! -path "./.git/*" ! -path "./node_modules/*" ! -path "./.project/*"

# Find task-like files (numbered)
find . -type f -name "[0-9][0-9][0-9].md" ! -path "./.git/*" ! -path "./node_modules/*" ! -path "./.project/*"
```

**Step 1.3: Discovery Report**

Present findings dynamically based on what was found:

```
📂 DISCOVERY REPORT

Directories Found:
  [List all PM-related directories discovered]

Files Identified:
  PRDs: [count] files
  Epics: [count] files
  Tasks: [count] files
  Context docs: [count] files

Claude Customizations:
  .claude/commands/: [count] files
  .claude/skills/: [count] directories
  .claude/agents/: [count] files
```

### Phase 2: Analysis

**Step 2.1: Check for MindContext Overlaps**

Compare existing commands/skills with MindContext by analyzing file content and names:

```bash
# Check if existing commands/skills match MindContext functionality
for file in .claude/commands/*.md; do
  # Check if similar to MindContext commands
  # Compare description and triggers
done

for dir in .claude/skills/*/; do
  # Check if similar to MindContext skills
  # Compare functionality
done
```

**Step 2.2: Categorize Files Dynamically**

Based on discovered files, categorize into:

```
FILE ANALYSIS

To Migrate (move to .project/):
  [List all PRD files found] → .project/prds/
  [List all epic files found] → .project/epics/
  [List all context files found] → .project/context/

To Remove (replaced by MindContext):
  [List commands/skills that overlap with MindContext]

To Keep (not duplicated):
  [List commands/skills unique to this project]

To Archive (old/unused):
  [List directories that will be archived]
```

**Step 2.3: Identify Context Priority**

Order discovered context files by importance:
1. Files with "overview" in name
2. Files with "architecture" in name
3. Files with "progress" in name
4. Files with "tech" in name
5. Other context files

### Phase 3: Migration Plan

**Step 3.1: Present Plan to User**

Generate plan dynamically based on discovered files:

```
📋 MIGRATION PLAN

Phase A: Create Structure
  mkdir -p .project/{prds,epics,context}

Phase B: Migrate Content
  1. Move PRDs:
     [List each PRD file with source → destination]

  2. Move Epics:
     [List each epic directory with source → destination]

  3. Move Context:
     [List each context file with source → destination]

Phase C: Remove Superseded Directories
  Remove (MindContext plugin provides these):
    - .claude/agents/        (if overlaps with MindContext agents)
    - .claude/commands/      (if overlaps with MindContext commands)
    - .claude/skills/        (if overlaps with MindContext skills)
    - .claude/scripts/       (if no longer needed)

  Keep:
    - .claude/mcp.json       (Serena and other MCP servers)
    - .claude/hooks/         (Custom hooks)
    - .claude/prompts/       (Custom prompts)
    - .claude/rules/         (Custom rules)
    - CLAUDE.md              (project-specific instructions)

Phase D: Consolidate Context Files
  Move all discovered context files to .project/context/:
    [List all context files from various locations]

Phase E: Archive Old Structure
  Move to .archive/:
    [List all directories to be archived]

⚠️ CHANGES SUMMARY
  Files to move: [X]
  Directories to remove: [X]
  Context files to consolidate: [X]
  Files to archive: [X]
  Files to keep: [X]

Proceed with migration? (yes/no/modify)
```

**Step 3.2: Handle User Modifications**

If user wants changes:
- Allow selecting specific files to keep
- Allow skipping certain migrations
- Allow custom archive location

### Phase 4: Execute Migration

**Step 4.1: Create Target Structure**

```bash
# Create MindContext structure
mkdir -p .project/prds
mkdir -p .project/epics
mkdir -p .project/context

# Create archive for old files
mkdir -p .archive/$(date +%Y%m%d)-migration
```

**Step 4.2: Migrate Content Files**

Execute moves based on discovered files:

```bash
# Move PRDs (from wherever they were found)
for prd in [discovered PRD files]; do
  mv "$prd" .project/prds/
done

# Move epics (preserve directory structure if exists)
for epic in [discovered epic directories]; do
  cp -r "$epic" .project/epics/
done

# Move context files
for context in [discovered context files]; do
  mv "$context" .project/context/
done
```

**Step 4.3: Update Path References**

Search and update any references to old paths in migrated files:

```bash
# Find and update old path references
find .project -type f -name "*.md" -exec sed -i 's|old-path/|.project/|g' {} \;
```

**Step 4.4: Remove Superseded MindContext Directories**

When MindContext is installed as a plugin, local `.claude/` directories become superseded. Remove them to avoid conflicts:

```bash
# Verify MindContext is installed first
/plugin list | grep mindcontext-skills
```

If installed:
```bash
# Remove superseded directories (MindContext plugin handles these now)
rm -rf .claude/agents/     # Only if overlaps with MindContext agents
rm -rf .claude/commands/   # Only if overlaps with MindContext commands
rm -rf .claude/skills/     # Only if overlaps with MindContext skills
rm -rf .claude/scripts/    # Only if no longer needed

# Keep these (not superseded):
# - .claude/mcp.json        (MCP server config like Serena)
# - .claude/hooks/          (Custom hooks)
# - .claude/prompts/        (Custom prompts)
# - .claude/rules/          (Custom rules)
# - CLAUDE.md               (Project-specific instructions)
```

If not installed, warn user:
```
⚠️  MindContext plugin not detected

These directories will be removed based on overlap analysis:
  [List directories to be removed]

To avoid losing functionality, install MindContext first:
  /plugin marketplace add tmsjngx0/mindcontext-skills
  /plugin install mindcontext-skills@tmsjngx0

Then run migration again.

Proceed anyway? (yes/no)
```

**Step 4.5: Consolidate Context Files to .project/**

Move all discovered context files:

```bash
# Move context files found during discovery
for file in [discovered context files]; do
  basename=$(basename "$file")
  # Rename if needed for clarity
  case "$basename" in
    *overview*) target="project-overview.md" ;;
    *tech*|*architecture*) target="tech-context.md" ;;
    *progress*) target="progress.md" ;;
    *) target="$basename" ;;
  esac
  mv "$file" ".project/context/$target"
done
```

**Context File Priority:**

After moving, organize by priority in `.project/context/`:
1. `project-overview.md` - High-level project summary
2. `tech-context.md` - Technical stack and architecture
3. `progress.md` - Current state and recent work
4. Other context files

**Step 4.6: Archive Old Structure**

```bash
# Archive discovered PM directories
for dir in [discovered PM directories]; do
  mv "$dir" .archive/$(date +%Y%m%d)-migration/
done
```

### Phase 5: Verification

**Step 5.1: Verify New Structure**

```bash
# Check new structure exists
ls -la .project/
ls -la .project/prds/
ls -la .project/epics/
ls -la .project/context/
```

**Step 5.2: Verify No Broken References**

Search for old paths that need updating:
```bash
# Search for references to archived paths
grep -r "[archived-paths]" . --include="*.md" ! -path "./.archive/*" 2>/dev/null
```

**Step 5.3: Verification Checklist**

```
Verification:
  [✓] .project/ structure created
  [✓] PRDs migrated ([X] files)
  [✓] Epics migrated ([X] directories)
  [✓] Context migrated ([X] files)
  [✓] Duplicates removed ([X] files)
  [✓] Old structure archived
  [✓] No broken references
```

### Phase 6: Report

**Final Migration Report:**

```
✅ MIGRATION COMPLETE

Summary:
  ├── PRDs: [X] migrated to .project/prds/
  ├── Epics: [X] migrated to .project/epics/
  ├── Context: [X] consolidated to .project/context/
  ├── Removed: [list of removed directories]
  └── Archived: [list of archived directories] → .archive/[date]-migration/

New Structure:
  .project/
  ├── prds/
  │   └── [X] files
  ├── epics/
  │   └── [X] directories
  └── context/
      ├── project-overview.md
      ├── tech-context.md
      ├── progress.md
      └── [X] more files

  .claude/ (cleaned up)
  ├── mcp.json              (kept - Serena config)
  ├── hooks/                (kept - custom hooks)
  ├── prompts/              (kept - custom prompts)
  ├── rules/                (kept - custom rules)
  └── CLAUDE.md (moved to root if applicable)

Removed Superseded Directories:
  [List directories removed because MindContext provides them]

Archive Location:
  .archive/[date]-migration/
  [List all archived directories and files]

MindContext Skills Now Active:
  ✓ prd-create
  ✓ epic-planning
  ✓ task-workflow
  ✓ start-of-day
  ✓ [all skills]

Next Steps:
  1. Review migrated files in .project/
  2. Update any custom references to old paths
  3. Test MindContext skills: "create prd for test"
  4. Delete .archive/ when confident migration is complete
```

## Rollback

If migration needs to be undone:

```bash
# Restore from archive
cp -r .archive/[date]-migration/* ./

# Remove new structure
rm -rf .project/

# Note: Removed commands/skills need manual restoration
# Check git history or restore from backup
```

## Migration Strategy

This skill uses **dynamic discovery** instead of hardcoded paths:

1. **Scan project structure** - Find PM-related directories and files
2. **Analyze by pattern** - Identify PRDs, epics, tasks, context by filename patterns
3. **Compare functionality** - Check if existing commands/skills overlap with MindContext
4. **Generate custom plan** - Create migration plan specific to discovered structure
5. **Execute migration** - Move files from discovered locations to .project/
6. **Archive intelligently** - Only archive what was actually found

This approach works with **any custom PM structure**, not just specific directory names.

## Notes

- Always creates archive before removing files
- Preserves directory structures where appropriate
- Updates path references in migrated files
- Keeps non-duplicate custom commands/skills
- Provides rollback instructions
- User approval required before destructive changes
- Dynamically adapts to discovered project structure
