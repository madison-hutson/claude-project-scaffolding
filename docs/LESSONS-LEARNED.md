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

<!-- Add new entries below this line -->
