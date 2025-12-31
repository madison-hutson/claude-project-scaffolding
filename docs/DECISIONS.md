# Architecture Decision Records

This document captures significant technical decisions, the alternatives considered, and the rationale behind each choice.

> **Why this matters:** Code shows *what* was built. This shows *why* it was built that way. Future developers (including Claude) need this context to avoid re-litigating settled decisions or breaking assumptions.

---

## Template

```markdown
## [Decision Title]

**Date:** YYYY-MM-DD
**Status:** Accepted | Superseded | Deprecated

### Decision
[What we chose - one sentence]

### Context
[What problem prompted this decision?]

### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Option A | ... | ... |
| Option B | ... | ... |

### Rationale
[Why this choice wins over alternatives]

### Trade-offs
[What we accept by making this choice]

### Production Path (if applicable)
[If this is MVP/simplified, what would production need?]
```

---

## Scaffolding Decisions

These document why the scaffolding works the way it does.

---

### File Length Limit: 300 Lines with Exclude-List Enforcement

**Date:** 2025-12-30
**Status:** Accepted

#### Decision
Enforce 300-line limit via recursive scan with exclude-list (`IGNORE_PATTERNS`), not include-list (`CHECK_DIRS`).

#### Context
Need to prevent "god files" while ensuring new directories are automatically covered.

#### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| No limit | No friction | God files emerge, unmaintainable |
| 500-line limit | More permissive | Doesn't force architectural thinking |
| Include-list (`CHECK_DIRS`) | Explicit control | New directories silently ignored |
| **Exclude-list (chosen)** | Auto-covers new dirs | Must maintain ignore list |

#### Rationale
- 300 is small enough to force splits, large enough for real logic
- Exclude-list automatically covers new directories (learned the hard way)
- Forces modular architecture decisions, not just code extraction

#### Trade-offs
- Some files feel artificially constrained
- Splits can create indirection if done poorly

---

### LESSONS-LEARNED: Append-Only, Never Split

**Date:** 2025-12-30
**Status:** Accepted

#### Decision
LESSONS-LEARNED.md is append-only. Never edit existing entries, never split the file.

#### Context
Need to capture mistakes in a way that's searchable and preserves original context.

#### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Wiki-style (edit/refine) | Entries improve over time | Original context lost |
| Split by category | Organized | Defeats "searchable history" goal |
| Split by year | Manageable size | Breaks continuity |
| **Append-only (chosen)** | Single searchable history | File grows indefinitely |

#### Rationale
- Single searchable history is the point
- Editing risks losing original context and nuance
- "Never split" removes decision fatigue

#### Trade-offs
- File grows indefinitely (acceptable for text)
- Old entries may become irrelevant (but still valuable as history)

---

### CLAUDE.md: Rules, Not Context

**Date:** 2025-12-30
**Status:** Accepted

#### Decision
CLAUDE.md contains strict rules only, not general context or documentation. Must remain extremely short.

#### Context
Claude's attention is finite. Long documents get skimmed or ignored.

#### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Comprehensive context doc | One-stop-shop | Too long, gets ignored |
| Combined rules + context | Convenient | Rules buried in prose |
| **Rules only (chosen)** | Short, enforceable | Requires reading multiple files |

#### Rationale
- Claude ignores long documents; short rules are more likely followed
- Detailed explanations belong in referenced files
- Enforcement > documentation

#### Trade-offs
- New users must read multiple files to get full context
- Less "one-stop-shop" feel

---

### Quality Gates: Automated Enforcement, Not Advisory

**Date:** 2025-12-30
**Status:** Accepted

#### Decision
All quality rules are enforced via pre-commit hooks and CI, not just documented as guidelines.

#### Context
Documentation-only rules get ignored, especially by AI agents under time pressure.

#### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Guidelines only | Flexible, no friction | Rules drift, get ignored |
| CI-only enforcement | Catches on push | Late feedback, context switch |
| **Pre-commit + CI (chosen)** | Immediate + backup | Requires setup |

#### Rationale
- "Green tests tunnel vision" - Claude rushes to commit when tests pass
- Pre-commit catches issues immediately, before commit message is written
- CI provides backup enforcement and visibility

#### Trade-offs
- Initial setup friction
- Occasional false positives require investigation

---

### Inventory-Based Drift Detection

**Date:** 2025-12-30
**Status:** Accepted

#### Decision
Track components/endpoints in JSON inventory files. Tests fail if code doesn't match inventory.

#### Context
Need to catch "I added a feature but forgot to test/document it" scenarios.

#### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Trust developers to update docs | No overhead | Drift happens silently |
| Auto-generate from code | Always accurate | Loses intentionality, descriptions |
| **Manual inventory + tests (chosen)** | Explicit, verified | Requires maintenance |

#### Rationale
- Forces explicit acknowledgment of new code
- Descriptions capture intent, not just existence
- Test failures are impossible to ignore

#### Trade-offs
- Manual updates required for every change
- Count mismatches can be confusing (improved with type validation)

---

## Project Decisions

<!-- Add your project-specific architectural decisions below -->

---

## Superseded Decisions

Decisions that were later changed. Keep these for historical context.

<!-- Example:
### [Old Decision] → Superseded by [New Decision]

**Original Date:** YYYY-MM-DD
**Superseded:** YYYY-MM-DD

[Brief explanation of why the decision changed]
-->
