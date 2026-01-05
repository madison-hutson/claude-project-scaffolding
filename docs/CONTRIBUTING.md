# Contributing Guidelines

## Before Writing New Code

**Search before you write. Extend before you create.**

### The Anti-Pattern
```
Need pan/zoom for canvas → write 66 lines of interaction logic
→ user asks "doesn't this already exist in the Bubbling module?"
→ yes it does → delete and refactor
```

### The Pattern
```
Need pan/zoom for canvas → search for existing implementations
→ find useCanvasInteraction hook → extend or compose it
→ 10 lines instead of 66
```

### Search Checklist

Before writing new code for common patterns, search first:

| Pattern | Search For |
|---------|------------|
| Canvas interaction | `useCanvasInteraction`, `DrawingCanvas`, `pan`, `zoom` |
| Form handling | `useForm`, `FormProvider`, `validation` |
| Data fetching | `useQuery`, `useFetch`, `api/` directory |
| Modal/Dialog | `Modal`, `Dialog`, `useModal` |
| Table/List | `DataTable`, `ListView`, `useTable` |
| Auth/Permissions | `useAuth`, `PermissionGuard`, `requiresAuth` |

### General Search Strategy

```bash
# 1. Search for concept keywords
grep -r "pan\|zoom\|interaction" src/

# 2. Check hooks directory
ls -la src/hooks/

# 3. Check components directory for similar patterns
ls -la src/components/canvas/

# 4. Search for similar imports in existing files
grep -r "from.*canvas" src/
```

### Why This Matters

1. **Chesterton's Fence** - Understand what exists before building new
2. **Consistency** - Existing patterns are already tested and reviewed
3. **File size** - New code adds lines; extending existing code often doesn't
4. **DRY** - Duplication creates maintenance burden

> If you're about to write 30+ lines of interaction/UI logic, **stop and search first**.

---

## File Limits

### Hard Limit: 300 Lines
- **No file may exceed 300 lines**
- Start planning splits at 250 lines
- Check line count DURING development, not after
- This applies to ALL languages (TypeScript, Python, Rust, Go, etc.)

### Estimate Before Adding

Before adding significant code (30+ lines):

```bash
# Check current line count
wc -l src/components/TargetFile.tsx
# Output: 265 src/components/TargetFile.tsx

# You're about to add ~50 lines → 315 lines (over limit!)
# Either: split first, or add to different file
```

**The anti-pattern:**
```
Add feature → realize file is now 331 lines → extract component
```

**The pattern:**
```
Check lines → 265 → adding ~50 lines will exceed → split first → add feature
```

This prevents reactive extractions that create worse architecture than proactive planning.

### Ideal Sizes
| Type | Target | Max |
|------|--------|-----|
| Module/Component | <150 lines | 200 lines |
| Utility/Helper | <100 lines | 150 lines |
| Route/Handler | <200 lines | 300 lines |
| Config file | <100 lines | 150 lines |
| Test file | <200 lines | 300 lines |

### How to Split Code
1. Extract sub-modules/components to separate files
2. Move types/interfaces to dedicated `types/` directory
3. Extract utilities to `utils/` or `helpers/`
4. Split by responsibility (single responsibility principle)

### When to Split Documentation

Documentation has different rules than code:

| File | Threshold | How to Split |
|------|-----------|--------------|
| `CLAUDE.md` | **Never split** | Keep extremely short; only strict rules belong here |
| `ARCHITECTURE.md` | > 400 lines | Split into overview + topic files (`docs/arch/*.md`) |
| `DECISIONS.md` | > 500 lines | Archive old decisions to `docs/decisions-archive/` |
| `CONTRIBUTING.md` | 500 lines (strict) | Split into overview + detailed guides |
| `BOOTSTRAP.md` | > 300 lines | Split by language/framework (`docs/bootstrap/*.md`) |
| `DEV_ENVIRONMENT.md` | > 300 lines | Split by server/service (`docs/env/*.md`) |
| `TROUBLESHOOTING.md` | Never split | Single searchable list is the point; grows over time |
| `GLOSSARY.md` | Never split | Single reference for terminology |
| `INTEGRATIONS.md` | > 400 lines | Split by integration (`docs/integrations/*.md`) |
| `USER_GUIDE.md` | > 500 lines | Split into chapters (`docs/guide/*.md`) |
| `ADMIN_GUIDE.md` | > 400 lines | Split into chapters (`docs/admin/*.md`) |
| `CHANGELOG.md` | Never split | Archive old versions to `docs/changelog-archive/` if needed |
| `LESSONS-LEARNED.md` | Never split | Single searchable history is the point |
| `TASKS.md` | Never split | Archive completed sessions periodically |
| `ROADMAP.md` | Never split | Move completed items to `CHANGELOG.md` to manage size |

