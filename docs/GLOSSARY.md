# Glossary

Terminology used in this scaffolding and AI-assisted development workflows.

---

## Time & Execution Units

| Term | Definition | Duration | Example |
|------|------------|----------|---------|
| **Session** | Human at keyboard, working with AI | Hours | "This session we're fixing the auth bugs" |
| **Burst** | AI executing a single prompt to completion or checkpoint | Minutes to ~1 hour | "That burst touched 8 files" |
| **Context** | Claude's working memory window (resets on compaction) | Variable | "We're nearing context limits" |
| **Checkpoint** | Git commit - permanent, survives everything | Instant | "Checkpoint before starting new feature" |

### The Hierarchy

```
Session (hours)
  └── Burst (minutes)
       └── Context (variable, may reset mid-burst)
            └── Checkpoint (permanent)
```

### Why "Burst"?

- **Sprint** = Humans working in coordinated cycles over days/weeks
- **Burst** = AI executing at machine speed for minutes

Sprints have ceremonies, planning, retrospectives. Bursts are raw execution — start, go fast, checkpoint, stop.

A burst should be short and contained. A 45-minute burst that modifies 12 files without a checkpoint isn't a burst — it's a runaway process.

---

## Quality & Enforcement

| Term | Definition |
|------|------------|
| **Quality gates** | Pre-commit checks that block bad code (typecheck, lint, tests, file length) |
| **Drift detection** | Inventory tests that fail when code doesn't match documented inventories |
| **Protected file** | File that requires human approval to modify (e.g., CLAUDE.md) |
| **Compaction** | Context window reset where conversation history is summarized |

---

## Documentation Types

| Term | Definition |
|------|------------|
| **Append-only** | Document where entries are only added, never modified (e.g., LESSONS-LEARNED.md) |
| **Inventory** | JSON file listing what exists in codebase (endpoints, components, modules) |
| **Decision record** | Entry in DECISIONS.md explaining why a choice was made |

---

## Workflow Patterns

| Term | Definition |
|------|------------|
| **Checkpoint discipline** | Committing before starting new features (Rule 12) |
| **The Three Questions** | Debugging methodology: When did it work? What changed? Can I reproduce? |
| **Clean slate** | Kill all processes, verify resources free, fresh restart |
| **Debug the path** | Trace request through all hops before debugging final endpoint |

---

## Anti-Patterns

| Term | Definition |
|------|------------|
| **Assertion widening** | Making tests pass by accepting more outcomes instead of fixing the issue |
| **Metric gaming** | Hitting line limits by extraction without improving architecture |
| **Runaway burst** | Extended AI execution without checkpoints (risk of lost work) |
| **Self-modifying constraints** | AI editing its own rules to bypass inconvenient restrictions |

---

*Last Updated: 2026-01-02*
