# CLAUDE.md - [Project Name]

**Read this file completely. It's intentionally short.**

---

## FIRST SESSION: Bootstrap Quality Infrastructure

> **STOP. Before writing ANY feature code, complete this checklist.**
>
> Quality gates must exist BEFORE features. A codebase without automated enforcement will decay.

### Step 0: Version Control (Do This FIRST)

| # | Task | Command | Verify |
|---|------|---------|--------|
| 1 | **Initialize Git** | `git init` | `.git/` directory exists |
| 2 | **Create .gitignore** | Use template for your language | Secrets/build files ignored |
| 3 | **Initial commit** | `git add . && git commit -m "Initial scaffolding"` | Clean starting point |
| 4 | **Create GitHub repo** | `gh repo create [name] --private --source=.` | Repo exists on GitHub |
| 5 | **Push to remote** | `git push -u origin main` | Code is on GitHub |
| 6 | **Verify remote** | `git remote -v` | Shows GitHub URL |

**Why first?** Pre-commit hooks require Git. GitHub enables backup, collaboration, and CI/CD later.

```bash
# Quick setup (if gh CLI installed)
git init
git add .
git commit -m "Initial scaffolding"
gh repo create [project-name] --private --source=. --push

# Or manual GitHub setup
git init
git add .
git commit -m "Initial scaffolding"
# Create repo on github.com, then:
git remote add origin https://github.com/[user]/[repo].git
git push -u origin main
```

### Step 1: Identify Project Type

| Type | Examples | Bootstrap Path |
|------|----------|----------------|
| **Web App** | React, Vue, Next.js, SvelteKit | Full bootstrap (tests + E2E + lint) |
| **API/Backend** | Express, FastAPI, REST service | Tests + lint (skip E2E) |
| **CLI Tool** | Node CLI, Python script | Tests + lint (skip E2E) |
| **Library/Package** | npm package, Python module | Tests + lint + build |
| **Desktop App** | Electron, Tauri | Full bootstrap |
| **Script/Automation** | One-off scripts, cron jobs | Minimal (lint only) |

### Step 2: Core Bootstrap (ALL Projects)

| # | Task | Command/Action | Verify |
|---|------|----------------|--------|
| 1 | **Initialize project** | `npm init -y` / `pip init` / equivalent | Package file exists |
| 2 | **Add TypeScript/typing** | See language-specific section | Type errors caught |
| 3 | **Add linter** | ESLint / Pylint / Clippy / equivalent | `npm run lint` works |
| 4 | **Add formatter** | Prettier / Black / rustfmt | `npm run format` works |
| 5 | **Add test framework** | Vitest / Jest / pytest / equivalent | `npm test` works |
| 6 | **Add pre-commit hooks** | Husky / pre-commit / git hooks | Bad commits blocked |
| 7 | **Add file length checker** | `scripts/check-file-length.js` | Files < 300 lines |
| 8 | **Create inventory files** | Track endpoints/components/modules | Drift detection works |

### Step 3: Language-Specific Setup

<details>
<summary><strong>TypeScript/JavaScript (Node.js)</strong></summary>

```bash
# Core
npm i -D typescript @types/node
npm i -D vitest
npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm i -D prettier eslint-config-prettier
npm i -D husky

# Initialize
npx tsc --init  # Then enable strict mode
npx husky init
```

**tsconfig.json key settings:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```
</details>

<details>
<summary><strong>Python</strong></summary>

```bash
# Core
pip install pytest pytest-cov
pip install pylint mypy
pip install black isort
pip install pre-commit

# Initialize
mypy --strict .  # Type checking
pre-commit install
```

**pyproject.toml key settings:**
```toml
[tool.mypy]
strict = true

[tool.pylint]
max-line-length = 100
```
</details>

<details>
<summary><strong>Rust</strong></summary>

```bash
# Built-in tools
cargo clippy        # Linting
cargo fmt           # Formatting
cargo test          # Testing

# Pre-commit
cargo install cargo-husky
```
</details>

<details>
<summary><strong>Go</strong></summary>

```bash
# Built-in tools
go vet ./...        # Static analysis
gofmt -w .          # Formatting
go test ./...       # Testing

