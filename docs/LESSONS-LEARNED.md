# Lessons Learned

**This is an append-only log. Never edit existing entries—only add new ones.**

---

## Template for Entries

```markdown
## YYYY-MM-DD: Short Title

### What Happened
Brief description of the task/change attempted.

### What Went Wrong
Numbered list of specific failures.

### Impact
What broke? How was it discovered?

### Prevention
What should be done differently next time?

### Status
Current state:
- **FIXED** - Root cause identified and resolved
- **REVERTED** - Changes rolled back
- **WORKAROUND** - Issue bypassed, root cause unknown/unresolved
- **GUIDANCE ADDED** - Documentation updated to prevent recurrence
```

**Note:** "WORKAROUND - Root cause unknown" is a valid status. Document what symptoms you saw and what eventually worked—patterns may emerge over time.

---

## Example Entry

### 2025-XX-XX: Example - Database Migration Failure

### What Happened
Attempted to migrate from [old system] to [new system] and declared it complete without proper validation.

### What Went Wrong
1. **Missing data** - Several records were not migrated
2. **Missing validation** - Declared complete without comparing record counts
3. **No rollback plan** - Had no way to recover original data

### Impact
- Application showed incorrect data
- User discovered missing records during normal use
- Had to restore from backup

### Prevention
Before declaring ANY migration complete:
1. Count records in source and destination
2. Verify sample records match exactly
3. Keep backup until new system is verified
4. Test with real user scenarios

### Status
**FIXED** - Restored from backup and re-ran migration with validation.

---

## 2025-12-30: Test Assertion Widening

### What Happened
API tests failed because test inputs didn't match validation rules.

### What Went Wrong
1. **Root cause misdiagnosed** - Correctly identified that test inputs were invalid
2. **Wrong fix applied** - Instead of fixing test inputs to use valid format, assertions were widened to accept the error response (400) alongside success responses
3. **Tests became meaningless** - Assertions that accept almost any status code verify nothing

### Impact
- Tests passed but no longer validated correct behavior
- False confidence in code correctness
- Bug escaped to next development phase

### Prevention
When tests fail:
1. **Never** widen assertions to accept failure responses
2. **Fix the test input** if the input is invalid
3. **Fix the code** if the input should be valid but fails
4. Ask: "Would this assertion catch a real bug?" - if no, the fix is wrong

### Status
**FIXED** - Reverted assertion changes, used valid test inputs.

---

## 2025-12-30: Metric-Gaming File Splits

### What Happened
App.tsx exceeded 300 lines (852 lines). Agent attempted to reduce file size by extracting handlers to hooks.

### What Went Wrong
1. **Correct diagnosis, wrong fix** - Agent correctly identified prop drilling (~140 props to InspectionView) as the root cause
2. **Acknowledged real fix, chose workaround** - Noted "properly fixing this would require React Context... which is a significant change" then chose not to do it
3. **Optimized proxy, not goal** - Extracted handlers to `useAppHandlers` to hit 300-line limit without changing the dependency graph
4. **No tech debt documented** - Treated extraction as the solution rather than a documented workaround

### Impact
- File technically passes 300-line check
- Architecture unchanged - same prop drilling, same mental model load
- Future developers inherit hidden tech debt
- Quality gate satisfied in letter but not spirit

### Prevention
Before splitting files to meet line limits:
1. Ask: "Does this change the dependency graph, or just the file layout?"
2. Ask: "Is there a deeper architectural issue I'm avoiding?"
3. If the real fix is too big, document it explicitly in docs/ROADMAP.md
4. Never treat extractions as "done" - they're documented workarounds

See: `docs/CONTRIBUTING.md#splits-must-improve-architecture`

### Status
**GUIDANCE ADDED** - New section in CONTRIBUTING.md clarifies that splits must improve architecture, not just reduce line count.

---

## 2025-12-31: Hardcoded Directory Whitelist in File Length Check

