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

## Decisions

### State Management: [Your Choice]

**Date:** [DATE]
**Status:** Accepted

#### Decision
Use [Zustand/Redux/Context/etc.] for application state management.

#### Context
[What state management needs exist in this project?]

#### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| Redux Toolkit | Battle-tested, devtools, middleware | Boilerplate, learning curve |
| React Context | Built-in, simple | Re-render issues at scale |
| Zustand | Minimal API, no boilerplate | Less ecosystem |
| Jotai/Recoil | Atomic updates, fine-grained | Newer, less documented |

#### Rationale
[Why this choice?]

#### Trade-offs
[What limitations do we accept?]

#### Production Path
[Would this change at scale? How?]

---

### Database: [Your Choice]

**Date:** [DATE]
**Status:** Accepted

#### Decision
Use [PostgreSQL/SQLite/MongoDB/etc.] for data persistence.

#### Context
[What data persistence needs exist?]

#### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| PostgreSQL | ACID, relational, scalable | Requires server |
| SQLite | Zero config, embedded | Single writer, no network |
| MongoDB | Flexible schema, horizontal scale | No joins, eventual consistency |

#### Rationale
[Why this choice?]

#### Trade-offs
[What limitations do we accept?]

---

### API Style: [Your Choice]

**Date:** [DATE]
**Status:** Accepted

#### Decision
Use [REST/GraphQL/tRPC/etc.] for client-server communication.

#### Context
[What API needs exist?]

#### Alternatives Considered
| Option | Pros | Cons |
|--------|------|------|
| REST | Simple, cacheable, universal | Over/under-fetching |
| GraphQL | Flexible queries, typed | Complexity, caching harder |
| tRPC | End-to-end type safety | TypeScript-only, coupled |

#### Rationale
[Why this choice?]

#### Trade-offs
[What limitations do we accept?]

---

<!-- Add new decisions above this line -->

## Superseded Decisions

Decisions that were later changed. Keep these for historical context.

<!-- Example:
### [Old Decision] → Superseded by [New Decision]

**Original Date:** YYYY-MM-DD
**Superseded:** YYYY-MM-DD

[Brief explanation of why the decision changed]
-->
