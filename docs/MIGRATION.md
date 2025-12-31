# Migrating an Existing Project

This guide helps you apply the scaffold to a project that already has code.

> **Why a checklist instead of a script?** Every existing project is different. You need to understand what's being added, and merge conflicts require human judgment. A 500-line script would still fail on edge cases. This checklist takes 5 minutes and works everywhere.

---

## Pre-Flight

- [ ] Commit or stash all current changes
- [ ] Note your existing configs (eslint, tsconfig, prettier, etc.)
- [ ] Identify your project type (Web App / API / CLI / Library)

---

## Step 1: Add Files (Won't Conflict)

These files are new and won't overwrite anything:

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Agent instructions (the core of this system) |
| `docs/ARCHITECTURE.md` | Document your existing structure |
| `docs/CONTRIBUTING.md` | Code standards |
| `docs/LESSONS-LEARNED.md` | Mistake log (start empty) |
| `docs/BOOTSTRAP.md` | Reference only (you're already bootstrapped) |
| `docs/TASKS.md` | Session task tracking |
| `docs/ROADMAP.md` | Feature planning |
| `docs/CHANGELOG.md` | Version history |
| `scripts/check-file-length.js` | 300-line enforcer |
| `tests/component-inventory.json` | UI component tracking (web apps) |
| `tests/endpoint-inventory.json` | API endpoint tracking |
| `tests/inventory.test.ts` | Drift detection tests |
| `tests/component-inventory.test.ts` | Component drift detection |

```bash
# Copy from scaffold repo (adjust paths as needed)
cp -r scaffold/docs ./docs
cp scaffold/CLAUDE.md ./
cp scaffold/scripts/check-file-length.js ./scripts/
cp scaffold/tests/*inventory* ./tests/
```

---

## Step 2: Merge Carefully (May Conflict)

These require manual merging with your existing configs:

### package.json

Add these scripts (don't replace your existing ones):

```json
{
  "scripts": {
    "check:file-length": "node scripts/check-file-length.js",
    "precommit": "npm run typecheck && npm run lint && npm run check:file-length && npm test"
  }
}
```

### .gitignore

Add if missing:

```gitignore
# Build
dist/
build/
.next/
.nuxt/

# Dependencies
node_modules/

# Test
coverage/
test-results/

# Environment
.env
.env.local
*.local
```

### Pre-commit Hooks

If you don't have Husky:

```bash
npm install -D husky
npx husky init
echo "npm run precommit" > .husky/pre-commit
```

If you already have Husky, add to your existing hook:

```bash
# In .husky/pre-commit, add:
npm run check:file-length
```

### ESLint / Prettier

Keep your existing configs. The scaffold's configs are starting points, not requirements.

### tsconfig.json

Ensure these are enabled (add if missing):

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

---

## Step 3: Populate Inventories

The scaffold can't know what's already in your project. You need to populate:

### Component Inventory (Web Apps)

```bash
# Find all your components
find src -name "*.tsx" -type f | grep -v test | grep -v spec
```

Add each to `tests/component-inventory.json`:

```json
{
  "components": [
    { "name": "Header", "path": "src/components/Header.tsx", "description": "..." },
    { "name": "Button", "path": "src/components/Button.tsx", "description": "..." }
  ],
  "totalComponents": 2
}
```

### Endpoint Inventory (APIs)

List all your routes in `tests/endpoint-inventory.json`:

```json
{
  "endpoints": [
    { "method": "GET", "path": "/api/users", "description": "List users" },
    { "method": "POST", "path": "/api/users", "description": "Create user" }
  ],
  "totalEndpoints": 2
}
```

---

## Step 4: Validate

Run all checks:

```bash
npm run precommit
```

Fix any issues:

| Issue | Fix |
|-------|-----|
| Files > 300 lines | Split them (see CONTRIBUTING.md) |
| Type errors | Fix or add `// @ts-expect-error` with explanation |
| Lint errors | Fix or adjust eslint config |
| Inventory mismatch | Update inventory files |

---

## Step 5: Document Your Architecture

Fill in `docs/ARCHITECTURE.md` with:

- [ ] Directory structure
- [ ] Data flow diagram (if applicable)
- [ ] Key modules and their responsibilities
- [ ] External integrations

This is the most important step. The scaffold enforces rules, but ARCHITECTURE.md captures *intent*.

---

## Step 6: First Commit

```bash
git add .
git commit -m "Add project scaffold

- Add CLAUDE.md and docs structure
- Add file length checker (300-line limit)
- Add inventory-based drift detection
- Configure pre-commit hooks

🤖 Generated with Claude Code"
```

---

## Common Issues

### "I have files over 300 lines"

You have two options:

1. **Split them now** - Ideal but takes time
2. **Document as tech debt** - Add to `docs/ROADMAP.md` and temporarily increase the limit in `check-file-length.js`

Don't just raise the limit permanently. The point is to enforce discipline going forward.

### "My test framework is different"

Adapt `inventory.test.ts` to your framework (Jest, Mocha, etc.). The logic is the same:

```javascript
// Jest version
test('inventory matches code', () => {
  expect(inventory.components.length).toBe(inventory.totalComponents);
});
```

### "I don't use TypeScript"

The scaffold is TypeScript-focused but adaptable:

- Python: Use `mypy` for type checking, `pytest` for tests
- JavaScript: Remove `typecheck` from precommit, keep everything else
- Go/Rust: Adapt the quality gate scripts to your toolchain

---

## Checklist Summary

- [ ] Pre-flight complete (changes committed/stashed)
- [ ] Core files added (CLAUDE.md, docs/, scripts/)
- [ ] package.json scripts merged
- [ ] Pre-commit hooks configured
- [ ] Inventories populated
- [ ] `npm run precommit` passes
- [ ] ARCHITECTURE.md documents your structure
- [ ] First scaffold commit pushed

---

*Migration complete. Return to CLAUDE.md for ongoing rules.*
