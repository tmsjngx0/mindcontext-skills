---
name: serena-setup
description: Install and configure Serena MCP server for intelligent code analysis. Use when user says "setup serena", "install serena", "configure serena", or "enable code analysis".
---

# Serena Setup

Install and configure the Serena MCP server for intelligent code analysis in the current project.

## When to Use

- Setting up a new project for development
- User says "setup serena", "install serena", "configure serena"
- User wants "code analysis", "symbol search", "intelligent editing"
- MindContext agents need Serena tools for efficient operation

## What is Serena?

Serena is an MCP (Model Context Protocol) server that provides intelligent code analysis tools:

| Tool | Purpose |
|------|---------|
| `get_symbols_overview` | Get file/directory structure without reading full content |
| `find_symbol` | Find classes, methods, functions by name |
| `find_referencing_symbols` | Trace where code is used |
| `search_for_pattern` | Regex search across codebase |
| `replace_symbol_body` | Replace entire method/class body |
| `insert_after_symbol` | Add code after existing symbol |
| `insert_before_symbol` | Add code before existing symbol |
| `rename_symbol` | Rename across codebase |

## Prerequisites

- **uv package manager** (required) - Install from https://docs.astral.sh/uv/getting-started/installation/
- Claude Code 1.0.52 or later
- Project with supported language (30+ languages including Python, TypeScript, JavaScript, Rust, Go, Java, etc.)

## Workflow

### Phase 1: Check Prerequisites

```bash
# Check if uv is installed
uv --version

# Check if uvx is available
uvx --version

# Check Claude Code version (should be >= 1.0.52)
claude --version

# Check if project has supported files
ls -la src/ lib/ 2>/dev/null | head -10
```

### Phase 2: Test Serena

**Quick test to verify Serena works:**

```bash
# Test launching Serena (shows help)
uvx --from git+https://github.com/oraios/serena serena start-mcp-server --help
```

**Expected output:**
```
usage: serena start-mcp-server [-h] [--transport {stdio,sse}]
                               [--context {ide-assistant,default}]
                               [--project PROJECT]

Start the MCP server for code analysis...
```

### Phase 3: Configure for Claude Code

**Option A: Using Claude Code CLI (Recommended)**

```bash
# Auto-configure Serena in Claude Code
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena \
  serena start-mcp-server --context ide-assistant --project "$(pwd)"
```

**Important:** Must use `--context ide-assistant` to prevent tool duplication.

**Option B: Manual Configuration**

**For Claude Code (project-level):** `.claude/mcp.json`

```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena",
        "start-mcp-server",
        "--context",
        "ide-assistant",
        "--project",
        "."
      ]
    }
  }
}
```

