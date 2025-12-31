# Bootstrap Guide - First Session Only

> **STOP. Before writing ANY feature code, complete this checklist.**
>
> Quality gates must exist BEFORE features. A codebase without automated enforcement will decay.

---

## Step 0: Version Control (Do This FIRST)

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

---

## Step 1: Identify Project Type

| Type | Examples | Bootstrap Path |
|------|----------|----------------|
| **Web App** | React, Vue, Next.js, SvelteKit | Full bootstrap (tests + E2E + lint) |
| **API/Backend** | Express, FastAPI, REST service | Tests + lint (skip E2E) |
| **CLI Tool** | Node CLI, Python script | Tests + lint (skip E2E) |
| **Library/Package** | npm package, Python module | Tests + lint + build |
| **Desktop App** | Electron, Tauri | Full bootstrap |
| **Script/Automation** | One-off scripts, cron jobs | Minimal (lint only) |

---

## Step 2: Core Bootstrap (ALL Projects)

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

---

## Step 3: Language-Specific Setup

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

---

## Step 4: Web-Specific (If Applicable)

Only for web apps with UI:

| Task | Command | Purpose |
|------|---------|---------|
| Add E2E framework | `npm i -D playwright @playwright/test` | Test user flows |
| Add component inventory | `tests/component-inventory.json` | Track UI components |

---

## Step 5: Enable CI Checks (After Adding Source Code)

> **IMPORTANT:** The GitHub Actions CI workflow (`.github/workflows/ci.yml`) has some checks
> commented out by default. This is intentional - a template with no source code can't pass
> typecheck/lint/test. **You must enable them after adding your code.**

Edit `.github/workflows/ci.yml` and uncomment these steps:

```yaml
# Uncomment these after adding source code:
- name: Type check
  run: npm run typecheck

- name: Lint
  run: npm run lint

- name: Run tests
  run: npm test
```

**When to enable each:**
| Check | Enable When |
|-------|-------------|
| `typecheck` | After adding first `.ts` file |
| `lint` | After adding first source file |
| `test` | After adding first test |
| `test:e2e` | After adding E2E tests (web apps) |

**Local pre-commit hooks work immediately** - only CI needs this manual step.

---

## Required npm Scripts (Adapt for Your Language)

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

---

## Bootstrap Completion Checklist

- [ ] Bootstrap completed on: [DATE]
- [ ] Project type: [TYPE]
- [ ] Git initialized and pushed to GitHub: Yes/No
- [ ] GitHub repo URL: [URL]
- [ ] All quality scripts working: Yes/No
- [ ] Pre-commit hooks blocking bad commits: Yes/No
- [ ] CI workflow checks enabled in `.github/workflows/ci.yml`: Yes/No
- [ ] First "all checks pass" commit pushed: Yes/No

---

**After completing bootstrap, return to `CLAUDE.md` for ongoing rules.**
