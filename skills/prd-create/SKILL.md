---
name: prd-create
description: Create comprehensive product requirements document using strategic questioning. Use when user says "create prd", "new prd", "write requirements", or "document feature".
---

# PRD Create

Create a Product Requirements Document through guided discovery.

## When to Use

- Starting new feature
- Documenting requirements
- User says "create prd for X", "new prd X"

## Workflow

### 1. Validate Input

Extract feature name from user request. Must be kebab-case.

```bash
FEATURE="$1"  # e.g., "user-authentication"

# Validate format
if ! echo "$FEATURE" | grep -qE '^[a-z][a-z0-9-]*$'; then
    echo "Feature name must be kebab-case (e.g., user-auth)"
    exit 1
fi

# Check exists
if [ -f ".project/prds/$FEATURE.md" ]; then
    echo "PRD already exists. Overwrite? (yes/no)"
fi
```

### 2. Strategic Discovery

Ask user these questions:

**Problem Space:**
- What problem are we solving?
- Who experiences this problem?
- What's the cost of not solving it?

**Users:**
- Who are the target users?
- What's their current workflow?
- What have they tried?

**Solution:**
- What does success look like?
- How will we measure it?
- What are the constraints?

### 3. Create PRD

```bash
cat > .project/prds/$FEATURE.md << EOF
---
name: $FEATURE
status: backlog
created: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
---

# PRD: $FEATURE

## Executive Summary
[Brief overview]

## Problem Statement
[What problem, why important]

## User Stories
[Who, what they need, why]

## Requirements

### Functional
- [Core features]

### Non-Functional
- [Performance, security, etc.]

## Success Criteria
- [Measurable outcomes]

## Out of Scope
- [What we're NOT building]

## Dependencies
- [External/internal deps]
EOF
```

### 4. Confirm

```
PRD CREATED: .project/prds/$FEATURE.md

Next: "Convert $FEATURE PRD to epic"
```

## Notes

- Uses strategic questioning
- Creates in `.project/prds/`
- Frontmatter with status tracking
- Suggests next step (epic creation)
