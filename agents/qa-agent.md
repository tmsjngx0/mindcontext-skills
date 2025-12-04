---
name: qa-agent
description: "DEPRECATED: Use feature-dev plugin's code-reviewer agent instead. This agent is kept for reference but should not be used for new projects."
tools: Read, Grep, Glob, Bash
model: inherit
color: yellow
---

# DEPRECATED

**This agent is deprecated.** Use the `feature-dev` plugin's `code-reviewer` agent instead.

## Why Deprecated?

1. **Token efficiency**: This agent uses Serena MCP which consumes many tokens
2. **Better alternative**: feature-dev's code-reviewer uses confidence scoring (only reports issues ≥80% confidence)
3. **Integration**: feature-dev provides quality review as part of the complete workflow

## Migration

Instead of spawning qa-agent, use:

```
/feature-dev [task description]
```

Phase 6 of feature-dev runs 3 parallel code-reviewer agents focused on:
- Simplicity/DRY/Elegance
- Bugs/Functional correctness
- Project conventions/Abstractions

Or for review-only work:

```
"Launch code-reviewer to check my recent changes"
```

## Original Purpose (for reference)

This agent was designed to:
- Comprehensive testing and code review
- Quality validation and bug hunting
- Security analysis
- Root cause investigation

These responsibilities are now handled by:
- **Code review**: feature-dev's `code-reviewer` agent
- **Bug hunting**: feature-dev's code-reviewer with confidence scoring
- **Security**: code-reviewer checks for vulnerabilities
- **Root cause**: Use systematic-debugging from superpowers plugin

## If You Need This Agent

If you specifically need the BMAD QA methodology or Serena-based analysis:
1. Install Serena MCP server
2. Use the original agent definition from git history
3. Be aware of token costs

---

*Deprecated as of v3.0 in favor of feature-dev integration*