# Additional
go install golang.org/x/lint/golint@latest
```
</details>

### Step 4: Web-Specific (If Applicable)

Only for web apps with UI:

| Task | Command | Purpose |
|------|---------|---------|
| Add E2E framework | `npm i -D playwright @playwright/test` | Test user flows |
| Add component inventory | `tests/component-inventory.json` | Track UI components |

### Required npm Scripts (Adapt for Your Language)

```json
{
  "scripts": {
    "dev": "[your dev command]",
    "build": "[your build command]",
    "test": "[test framework] run",
    "test:watch": "[test framework] --watch",
    "lint": "[linter] .",
    "lint:fix": "[linter] . --fix",
    "format": "[formatter] --write .",
    "format:check": "[formatter] --check .",
    "typecheck": "[type checker]",
    "check:file-length": "node scripts/check-file-length.js",
    "precommit": "npm run typecheck && npm run lint && npm run check:file-length && npm test"
  }
}
```

### After Bootstrap is Complete

- [ ] Bootstrap completed on: [DATE]
- [ ] Project type: [TYPE]
- [ ] Git initialized and pushed to GitHub: Yes/No
- [ ] GitHub repo URL: [URL]
- [ ] All quality scripts working: Yes/No
- [ ] Pre-commit hooks blocking bad commits: Yes/No
- [ ] First "all checks pass" commit pushed: Yes/No

---

## The 10 Rules

### Context Management
| # | Rule | Reference |
|---|------|-----------|
| 1 | **READ** docs/ files at session start | `docs/ARCHITECTURE.md`, `docs/CONTRIBUTING.md` |
| 2 | **RE-READ** this file when: conversation is long, you're uncertain, or before any refactor | - |
| 3 | **RECALL** relevant docs before specialized tasks (testing, integrations, migrations) | See rule references below |

### Never Break Production
| # | Rule | Reference |
|---|------|-----------|
| 4 | **NEVER** ship refactors without diffing every endpoint/function against original | `docs/LESSONS-LEARNED.md` |
| 5 | **NEVER** exceed 300 lines per file - split proactively at 250 | `docs/CONTRIBUTING.md#file-limits` |
| 6 | **NEVER** bypass data source rules defined in architecture | `docs/ARCHITECTURE.md#data-sources` |

### Always Do
| # | Rule | Reference |
|---|------|-----------|
| 7 | **ALWAYS** run full test suite before declaring work complete | `docs/CONTRIBUTING.md#testing` |
| 8 | **ALWAYS** update CHANGELOG.md + tasks/TASKS.md after code changes | - |
| 9 | **ALWAYS** use shared utilities for common behaviors | `docs/CONTRIBUTING.md#shared-patterns` |
| 10 | **ALWAYS** verify dates are current year before writing timestamps | - |

---

## Quality Gates (Enforced Automatically)

These checks run on every commit via pre-commit hooks:

| Check | What It Catches | Fail Behavior |
|-------|-----------------|---------------|
| `typecheck` | Type errors, implicit any | Commit blocked |
| `lint` | Code style violations, unused vars | Commit blocked |
| `check:file-length` | Files > 300 lines | Commit blocked |
| `test` | Broken functionality, missing inventory entries | Commit blocked |

### Drift Detection (Inventory Tests)

Tests automatically fail if code doesn't match inventories:

| Change | Required Inventory Update |
|--------|---------------------------|
| Add/remove API endpoint | `tests/endpoint-inventory.json` |
| Add/remove component | `tests/component-inventory.json` |
| Add/remove module | `tests/module-inventory.json` |

**No code ships without passing all gates.**

---

## Quick Start (After Bootstrap)

```bash
# Development
[your dev command]

# Quality checks (run before ANY commit)
npm run precommit   # or: make check, cargo check, etc.

# Tests only
npm test
```

---

## Project Summary

<!-- Fill this in after bootstrap -->
[Describe the project purpose and key functionality here]

**Type:** [Web App / API / CLI / Library / Desktop / Script]

**Key Features:** [Feature 1] | [Feature 2] | [Feature 3]

**Stack:** [List primary technologies, frameworks, and tools]

---

## Documentation Index

| File | Purpose | When to Read |
|------|---------|--------------|
| `docs/ARCHITECTURE.md` | Project structure, data flow, API endpoints | Session start, before structural changes |
| `docs/CONTRIBUTING.md` | Code standards, file limits, testing, patterns | Before writing code |
| `docs/LESSONS-LEARNED.md` | Historical mistakes (append-only) | Before any refactor/migration |
| `docs/INTEGRATIONS.md` | External API auth, troubleshooting | When working on external integrations |
| `docs/USER_GUIDE.md` | End-user documentation | Reference for UI questions |
| `docs/ADMIN_GUIDE.md` | Deployment, configuration | Setup/deployment tasks |
| `CHANGELOG.md` | Version history | Session start |
| `tasks/TASKS.md` | Current work tracking | Session start, after completing work |
| `ROADMAP.md` | Planned features | When prioritizing work |
