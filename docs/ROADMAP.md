# [Project Name] - Product Roadmap

This document outlines the planned features and improvements for [Project Name].
Updated regularly based on user feedback and business requirements.

---

## Recently Completed

### [Feature Name] (YYYY-MM-DD)
- [x] **[Sub-feature description]**
  - [Detail 1]
  - [Detail 2]
  - Status: COMPLETED

---

## Immediate Priorities

### Priority 1: [Feature Name]
- [ ] **[Description of the feature]**
  - [ ] [Sub-task 1]
  - [ ] [Sub-task 2]
  - [ ] [Sub-task 3]

### Priority 2: [Feature Name] (MAJOR)
[Brief description of why this is important]

#### [Sub-section 1]
- [ ] [Task 1]
- [ ] [Task 2]

#### [Sub-section 2]
- [ ] [Task 1]
- [ ] [Task 2]

---

## Priority 3: [Feature Name] (MAJOR)

> **Technical Specification:** See [`docs/[SPEC-FILE].md`](docs/[SPEC-FILE].md)

### Overview
[Brief description of the feature and its purpose]

### Key Components
| Component | Purpose | Approach |
|-----------|---------|----------|
| [Component 1] | [Purpose] | [Approach] |
| [Component 2] | [Purpose] | [Approach] |

### Implementation Phases
- [ ] Phase 1: [Description]
- [ ] Phase 2: [Description]
- [ ] Phase 3: [Description]

---

## Completed Features

### v[X.X.X] - [Feature Name] (YYYY-MM-DD)
- [x] [Feature 1]
- [x] [Feature 2]
- [x] [Feature 3]

### v[X.X.X] - Foundation (YYYY-MM-DD)
- [x] Initial project setup
- [x] Core functionality
- [x] Basic integrations

---

## Planned Features (Lower Priority)

### Phase [X]: [Category Name]
- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [Feature 3]

### Phase [X]: [Category Name]
- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [Feature 3]

---

## Future Considerations

### SessionStart Hook for Post-Compaction Compliance (TESTED)

**Status:** Tested - correct syntax identified

**Problem:** After context compaction, Claude re-reads code files but may not actively re-engage with governance rules. Facts survive compaction but behavioral discipline may drift.

**Solution:** SessionStart hook with `matcher: "compact"` that fires AFTER compaction:

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "compact",
      "hooks": [{
        "type": "command",
        "command": "echo 'IMPORTANT: After compaction, re-read CLAUDE.md and docs/CONTRIBUTING.md before continuing work.'"
      }]
    }]
  }
}
```

**Why PreCompact Didn't Work:** PreCompact fires BEFORE compaction, so the reminder gets compacted away with everything else. SessionStart with `matcher: "compact"` fires AFTER compaction, when the reminder will actually be seen.

**Next Steps:** Add to `docs/BOOTSTRAP.md` as recommended configuration.

**Reference:** `docs/LESSONS-LEARNED.md` - "PreCompact Hook Doesn't Work for Post-Compaction Reminders"

---

### [Category 1]
- [Consideration 1]
- [Consideration 2]

### [Category 2]
- [Consideration 1]
- [Consideration 2]

---

## Technical Debt

### Remaining Refactoring
- [ ] **[Refactor description]**
  - [ ] [Sub-task 1]
  - [ ] [Sub-task 2]

### Code Quality Standards
- **Maximum 300 lines per file** - Split if exceeded
- No magic numbers - use named constants
- Centralized error handling
- See CLAUDE.md for full requirements

### Testing & Quality Automation
> **Goal:** Ensure quality through automation

- [ ] **Automated Test Suite**
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] E2E tests

- [ ] **CI/CD Enforcement**
  - [ ] File length checks
  - [ ] Pre-commit hooks
  - [ ] Linting enforcement
  - [ ] Type checking

---

## Notes

- Priorities may shift based on user feedback
- Features may be split across multiple releases
- Check CLAUDE.md for development guidelines

Last Updated: [Date]
