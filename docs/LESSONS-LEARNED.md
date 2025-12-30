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

<!-- Add new entries below this line -->