**CLAUDE.md is special:** It must remain extremely concise. Only add new entries when establishing strict rules that apply to every session. Detailed explanations belong in other docs files, referenced from CLAUDE.md.

### Splits Must Improve Architecture

The 300-line limit exists to force architectural thinking, not as a target to hit by extraction.

**Before extracting code, ask:**
1. Does this extraction change the dependency graph, or just the file layout?
2. Would a reader understand the system better after this split?
3. Is there a deeper architectural issue (prop drilling, god-component) that I'm avoiding?

**If you're moving code to hit 300 lines without changing ownership:**
- Stop and identify the real architectural issue
- Document the tech debt in `docs/ROADMAP.md` or a TODO comment
- Make the compromise explicit, not hidden

**Red flags (you're gaming the metric):**
- Extracting a `useAllHandlers` hook that returns 15+ functions
- Creating a component that still needs 50+ props
- Splitting a file but keeping circular imports
- Moving code without changing who owns the state/logic

**Good splits (architecture actually improved):**
- Feature boundaries (auth logic separate from profile logic)
- Abstraction layers (data fetching separate from presentation)
- Reusability (shared utilities used by multiple consumers)
- State ownership (Context/store owns state, components consume it)

**When the real fix is too big:**

Sometimes the proper architectural fix (e.g., refactoring prop drilling to Context) is too large for the current task. In that case:
1. Do the extraction as a temporary measure
2. Add explicit tech debt documentation:
   ```markdown
   ## Tech Debt (docs/ROADMAP.md)
   - [ ] ComponentName prop drilling: ~N props passed through.
         Handler extraction done for file length compliance.
         Proper fix: React Context / Zustand / [appropriate pattern].
   ```
3. Never treat the extraction as "done" - it's a documented workaround

## Testing

### Philosophy: Tests First, Then Features

```
┌─────────────────────────────────────────┐
│ 1. Quality infrastructure exists        │
│ 2. Tests exist for the feature          │
│ 3. THEN implement the feature           │
│ 4. Tests pass before declaring done     │
└─────────────────────────────────────────┘
```

### Test Categories

| Category | Purpose | When to Write |
|----------|---------|---------------|
| Unit tests | Test individual functions | Every function with logic |
| Integration tests | Test components together | API endpoints, DB operations |
| E2E tests | Test full user flows | Web apps only |
| Drift detection | Catch missing inventory entries | Automatically maintained |

### Running Tests

```bash
# Adapt commands to your language/framework
npm test              # or: pytest, cargo test, go test
npm run test:watch    # Watch mode
npm run test:e2e      # E2E tests (web apps)
npm run test:coverage # Coverage report
```

### Inventory-Based Drift Detection

Inventory files track what exists in your codebase. Tests FAIL if code doesn't match.

| Inventory File | Tracks | Update When |
|----------------|--------|-------------|
| `endpoint-inventory.json` | API routes | Add/remove endpoint |
| `component-inventory.json` | UI components | Add/remove component |
| `module-inventory.json` | Core modules | Add/remove module |

**Why?** Prevents "I added a feature but forgot to test/document it."

### Quality Check Scripts

```bash
# Run ALL checks before committing
npm run precommit

# Individual checks
npm run typecheck        # Type errors
npm run lint             # Code style
npm run check:file-length # File size limit
npm test                 # Tests
```

## Code Style

### General Principles (All Languages)

1. **Explicit over implicit** - Name things clearly
2. **Single responsibility** - One function does one thing
3. **No magic numbers** - Use named constants
4. **Handle errors explicitly** - No silent failures
5. **Type everything** - Use strict typing

### File Organization Template

```
[File description/docstring]

[Imports - external first, then internal]

[Constants/Configuration]

[Types/Interfaces (if not in separate file)]

[Main implementation]

[Exports (if applicable)]
```

### Naming Conventions

| Thing | Convention | Example |
|-------|------------|---------|
| Files | kebab-case or snake_case | `user-service.ts`, `user_service.py` |
| Classes | PascalCase | `UserService` |
| Functions | camelCase or snake_case | `getUser()`, `get_user()` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |
| Types/Interfaces | PascalCase | `UserData`, `ConfigOptions` |

## Documentation Updates

After ANY code change:

| File | Update When |
|------|-------------|
| `docs/CHANGELOG.md` | Every feature, fix, or breaking change |
| `docs/TASKS.md` | Mark task complete or add new tasks |
| `docs/ARCHITECTURE.md` | Structure changes, new data sources |
| `docs/LESSONS-LEARNED.md` | Made a mistake worth documenting |
| Inventory files | Added/removed endpoint/component/module |

## Session Discipline

### Batch Size: 3, Then Checkpoint

**More than 3 actions without verification = accumulating unjustified beliefs.**

After every 3 significant actions (file edits, commands, etc.):
1. Stop and verify reality matches your expectations
2. Run tests or manual verification
3. If something is off, investigate before continuing

A checkpoint is verification that reality matches your model:
- Run the test
- Read the output
- Write down what you found
- Confirm it worked

> TodoWrite is not a checkpoint. Thinking is not a checkpoint. Observable reality is the checkpoint.

### Checkpoint Before New Features

When the user requests a new feature mid-session:

1. **Ask:** "Should we commit the current changes first?"
2. **If uncommitted changes span 3+ files:** Strongly recommend committing
3. **If new feature is significant** (new modal, new API endpoint, new component): Start fresh with a commit

### Red Flags That Require Checkpoint

| Signal | Action |
|--------|--------|
| "Additionally...", "Also...", "One more thing..." | Pause and assess scope |
| 5+ files modified without commit | Commit before continuing |
| New feature requires new types/components/endpoints | Commit existing work first |
| Session running > 30 minutes without commit | Suggest checkpoint |

### Why This Matters

Claude doesn't manage session scope. It will keep implementing until something breaks. A senior engineer would say: "That's a bigger change. Let me commit what I have first."

**The rule:** One logical change = one commit. Don't stack uncommitted changes across unrelated features.

### Chesterton's Fence for Working Code

Before modifying code that "should work":
1. **Verify it's actually broken** — test it, don't assume
2. **Check git history** — `git log -3 <file>` to see recent changes
3. **Understand current implementation** — read the code, don't skim
4. **One change, one test** — if it doesn't fix, REVERT immediately
5. **Three failed attempts = STOP** — ask for help, don't keep trying

**Revert command:** `git checkout HEAD -- <file>`

---

## Git Workflow

### Commit Message Format

```
type: Short description (imperative mood)

[Optional longer explanation]

[Generated with Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Types

| Type | Use For |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that doesn't add feature or fix bug |
| `test` | Adding or updating tests |
| `chore` | Maintenance, dependencies, tooling |

### Staging Discipline

**`git add .` is forbidden.** Add files individually. Know what you're committing.

```bash
# Wrong - blind staging
git add .

# Right - intentional staging
git add src/feature.ts tests/feature.test.ts docs/CHANGELOG.md
```

Why:
- Forces you to review what changed
- Prevents accidental commits of debug code, `.env`, etc.
- Creates a mental checkpoint before each commit

### Before Committing Checklist

> **Warning:** Don't let green tests trigger a rush to commit. Documentation is part of the work, not cleanup.

**Code Quality:**
- [ ] Code works (manual verification)
- [ ] `npm run precommit` passes (all quality gates)
- [ ] Relevant tests added/updated
- [ ] No secrets in code (check `.env`, credentials)

**Documentation (check BEFORE every commit):**

*Core (check every time):*
- [ ] `docs/CHANGELOG.md` - Updated if user-facing change
- [ ] `docs/TASKS.md` - Mark complete, add new tasks discovered

*User-facing (if feature affects users):*
- [ ] `docs/USER_GUIDE.md` - Updated if user-facing feature or behavior change
- [ ] `docs/ADMIN_GUIDE.md` - Updated if deployment, config, or setup changes

*Technical (if internals changed):*
- [ ] `docs/ARCHITECTURE.md` - Updated if structure, data flow, or API changed
- [ ] `docs/DEV_ENVIRONMENT.md` - Updated if servers, ports, or startup order changed
- [ ] `docs/INTEGRATIONS.md` - Updated if external API integration changed
- [ ] `docs/DECISIONS.md` - Updated if you made an architectural decision
- [ ] Inventory files - Updated if endpoints/components added/removed

*Learning (if applicable):*
- [ ] `docs/LESSONS-LEARNED.md` - Updated if you learned something worth preserving
- [ ] `docs/TROUBLESHOOTING.md` - Updated if you encountered and resolved a new issue

*Planning (if scope changed):*
- [ ] `docs/ROADMAP.md` - Mark completed items, add newly discovered work

## Shared Patterns

### Error Handling

```
1. Catch specific errors, not generic
2. Log errors with context (what was being attempted)
3. Return meaningful error messages to caller
4. Don't swallow errors silently
```

### Configuration

```
1. All config in environment variables or config files
2. No hardcoded URLs, credentials, or magic numbers
3. Sensible defaults with override capability
4. Document required vs optional config
```

### Logging

```
1. Log at appropriate levels (debug, info, warn, error)
2. Include context (what, where, why)
3. Don't log sensitive data (passwords, tokens, PII)
4. Structured logging for production (JSON)
```

---

*Last Updated: [Date]*
