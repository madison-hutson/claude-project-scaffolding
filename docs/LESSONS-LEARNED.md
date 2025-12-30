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
Current state (FIXED, REVERTED, WORKAROUND, etc.)
```

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
3. If the real fix is too big, document it explicitly in ROADMAP.md
4. Never treat extractions as "done" - they're documented workarounds

See: `docs/CONTRIBUTING.md#splits-must-improve-architecture`

### Status
**GUIDANCE ADDED** - New section in CONTRIBUTING.md clarifies that splits must improve architecture, not just reduce line count.

---

<!-- Add new entries below this line -->