**For Claude Desktop (global):** `~/.config/claude/claude_desktop_config.json` (Linux/Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

```json
{
  "mcpServers": {
    "serena": {
      "command": "/absolute/path/to/uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena",
        "start-mcp-server"
      ]
    }
  }
}
```

**Windows Note:** Escape backslashes as `\\` in paths (e.g., `C:\\Users\\...\\uvx.exe`)

### Phase 4: Alternative Installation Methods

**Option C: Local Development Install**

```bash
# Clone repository
git clone https://github.com/oraios/serena.git
cd serena

# Install with uv
uv sync

# Configure with absolute paths
```

**.claude/mcp.json for local install:**
```json
{
  "mcpServers": {
    "serena": {
      "command": "/absolute/path/to/uv",
      "args": [
        "run",
        "--directory",
        "/absolute/path/to/serena",
        "serena",
        "start-mcp-server",
        "--context",
        "ide-assistant",
        "--project",
        "."
      ]
    }
  }
}
```

**Option D: Docker Deployment**

```bash
# Pull Serena Docker image
docker pull ghcr.io/oraios/serena:latest
```

**.claude/mcp.json for Docker:**
```json
{
  "mcpServers": {
    "serena": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "--network",
        "host",
        "-v",
        "/absolute/path/to/project:/workspaces/project",
        "ghcr.io/oraios/serena:latest",
        "serena",
        "start-mcp-server",
        "--transport",
        "stdio"
      ]
    }
  }
}
```

### Phase 5: Verify Installation

**Restart Claude Code:**
```bash
# Restart Claude Code to load MCP server
# (Close and reopen application or reload window)
```

**Test Serena tools:**

Ask Claude Code to test Serena:
```
"Can you use Serena to show me the symbols in src/?"
```

Or directly test (in Claude Code session):
```
Use mcp__serena__get_symbols_overview to analyze the src/ directory
```

**Expected behavior:**
- Claude Code recognizes Serena tools (prefixed with `mcp__serena__`)
- Symbols overview shows classes, functions, methods without reading full files
- No errors about missing MCP server

### Phase 6: Add to .gitignore (Optional)

```bash
# Serena may create cache files
echo ".serena/" >> .gitignore
echo ".serena-cache/" >> .gitignore
```

## Configuration Options

### Contexts

Serena supports two contexts:

| Context | Use Case | Tools Available |
|---------|----------|-----------------|
| `ide-assistant` | IDE integration (Claude Code) | Minimal tool set, prevents duplication |
| `default` | Terminal clients | Full tool set |

**Always use `--context ide-assistant` for Claude Code.**

### Project Scope

```bash
# Current directory
--project "."

# Specific path
--project "/path/to/project"

# Use PWD (bash)
--project "$(pwd)"
```

### Transport

```bash
# Standard I/O (default, recommended)
--transport stdio

# Server-Sent Events
--transport sse
```

## Supported Languages

Serena supports **30+ programming languages** including:

| Language | Extensions | Notes |
|----------|-----------|-------|
| TypeScript | `.ts`, `.tsx` | Full support |
| JavaScript | `.js`, `.jsx` | Full support |
| Python | `.py` | Full support |
| Rust | `.rs` | Full support |
| Go | `.go` | Full support |
| Java | `.java` | Full support |
| C# | `.cs` | Full support |
| C/C++ | `.c`, `.cpp`, `.h`, `.hpp` | Full support |
| Ruby | `.rb` | Full support |
| PHP | `.php` | Full support |
| Kotlin | `.kt` | Full support |
| Swift | `.swift` | Full support |
| And 18+ more... | | See docs for full list |

**Note:** Some languages may require additional dependencies. Check Serena documentation for specifics.

## Troubleshooting

### uv Not Found

```
Error: uv: command not found

Solution:
1. Install uv from https://docs.astral.sh/uv/getting-started/installation/
2. On Linux/Mac: curl -LsSf https://astral.sh/uv/install.sh | sh
3. On Windows: powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
4. Restart terminal
5. Verify: uv --version
```

### MCP Server Not Starting

```
Error: MCP server failed to start

Solutions:
1. Check Claude Code version (must be >= 1.0.52)
2. Verify .claude/mcp.json syntax (use JSON validator)
3. Use absolute paths for command (find with: which uvx)
4. Check logs in Claude Code: View → Output → MCP
5. Restart Claude Code completely
```

### Serena Tools Not Available

```
Issue: Claude doesn't recognize mcp__serena__ tools

Solutions:
1. Verify context is set to ide-assistant
2. Restart Claude Code (full restart, not reload)
3. Check MCP server is running: claude mcp list
4. Test connection: claude mcp test serena
5. Check for errors in output panel
```

### Performance Issues

```
Serena is slow on large codebase

Solutions:
1. Limit project scope with --project to specific subdirectory
2. Exclude large directories in .gitignore (node_modules, dist, build)
3. Use specific paths instead of "." for queries
4. Consider Docker deployment for better isolation
```

### Windows Path Issues

```
Error: Invalid path in configuration

Solution:
1. Use double backslashes: C:\\Users\\...\\uvx.exe
2. Or use forward slashes: C:/Users/.../uvx.exe
3. Always use absolute paths, not relative
4. Find uvx path: where.exe uvx
```

## Integration with MindContext

Once Serena is configured, MindContext agents automatically use Serena tools:

| Agent | Serena Tools Used |
|-------|-------------------|
| `architect-agent` | `get_symbols_overview`, `find_symbol`, `find_referencing_symbols`, `search_for_pattern` |
| `developer-agent` | All tools including `replace_symbol_body`, `insert_*`, `rename_symbol` |
| `qa-agent` | `get_symbols_overview`, `find_symbol`, `find_referencing_symbols`, `search_for_pattern` |

**Example: Architect using Serena**
```
"create epic user-auth"
  → architect-agent spawned
  → Uses mcp__serena__get_symbols_overview to understand existing services
  → Uses mcp__serena__find_symbol to examine auth patterns
  → Creates epic with architecture decisions based on current code
```

**Example: Developer using Serena**
```
"implement user login method"
  → developer-agent spawned
  → Uses mcp__serena__find_symbol to locate UserService
  → Uses mcp__serena__insert_after_symbol to add new method
  → Preserves existing code structure
```

## Output Format

### Success (CLI Method)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERENA SETUP COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Method: Claude Code CLI auto-configuration
Command: claude mcp add serena -- uvx --from git+https://github.com/oraios/serena ...

Serena MCP server configured successfully!

Next steps:
1. Restart Claude Code to load MCP server
2. Test with: "Use Serena to analyze src/"

MindContext agents now have enhanced code analysis!
```

### Success (Manual Method)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERENA SETUP COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Installation: uvx (GitHub)
Config: .claude/mcp.json (project-level)
Context: ide-assistant

Configuration created:
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/oraios/serena", ...]
    }
  }
}

Next steps:
1. Restart Claude Code
2. Test: "Show me symbols in src/ using Serena"

Available Serena Tools:
  mcp__serena__get_symbols_overview
  mcp__serena__find_symbol
  mcp__serena__find_referencing_symbols
  mcp__serena__search_for_pattern
  mcp__serena__replace_symbol_body
  mcp__serena__insert_after_symbol
  mcp__serena__insert_before_symbol
  mcp__serena__rename_symbol
```

### Already Configured

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERENA ALREADY CONFIGURED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Config found: .claude/mcp.json
Status: Active (verified with claude mcp list)

To reconfigure:
  claude mcp remove serena
  Then run setup again

To test: "Use Serena to analyze the codebase"
```

### Error

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERENA SETUP FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Error: uv package manager not found

Install uv first:
  Linux/Mac: curl -LsSf https://astral.sh/uv/install.sh | sh
  Windows: powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

Then run this skill again.

Manual setup documentation:
  https://oraios.github.io/serena/
```

## Best Practices

### For Teams

1. **Use project-level config:** `.claude/mcp.json` in repository
2. **Document in README:** Add Serena setup to onboarding docs
3. **Commit config:** Check in `.claude/mcp.json` for consistency
4. **Add to gitignore:** `.serena/` and `.serena-cache/`

### For Performance

1. **Use specific paths:** `src/` instead of `.` for large projects
2. **Leverage caching:** Serena caches symbol information
3. **Scope projects:** Use `--project` to limit scope
4. **Exclude build artifacts:** Let Serena skip node_modules, dist, etc.

### For Development

1. **Test frequently:** Verify Serena tools work after config changes
2. **Check MCP logs:** View → Output → MCP in Claude Code
3. **Update regularly:** `uvx` always pulls latest from GitHub
4. **Use Docker for isolation:** Containers prevent environment issues

## Important Notes

- **Serena excels with large codebases** - minimal value for small projects
- **All analysis is local** - no data leaves your machine
- **Requires uv package manager** - not Node.js/npm
- **Must use `ide-assistant` context** - prevents tool duplication in Claude Code
- **Restart Claude Code** - required after configuration changes
- **Project-based workflow recommended** - better team consistency
- **30+ language support** - some may need extra dependencies
- **Source:** https://github.com/oraios/serena (oraios fork, not anthropics/serena)

## Quick Reference

**Install uv:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Test Serena:**
```bash
uvx --from git+https://github.com/oraios/serena serena start-mcp-server --help
```

**Auto-configure:**
```bash
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena \
  serena start-mcp-server --context ide-assistant --project "$(pwd)"
```

**Verify:**
```bash
claude mcp list
```

**Test in Claude Code:**
```
"Use Serena to show symbols in src/"
```
