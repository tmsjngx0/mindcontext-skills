# MindContext Skills Testing

## Quick Test

```bash
# 1. Copy skills to test project
cd test/sample-project
mkdir -p .claude/skills
cp -r ../../skills/* .claude/skills/

# 2. Start Claude Code in test project
claude  # or open in VS Code

# 3. Test skill discovery
# Ask: "What skills are available?"

# 4. Test each skill
```

## Test Matrix

| Skill | Trigger | Expected |
|-------|---------|----------|
| project-scaffold | "Initialize MindContext" | Creates .project/ |
| session-init | "Start session" | Shows status |
| prd-create | "Create PRD for login" | Creates .project/prds/login.md |
| epic-planning | "Plan login epic" | Creates tasks in epic dir |
| task-workflow | "Work on task 1" | Runs full workflow |

## Sample Project

`test/sample-project/` contains pre-made structure for testing:

```
sample-project/
├── .project/
│   ├── prds/
│   │   └── sample-feature.md
│   ├── epics/
│   │   └── sample-feature/
│   │       ├── epic.md
│   │       └── 001.md
│   └── context/
│       └── progress.md
└── CLAUDE.md
```

## Test Scenarios

### 1. Fresh Project
- Create empty dir
- "Initialize MindContext"
- Verify structure created

### 2. Existing Project
- Use sample-project
- "Start session"
- "Work on task 1"

### 3. Full Lifecycle
- Initialize
- Create PRD
- Plan epic
- Work on tasks
