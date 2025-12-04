---
name: architect-agent
description: "DEPRECATED: Use feature-dev plugin's code-architect agent instead. This agent is kept for reference but should not be used for new projects."
tools: Read, Write, Glob, Grep, Bash
model: inherit
color: purple
---

# DEPRECATED

**This agent is deprecated.** Use the `feature-dev` plugin's `code-architect` agent instead.

## Why Deprecated?

1. **Token efficiency**: This agent uses Serena MCP which consumes many tokens
2. **Better alternative**: feature-dev's code-architect is optimized for codebase exploration
3. **Integration**: feature-dev provides a complete workflow (explore → architect → implement → review)

## Migration

Instead of spawning architect-agent, use:

```
/feature-dev [task description]
```

Or for architecture-only work:

```
"Launch code-architect to design [feature]"
```

## Original Purpose (for reference)

This agent was designed to:
- Transform PRDs into technical epics
- Make architecture decisions
- Design system components
- Plan implementation phases

These responsibilities are now handled by:
- **PRD → Epic**: `epic-create` skill (still valid)
- **Architecture design**: feature-dev's `code-architect` agent
- **Implementation planning**: feature-dev's `writing-plans` workflow

## If You Need This Agent

If you specifically need the BMAD methodology or Serena-based analysis:
1. Install Serena MCP server
2. Use the original agent definition from git history
3. Be aware of token costs

---

*Deprecated as of v3.0 in favor of feature-dev integration*
