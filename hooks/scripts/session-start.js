#!/usr/bin/env node
/**
 * session-start.js
 *
 * MindContext hook that runs when a Claude Code session starts.
 * Injects project context automatically so users don't need to "prime context" manually.
 *
 * Input: JSON via stdin with { session_id, cwd, hook_event_name, source }
 * Output: JSON with { hookSpecificOutput: { hookEventName, additionalContext } }
 */

const { readFocus, findProjectRoot } = require('./lib/focus-manager');
const fs = require('fs').promises;
const path = require('path');

/**
 * Read progress.md summary (first ~50 lines for recent context)
 */
async function readProgressSummary(projectRoot) {
  const progressPath = path.join(projectRoot, '.project', 'context', 'progress.md');
  try {
    const content = await fs.readFile(progressPath, 'utf-8');
    const lines = content.split('\n').slice(0, 50);
    return lines.join('\n');
  } catch {
    return null;
  }
}

/**
 * Build context string from focus.json
 */
function buildContextFromFocus(focus) {
  const lines = [];

  // Current focus
  if (focus.current_focus) {
    const cf = focus.current_focus;
    lines.push('## Current Focus');
    lines.push(`- **Type:** ${cf.type || 'unknown'}`);
    lines.push(`- **Name:** ${cf.name || 'none'}`);
    if (cf.epic) lines.push(`- **Epic:** ${cf.epic}`);
    if (cf.task) lines.push(`- **Task:** ${cf.task}`);
    if (cf.phase) lines.push(`- **Phase:** ${cf.phase}`);
    lines.push('');
  }

  // Key decisions
  if (focus.key_decisions && Object.keys(focus.key_decisions).length > 0) {
    lines.push('## Key Decisions');
    for (const [key, value] of Object.entries(focus.key_decisions)) {
      lines.push(`- **${key}:** ${value}`);
    }
    lines.push('');
  }

  // Next tasks
  if (focus.next_session_tasks && focus.next_session_tasks.length > 0) {
    lines.push('## Next Tasks');
    focus.next_session_tasks.forEach(task => {
      lines.push(`- ${task}`);
    });
    lines.push('');
  }

  // Session summary
  if (focus.session_summary) {
    const ss = focus.session_summary;
    lines.push('## Last Session');
    if (ss.date) lines.push(`**Date:** ${ss.date}`);
    if (ss.work_done && ss.work_done.length > 0) {
      lines.push('**Work Done:**');
      ss.work_done.forEach(item => lines.push(`- ${item}`));
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Main hook execution
 */
async function main() {
  // Read hook input from stdin
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  let hookInput;
  try {
    hookInput = JSON.parse(input);
  } catch {
    // No valid input, use current directory
    hookInput = { cwd: process.cwd() };
  }

  const cwd = hookInput.cwd || process.cwd();
  const projectRoot = findProjectRoot(cwd);

  // No MindContext project found
  if (!projectRoot) {
    // Exit silently - not a MindContext project
    process.exit(0);
  }

  // Read focus.json
  const focus = await readFocus(cwd);

  // No focus data
  if (!focus || Object.keys(focus).length === 0) {
    process.exit(0);
  }

  // Build context
  const contextParts = [];

  contextParts.push('# MindContext: Auto-Injected Project Context');
  contextParts.push('');
  contextParts.push(buildContextFromFocus(focus));

  // Add progress summary if available
  const progressSummary = await readProgressSummary(projectRoot);
  if (progressSummary) {
    contextParts.push('## Recent Progress');
    contextParts.push(progressSummary);
  }

  const additionalContext = contextParts.join('\n');

  // Output hook response
  const output = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: additionalContext
    }
  };

  console.log(JSON.stringify(output));
  process.exit(0);
}

main().catch(err => {
  console.error('MindContext session-start hook error:', err.message);
  process.exit(1);
});
