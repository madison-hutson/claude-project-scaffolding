# Project Scaffolding Template

**A ready-to-use project template with quality gates built in.**

## Quick Start

1. Click **"Use this template"** → **"Create a new repository"**
2. Clone your new repo
3. Open with Claude Code
4. Claude reads `CLAUDE.md` and bootstraps your project

## What's Included

### Documentation Structure
```
├── CLAUDE.md           ← Claude reads this FIRST (bootstrap instructions)
├── CHANGELOG.md        ← Version history
├── ROADMAP.md          ← Feature planning
├── docs/
│   ├── ARCHITECTURE.md     ← Project structure
│   ├── CONTRIBUTING.md     ← Code standards
│   ├── LESSONS-LEARNED.md  ← Mistake log (append-only)
│   ├── INTEGRATIONS.md     ← External API reference
│   ├── USER_GUIDE.md       ← End-user docs
│   └── ADMIN_GUIDE.md      ← Deployment/config
└── tasks/
    └── TASKS.md        ← Session-based task tracking
```

### Quality Infrastructure
```
├── scripts/
│   └── check-file-length.js   ← Enforces 300-line limit
├── tests/
│   ├── endpoint-inventory.json    ← API drift detection
│   ├── component-inventory.json   ← Component drift detection
│   ├── inventory.test.ts          ← Drift detection tests
│   └── e2e/                       ← E2E tests (web apps)
├── tsconfig.json          ← Strict TypeScript
├── eslint.config.js       ← Linting rules
├── .prettierrc            ← Formatting rules
├── vitest.config.ts       ← Unit test config
├── playwright.config.ts   ← E2E test config (web apps)
└── .gitignore             ← Standard ignores
```

## Bootstrap Order

When Claude reads `CLAUDE.md`, it follows this order:

| Step | What | Why |
|------|------|-----|
| 0 | Git + GitHub | Version control before anything |
| 1 | Identify project type | Web/API/CLI/Library/Script |
| 2 | Core quality gates | Tests, lint, types, hooks |
| 3 | Language-specific setup | TS/Python/Rust/Go |
| 4 | Web-specific (if applicable) | E2E testing |

## Supported Project Types

| Type | Examples | What Gets Set Up |
|------|----------|------------------|
| Web App | React, Vue, Next.js | Full (tests + E2E + lint) |
| API/Backend | Express, FastAPI | Tests + lint |
| CLI Tool | Node CLI, Python script | Tests + lint |
| Library | npm package, Python module | Tests + lint + build |
| Desktop | Electron, Tauri | Full |
| Script | Automation, cron jobs | Minimal (lint) |

## Supported Languages

- TypeScript/JavaScript (Node.js)
- Python
- Rust
- Go

## Quality Gates (Enforced on Every Commit)

| Check | What It Catches |
|-------|-----------------|
| `typecheck` | Type errors |
| `lint` | Code style violations |
| `check:file-length` | Files > 300 lines |
| `test` | Broken tests, missing inventory |

## After Using This Template

1. Replace `[Project Name]` placeholders in docs
2. Fill in `CLAUDE.md` → Project Summary section
3. Update `ARCHITECTURE.md` with your structure
4. Delete this README and write your own (or keep the structure)

---

*Created with Claude Code*