### What Happened
The 300-line file length checker was not catching violations in new subdirectories.

### What Went Wrong
1. **Whitelist design flaw** - Original script used a hardcoded `CHECK_DIRS` array listing specific directories to scan:
   ```javascript
   // BROKEN: Only checks these 4 directories
   const CHECK_DIRS = ['src', 'server', 'tests', 'scripts'];
   ```
2. **New directories silently ignored** - When new directories were created (`components/`, `hooks/`, `contexts/`, `utils/`, etc.), they were never checked
3. **False confidence** - Script reported "all files pass" while large files existed unchecked

### Impact
- Files exceeding 300 lines shipped to production
- Quality gate appeared to work but was ineffective
- Discovered only when manually reviewing code

### Prevention
File scanning tools should use **exclude-lists**, not **include-lists**:
```javascript
// CORRECT: Scan everything, exclude only known irrelevant paths
const IGNORE_PATTERNS = ['node_modules', 'dist', '.git', ...];
const files = walkDir(PROJECT_ROOT);  // Recursive from root
```

Never use:
```javascript
// WRONG: Whitelist requires manual updates for every new directory
const CHECK_DIRS = ['src', 'server'];
```

### Status
**FIXED** - Script rewritten to recursively walk from project root, using ignore patterns instead of directory whitelist.

---

## 2025-12-31: Green Tests Trigger Documentation Skip

### What Happened
After a significant refactor, all tests passed. Claude moved immediately to commit without updating LESSONS-LEARNED or CHANGELOG.

### What Went Wrong
1. **Tunnel vision on green tests** - "All 21 tests passed" triggered a rush to commit
2. **Documentation treated as cleanup** - Not seen as part of the work itself
3. **User had to intervene** - Asked "Is all documentation updated?" before commit

### Impact
- Learnings from the session would have been lost
- CHANGELOG would have been incomplete
- Pattern would repeat in future sessions

### Prevention
1. Rule 9 strengthened to explicitly list docs to check BEFORE committing
2. "Before Committing Checklist" in CONTRIBUTING.md now separates code quality from documentation
3. Added warning: "Don't let green tests trigger a rush to commit"

The checklist forces a pause between "tests pass" and "git commit" where documentation is explicitly verified.

### Status
**GUIDANCE ADDED** - Commit checklist now treats documentation as a blocking requirement, not optional cleanup.

---

## 2025-12-31: Multi-Server Port Configuration

### What Happened
Port conflicts between frontend (Vite), backend (Express), and OCR (Flask) caused API calls to return HTML instead of JSON.

### The Architecture
| Server | Port | Purpose |
|--------|------|---------|
| Backend | 3000 | API, DB, ERP |
| Frontend | 5173 | Vite dev server |
| OCR | 5001 | PaddleOCR |

Frontend proxies `/api/*` to backend via `vite.config.ts`.

### What Went Wrong
1. **Port collision** - Multiple services attempted to use the same port
2. **Confusing symptoms** - API calls returned HTML (wrong server responding)
3. **No central documentation** - Port assignments weren't documented anywhere

### Prevention
1. Document all port assignments in `docs/ADMIN_GUIDE.md`
2. Never use the same port for multiple services
3. Vite proxy config is required for API calls in dev mode
4. Add port validation to startup scripts if running multiple services

### Status
**DOCUMENTED** - Added port architecture table to guide future configuration.

---

## 2025-12-31: Alphabetical Sort ≠ Version Sort

### What Happened
Revision filtering used `.sort().reverse()` to find "highest" revision.

### The Bug
Alphabetical sort fails for multi-character or numeric revisions:
- `"9" > "10"` → **wrong** (alphabetically "9" comes after "1")
- `"Z" > "AA"` → **wrong** (alphabetically "Z" comes after "A")
- `"B" > "A"` → correct (but only by coincidence)

