---
name: merge-workflow
description: Intelligent branch merge orchestration with conflict prediction, changelog management, and version tracking. Use when user says "merge X into Y", "combine branches", or needs merge guidance.
---

# Merge Workflow

Orchestrate complex branch merges with analysis, conflict resolution guidance, changelog consolidation, and proper version management.

## When to Use

- Merging feature branches into test branches
- Merging test branches into other test branches
- Combining features from multiple branches
- User says "merge X into Y" or "combine branches"
- Need guidance on merge strategy

## What It Does

Systematic merge workflow:
1. **Analyze** - Compare branches and predict conflicts
2. **Plan** - Determine merge strategy and version numbering
3. **Execute** - Guide merge and conflict resolution
4. **Consolidate** - Update changelogs properly
5. **Validate** - Ensure merge is clean and complete
6. **Finalize** - Commit and push with proper tracking

## Workflow Phases

### Phase 1: Branch Analysis

**Step 1.1: Identify Branches**
```bash
# Get current branch
git branch --show-current

# Ask user for target branch if not specified
Use AskUserQuestion: "Merge from [source] into [target]?"
```

**Step 1.2: Analyze Branch Differences**
```bash
# Show commit differences
git log --oneline [target]..[source]

# Show file differences
git diff --name-status [target]...[source]

# Check for potential conflicts
git merge-tree $(git merge-base [target] [source]) [target] [source]
```

**Step 1.3: Assess Merge Complexity**
```
Branch Comparison:
Source: [branch-name] ([commit-hash])
Target: [branch-name] ([commit-hash])

Commits to merge: [count]
Files changed: [count]
Potential conflicts: [count files]

Conflict Files:
- [file]: [type of conflict]
- [file]: [type of conflict]

Complexity: [Low/Medium/High]
```

### Phase 2: Merge Planning

**Step 2.1: Determine Merge Strategy**
```
Based on branches:

If both are test/* branches:
  → Combining test features
  → Needs changelog consolidation
  → Version increment required

If feat/* → test/*:
  → Adding feature to test branch
  → Inherit test branch version
  → Update changelog with new feature

If fix/* → test/*:
  → Bug fix addition
  → May need version bump
  → Add to changelog

Strategy: [description]
```

**Step 2.2: Version Planning**
Check current versions in both branches:
```bash
# Check CHANGELOG.md version in source
head -20 CHANGELOG.md

# Check CHANGELOG.md version in target (checkout or read)
git show [target]:CHANGELOG.md | head -20
```

**Version Decision:**
```
Source Version: [version]
Target Version: [version]

Merge Result Version: [new-version]
Rationale: [why this version]

Version History to Include:
- [version from source]
- [version from target]
- [new combined version]
```

**Step 2.3: Changelog Strategy**
```
Changelog Approach:

1. New version entry: [version number]
   - Summary: [Combined features]

2. Include source version: [version]
   - Features from [source-branch]

3. Retain target versions: [versions]
   - Existing history preserved

Example Structure:
## [New-Version] - [Date]
### Added
- Combined features from [source] and [target]

## [Source-Version] - [Date]
[Source changelog entries]

## [Target-Version] - [Date]
[Target changelog entries]
```

### Phase 3: Merge Execution

**Step 3.1: Pre-Merge Checks**
```bash
# Ensure clean working directory
git status

# Fetch latest
git fetch origin

# Ensure on target branch
git checkout [target-branch]
```

**Step 3.2: Execute Merge**
```bash
# Attempt merge
git merge [source-branch]
```

**Step 3.3: Handle Conflicts**
If conflicts occur:
```
❌ MERGE CONFLICTS DETECTED

Conflicted Files:
[List files with conflicts]

For each conflict:
1. Read file to understand conflict
2. Analyze both versions
3. Suggest resolution
4. Guide user through fix

Common conflict: CHANGELOG.md
→ Needs manual consolidation
→ Combine both version histories
→ Add new version entry at top
```

**Conflict Resolution Guidance:**
```
File: [conflicted-file]

Conflict Type: [both modified/rename/etc]

Source Changes:
[Summary of what source branch changed]

Target Changes:
[Summary of what target branch changed]

Recommended Resolution:
[Specific guidance on how to resolve]

Options:
1. Accept source version
2. Accept target version
3. Combine both (manual edit needed)
4. Show me the conflict (Read file)
```

### Phase 4: Changelog Consolidation

**Step 4.1: Read Both Changelogs**
```bash
# Read current changelog (may have conflict markers)
# Read both versions to understand what needs merging
```

**Step 4.2: Build Consolidated Changelog**
```
New Changelog Structure:

## [Unreleased]

## [New-Merged-Version] - [Today's Date]

### Added
- [Summary of combined features]
- Merged [source-branch-feature] with [target-branch-feature]

[If source had version entry]
## [Source-Version] - [Source-Date]
[All source version content]

[Target version history continues]
## [Target-Version] - [Target-Date]
[All target version content]

[Rest of changelog...]
```

**Step 4.3: Update Changelog**
Use Edit tool to update CHANGELOG.md with consolidated content

### Phase 5: Validation

**Step 5.1: Verify Merge State**
```bash
# Check for remaining conflicts
git status

# Should show:
# - All conflicts resolved
# - Changes staged for commit
# - Clean merge state
```

**Step 5.2: Review Changes**
```bash
# Show what's being merged
git diff --cached

# Count files changed
git diff --cached --name-only | wc -l
```

**Step 5.3: Build Check (If Applicable)**
```bash
# Run appropriate build command for project
# Ensure merge didn't break build
```

