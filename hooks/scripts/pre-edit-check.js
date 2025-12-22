#!/usr/bin/env node

/**
 * pre-edit-check.js
 *
 * PreToolUse hook for workflow enforcement.
 * Checks if a plan exists before allowing Edit/Write operations.
 *
 * Enforcement levels (from focus.json or config.json):
 *   - "off": No enforcement, always allow
 *   - "remind": Soft reminder only (default - handled by SessionStart)
 *   - "strict": Block edits without a plan
 *
 * Exit codes:
 *   - 0: Allow the operation
 *   - 2: Block the operation (with feedback to Claude)
 */

const fs = require('fs');
const path = require('path');

// Read hook input from stdin
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    main(input);
  } catch (err) {
    // On error, allow the operation (fail open)
    console.error(`pre-edit-check error: ${err.message}`);
    process.exit(0);
  }
});

function main(rawInput) {
  // Parse hook input
  let hookData = {};
  try {
    hookData = JSON.parse(rawInput);
  } catch {
    // If parsing fails, allow
    process.exit(0);
  }

  const filePath = hookData.toolInput?.file_path || '';
  const cwd = process.cwd();

  // === EXEMPTIONS ===

  // 1. Always allow plan files (we want Claude to create plans!)
  if (filePath.includes('.project/plans/')) {
    process.exit(0);
  }

  // 2. Always allow context files (progress tracking)
  if (filePath.includes('.project/context/')) {
    process.exit(0);
  }

  // 3. Always allow PRD/Epic files (project management)
  if (filePath.includes('.project/prds/') || filePath.includes('.project/epics/')) {
    process.exit(0);
  }

  // 4. Always allow config files
  if (filePath.includes('.project/config') || filePath.includes('CLAUDE.md')) {
    process.exit(0);
  }

  // === CHECK ENFORCEMENT LEVEL ===

  const focusPath = path.join(cwd, '.project', 'context', 'focus.json');
  const configPath = path.join(cwd, '.project', 'config.json');

  let enforcementLevel = 'remind'; // Default: soft reminder only

  // Check focus.json for workflow_enforcement or workflow_bypass
  if (fs.existsSync(focusPath)) {
    try {
      const focus = JSON.parse(fs.readFileSync(focusPath, 'utf8'));

      // Check for bypass flag (set by user saying "just do it")
      if (focus.workflow_bypass) {
        process.exit(0);
      }

      // Check enforcement level in focus
      if (focus.workflow_enforcement) {
        enforcementLevel = focus.workflow_enforcement;
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Check config.json for workflow_enforcement
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.workflow_enforcement) {
        enforcementLevel = config.workflow_enforcement;
      }
    } catch {
      // Ignore parse errors
    }
  }

  // If enforcement is off or remind, allow (SessionStart handles reminders)
  if (enforcementLevel === 'off' || enforcementLevel === 'remind') {
    process.exit(0);
  }

  // === STRICT ENFORCEMENT ===

  // Only enforce if we're in strict mode
  if (enforcementLevel !== 'strict') {
    process.exit(0);
  }

  // Check if a plan exists
  const plansDir = path.join(cwd, '.project', 'plans');

  if (!fs.existsSync(plansDir)) {
    // No plans directory - block
    blockWithFeedback('No `.project/plans/` directory found.');
  }

  const plans = fs.readdirSync(plansDir).filter(f => f.endsWith('.md'));

  if (plans.length === 0) {
    // No plan files - block
    blockWithFeedback('No plan files found in `.project/plans/`.');
  }

  // Check if any plan is recent (modified in last 24 hours) or matches current focus
  let hasRelevantPlan = false;

  // Get current focus epic name
  let currentEpic = null;
  if (fs.existsSync(focusPath)) {
    try {
      const focus = JSON.parse(fs.readFileSync(focusPath, 'utf8'));
      currentEpic = focus.current_focus?.epic;
    } catch {
      // Ignore
    }
  }

  for (const plan of plans) {
    // Check if plan name matches current epic
    if (currentEpic && plan.toLowerCase().includes(currentEpic.toLowerCase())) {
      hasRelevantPlan = true;
      break;
    }

    // Check if plan was modified recently (last 24 hours)
    const planPath = path.join(plansDir, plan);
    const stats = fs.statSync(planPath);
    const hoursSinceModified = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);

    if (hoursSinceModified < 24) {
      hasRelevantPlan = true;
      break;
    }
  }

  if (!hasRelevantPlan) {
    // No relevant plan - block
    const epicHint = currentEpic ? ` for epic "${currentEpic}"` : '';
    blockWithFeedback(`No recent plan found${epicHint}.`);
  }

  // All checks passed - allow
  process.exit(0);
}

/**
 * Block the operation and provide feedback to Claude.
 */
function blockWithFeedback(reason) {
  console.error(`⚠️ Workflow Enforcement (strict mode)

${reason}

Before implementing, create a plan:
  .project/plans/{feature-name}.md

Or bypass workflow enforcement:
  - Say "just do it" or "bypass workflow"
  - Set workflow_bypass: true in focus.json
  - Change workflow_enforcement to "remind" in config.json
`);
  process.exit(2);
}