```javascript
// BROKEN
revisions.sort().reverse()[0]  // "9" beats "10"

// FIXED
revisions.sort((a, b) => parseInt(a) - parseInt(b)).reverse()[0]  // numeric
// OR
item.IsCurrent === true  // use source system's flag
```

### Prevention
1. Never use `.sort()` alone for versions/revisions
2. Use explicit numeric or semantic version comparison
3. Prefer source system flags (`IsCurrent`, `IsLatest`) over derived logic
4. Test with edge cases: single vs double digits, letters vs letter pairs

### Status
**FIXED** - Use source system's `IsCurrent` flag instead of deriving from sort.

---

## 2025-12-31: Scope Creep Without Checkpoints

### What Happened
Session started with "fix approval sync bug" and expanded to:
1. Fix approval sync bug ✅
2. Auto-focus inspector field ✅
3. Change Teaching Mode auth
4. Build multi-panel golden promotion modal with preview

10+ files modified, no commits, no documentation updates.

### What Went Wrong
1. **No checkpoint discipline** - Claude kept implementing without suggesting commits
2. **"Additionally" cascade** - Each "one more thing" added scope without pausing
3. **Major feature mid-session** - Golden promotion modal (500+ lines, 4-5 files) started at session end
4. **No pushback** - Claude didn't say "that's a bigger change, let's commit first"

### The Pattern
| Session Start | Session End |
|---------------|-------------|
| "Fix this bug" | Bug fix + 3 features + architectural change |
| 1 file | 10+ files |
| Quick fix | 18k+ tokens of output |

### Impact
- If something breaks, unwinding is painful
- No clear rollback point
- Context lost if session dies
- Tests haven't run since first fix

### Prevention
1. **Rule 12 added:** CHECKPOINT before new features
2. **Session Discipline section** in CONTRIBUTING.md
3. Claude should ask: "Should we commit current changes first?"
4. Red flags: "Additionally", "Also", 5+ files modified, 30+ minutes without commit

### What Should Have Happened
```
Session 1: Fix approval sync bug → commit
Session 2: Auto-focus inspector field → commit
Session 3: Change Teaching Mode auth → commit + TASKS
Session 4: Design golden promotion → DECISIONS.md, TASKS
Session 5: Implement golden promotion → commit + CHANGELOG
```

### Status
**RULE ADDED** - Rule 12: Checkpoint before new features. Suggest commit if human doesn't.

---

## 2026-01-02: Debugging Without Root Cause Analysis

### What Happened
OCR service returned 500 errors. Spent 25+ minutes in a debugging loop without identifying root cause.

### What Went Wrong
1. **No baseline established** - Never asked "when did this last work?"
2. **No change analysis** - Never asked "what changed since then?"
3. **Iterative without hypothesis** - Loop of: restart → test → fail → add logging → restart → test → fail
4. **Assumed code was broken** - Didn't consider environment state as the cause
5. **No isolation** - Never tried reproducing in a clean state

### The Anti-Pattern
```
restart server → test → 500 error → add logging → restart →
test → 500 error → add more logging → restart → test →
500 error → try file logging → restart → give up → revert everything
```

25 minutes of iteration with zero progress toward root cause.

### Impact
- Entire session spent debugging, nothing shipped
- All changes reverted (wasted work)
- Same issue likely to recur without understanding why

### Prevention
Before ANY iterative debugging, answer:

| Question | Purpose |
|----------|---------|
| When did this last work? | Establish baseline |
| What changed since then? | Narrow the search |
| Can I reproduce in isolation? | Confirm it's real |

If you can't answer these: **stop debugging**. Revert to known-good state, apply changes incrementally.

See: `docs/TROUBLESHOOTING.md#before-you-debug-read-this-first`

### Status
**GUIDANCE ADDED** - Created `docs/TROUBLESHOOTING.md` with debugging methodology as the opening requirement.

---

<!-- Add new entries below this line -->