**Validation Checklist:**
```
[✓] All conflicts resolved
[✓] Changelog consolidated
[✓] Version number updated
[✓] Build succeeds
[✓] No unintended changes
[✓] Proper merge commit message ready
```

### Phase 6: Finalize

**Step 6.1: Create Merge Commit**
Generate proper merge commit message:
```
Merge branch [source] into [target]

Combines:
- [Source feature summary]
- [Target feature summary]

Version: [new-version]

Changes:
- [Key change 1]
- [Key change 2]
- [Changelog updated]
```

**Step 6.2: Commit Merge**
```bash
git commit -m "[merge message from above]"
```

**Step 6.3: Push to Remote**
```bash
# Push to remote tracking branch
git push origin HEAD
```

**Final Output:**
```
✅ MERGE COMPLETED

Source: [source-branch] ([version])
Target: [target-branch] ([version])
Result: [new-version]

Summary:
- Files merged: [count]
- Conflicts resolved: [count]
- Changelog: Updated with [version]
- Build: [✓ Success]

Commit: [hash]
Pushed: ✓ [remote-branch]

Branch State:
[target-branch] now contains all features from both branches

Next Steps:
- Test the merged features
- Continue development on [target-branch]
- Or merge into another branch if needed
```

## Merge Strategies

### Strategy 1: Test Branch + Test Branch
```
Example: test/0.69 → test/0.610

Analysis:
- Both have independent features
- Both have changelog entries
- Need version increment

Approach:
1. Merge commits
2. Resolve conflicts (likely CHANGELOG.md)
3. Create new version
4. Include both version histories
5. Document combined features

Version: Higher test version + 1
```

### Strategy 2: Feature Branch → Test Branch
```
Example: feat/new-feature → test/0.610

Analysis:
- Feature adds to test branch
- Test branch has version
- Feature may not have changelog

Approach:
1. Merge commits
2. Add feature to existing version or bump
3. Update changelog with feature details
4. Maintain test branch version lineage

Version: Test branch version (or +0.0.1)
```

### Strategy 3: Fix Branch → Test Branch
```
Example: fix/bug-fix → test/0.610

Analysis:
- Fix should be included
- Test branch has version
- Fix has specific changes

Approach:
1. Merge commits
2. Add fix to changelog
3. Version bump (patch level)
4. Document what was fixed

Version: +0.0.1 (patch)
```

## Conflict Resolution Patterns

### Common Conflict: CHANGELOG.md
```
Always conflicts when both branches have changelog entries

Resolution:
1. Keep structure: ## [Unreleased] at top
2. Add new merged version entry
3. Include both source and target versions
4. Preserve all history
5. Maintain reverse chronological order
```

### Common Conflict: Version Files
```
Files like AssemblyInfo, package.json, etc.

Resolution:
1. Use higher version number
2. Or increment based on merge significance
3. Document version choice in merge commit
```

### Common Conflict: Same Code Modified
```
Both branches modified same function/class

Resolution:
1. Analyze both changes
2. Understand intent of each
3. Combine functionality if compatible
4. Or choose one and document why
5. Test thoroughly after resolution
```

## Best Practices

**DO:**
- ✅ Analyze branches before merging
- ✅ Plan version numbers in advance
- ✅ Consolidate changelogs properly
- ✅ Test build after merge
- ✅ Include complete version history
- ✅ Document merge rationale
- ✅ Push to remote after merge

**DON'T:**
- ❌ Force push to shared branches
- ❌ Skip changelog updates
- ❌ Lose version history
- ❌ Merge without analyzing first
- ❌ Leave conflicts unresolved

## Error Handling

### Merge Aborted
```
If merge needs to be aborted:

git merge --abort

Reasons:
- Too many conflicts
- Wrong branches selected
- Need to prepare branches first

User can restart merge after preparation
```

### Build Fails After Merge
```
❌ Build Failed After Merge

Errors:
[Show build errors]

Likely Causes:
- Incompatible changes merged
- Missing dependencies
- API signature conflicts

Options:
1. Abort merge (git merge --abort)
2. Fix build errors now
3. Analyze conflicts deeper

Use AskUserQuestion for decision
```

## Response Templates

### Analysis Phase
```
🔍 MERGE ANALYSIS

Source: [branch] @ [commit]
Target: [branch] @ [commit]

Comparison:
- Commits to merge: [X]
- Files changed: [Y]
- Potential conflicts: [Z]

Conflict Preview:
- [file]: [conflict type]
- [file]: [conflict type]

Versions:
- Source: [version]
- Target: [version]
- Planned: [new-version]

Merge Complexity: [Low/Medium/High]
Strategy: [description]

Proceed with merge?
```

### Conflict Resolution
```
⚠️ MERGE CONFLICT

File: [filename]

Source ([branch]) changes:
[Summary or code snippet]

Target ([branch]) changes:
[Summary or code snippet]

Recommended Resolution:
[Specific guidance]

Options:
1. Accept source version
2. Accept target version
3. Combine both (I'll guide you)
4. Show me the full conflict

Your choice?
```

### Completion
```
✅ MERGE COMPLETED SUCCESSFULLY

Merged: [source] → [target]
Version: [new-version]

Summary:
- Files merged: [count]
- Conflicts resolved: [count]
- Changelog: Updated
- Build: ✓ Passed

Commit: [hash]
Remote: ✓ Pushed to origin/[branch]

Combined Features:
- [Feature from source]
- [Feature from target]

Branch [target] now ready for:
- Further development
- Testing
- Merging into other branches
```

## Notes

- Handles test/*, feat/*, fix/* branch patterns
- Enforces changelog discipline
- Ensures version traceability
- Validates merge doesn't break build
- Guides through complex conflicts
- Preserves complete version history
