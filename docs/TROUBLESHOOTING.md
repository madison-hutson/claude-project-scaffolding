# Troubleshooting

## Before You Debug (Read This First)

**Stop.** Before adding logging, restarting servers, or trying random fixes:

### The Three Questions

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | **When did this last work?** | Establishes a known-good baseline |
| 2 | **What changed since then?** | Narrows the search space |
| 3 | **Can I reproduce in isolation?** | Confirms it's not environmental noise |

### If You Can't Answer These

Don't start iterating. Instead:

1. **Find the last known working state** (git log, deployment history, "it worked yesterday")
2. **Revert to that state** and verify it still works
3. **Apply changes incrementally** until it breaks
4. **Now you know what changed**

### The Anti-Pattern

```
❌ restart server → test → 500 error → add logging → restart →
   test → 500 error → add more logging → restart → test →
   500 error → try different approach → restart → give up
```

This burns 25+ minutes without hypothesis. The fix was probably in the first thing that changed.

### The Pattern

```
✅ "When did this work?" → Yesterday
   "What changed?" → git diff shows config change
   "Does reverting fix it?" → Yes
   "Root cause:" → Config change broke X
   Time: 3 minutes
```

---

## Clean Slate First

Before deep debugging, try a clean restart:

1. **Kill ALL related processes** (not just the one you started)
2. **Verify resources are free** (ports, file locks, connections)
3. **Fresh restart** with known-good startup sequence
4. **Test the actual functionality** (not just health checks)

If this fixes it: **still document what happened**. You don't have root cause, but you have symptoms and a workaround. Patterns emerge over time.

> "Kill everything and restart" should be step 3, not step 47.

---

## Prediction Protocol

**Make beliefs pay rent in anticipated experiences.**

Before every action that could fail, write out your prediction. After, compare to reality. This catches reasoning errors before they compound.

### Before Action

```
DOING: [action you're about to take]
EXPECT: [specific predicted outcome]
IF YES: [what you'll conclude, next action]
IF NO: [what you'll conclude, next action]
```

### After Action

```
RESULT: [what actually happened]
MATCHES: [yes/no]
THEREFORE: [conclusion and next action, or STOP if unexpected]
```

### Example

```
DOING: Adding PreCompact hook to inject reminder
EXPECT: Reminder visible in context after compaction
IF YES: Hook works, add to BOOTSTRAP.md
IF NO: Hook timing is wrong, try different hook

RESULT: Reminder was compacted away with everything else
MATCHES: No
THEREFORE: STOP. PreCompact fires BEFORE compaction. Need SessionStart instead.
```

### Why This Matters

Without explicit predictions:
- You're just running commands and hoping
- Failures don't update your mental model
- You repeat the same mistakes

With predictions:
- You catch yourself being wrong before it costs hours
- Each failure teaches you something specific
- Your reasoning is visible and reviewable

> Skip this and you're flailing. Do this and you're debugging.

---

## Quick Diagnosis Checklist

Before diving deep, check these common causes:

- [ ] Are all required servers running? (`docs/DEV_ENVIRONMENT.md`)
- [ ] Are servers on the correct ports?
- [ ] Did a recent code change break something? (`git diff`, `git log`)
- [ ] Are environment variables set correctly? (`.env`)
- [ ] Did dependencies change? (`package-lock.json`, `requirements.txt`)
- [ ] Is the database accessible and migrated?
- [ ] Are external services (APIs, auth) available?

---

## Multi-Service Debugging

When a request passes through multiple services, **debug the path, not the endpoint**.

### The Anti-Pattern

```
Request fails at final service → spend 25 minutes debugging that service
→ discover the proxy layer was misconfigured all along
```

### The Pattern

1. **Map the hops** (document in `docs/DEV_ENVIRONMENT.md`):
   ```
   Client → [Proxy?] → [API Gateway?] → Backend → [Service?] → [DB?]
   ```

2. **Test each hop directly** (start from the end):
   ```bash
   curl localhost:[service-port]/endpoint      # Direct to service
   curl localhost:[backend-port]/api/endpoint  # Direct to backend
   curl localhost:[frontend-port]/api/endpoint # Through proxy
   ```

3. **Find where it breaks:**

   | Works at | Fails at | Problem is in |
   |----------|----------|---------------|
   | Service | Backend | Backend → Service connection |
   | Backend | Frontend | Proxy configuration |
   | Nowhere | Nowhere | Service itself |

4. **Then debug that specific layer**

This prevents the "debug the last thing in the chain" trap.

---

## Known Issues

<!-- Add issues as you encounter them. Format: Symptom → Cause → Fix -->

### Template

```markdown
### [Short Description]

**Symptom:** What you observe (error message, behavior)

**Cause:** Why it happens

**Fix:**
1. Step one
2. Step two

**Prevention:** How to avoid this in the future
```

---

### Example: API Returns HTML Instead of JSON

**Symptom:** `SyntaxError: Unexpected token '<'` when parsing API response

**Cause:** Request went to wrong server (usually frontend returning index.html for unknown routes)

**Fix:**
1. Check that backend is running on expected port
2. Verify Vite proxy config in `vite.config.ts` matches backend port
3. Check browser Network tab—is the request going to the right URL?

**Prevention:** Document port assignments in `docs/DEV_ENVIRONMENT.md`

---

### Example: "EADDRINUSE" Port Already in Use

**Symptom:** Server fails to start with `EADDRINUSE: address already in use :::3000`

**Cause:** Another process is using that port (often a zombie process from crashed server)

**Fix:**
```bash
# Find what's using the port
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Unix
lsof -i :3000
kill -9 <pid>
```

**Prevention:** Use the startup script which checks for port conflicts

---

### Example: Tests Pass Locally, Fail in CI

**Symptom:** All green locally, red in GitHub Actions

**Cause:** Usually environment differences:
- Different Node/Python version
- Missing environment variables
- Database state differences
- Timing/race conditions masked by faster local machine

**Fix:**
1. Check CI logs for the actual error (not just "test failed")
2. Compare local env to CI env (versions, env vars)
3. Run with CI's exact versions locally if possible

**Prevention:** Pin versions in CI config; use `.nvmrc` / `pyproject.toml`

---

### API Property "Doesn't Exist" (But Actually Does)

**Symptom:** API returns `"Property 'Foo' doesn't exist on Entity"` but you expected it to work

**Cause:** APIs often use inconsistent casing. Common patterns:
- `InActive` instead of `Inactive`
- `JobNum` instead of `JobNumber`
- `CustID` instead of `CustomerID` or `customerId`

**Fix:**
1. Check the actual schema: `GET /odata/v2/EntityName/$metadata`
2. Try common variations: `Inactive`, `InActive`, `inactive`, `INACTIVE`
3. Look at working queries that use similar properties
4. Check API documentation for exact property names

**Prevention:**
- Use prediction protocol before assuming "doesn't exist":
  ```
  DOING: Remove filter because API says property doesn't exist
  EXPECT: Query works without filter
  IF NO: Property might be named differently - check casing variations
  ```
- Hypothesis first: "Could it be named differently?" before "It doesn't exist"

---

### When Multiple Fixes Fail

If you've tried 2+ fixes and the problem persists:

1. STOP making changes
2. Run `git diff HEAD` to see all your modifications
3. Consider `git checkout HEAD -- <file>` to revert
4. Re-read the original error message
5. Ask: "Am I fixing the right thing?"

The fastest path forward is often reverting to known-good state.

---

<!-- Add new issues above this line -->

## When to Escalate

If you've:
- [ ] Answered the three questions
- [ ] Checked the quick diagnosis list
- [ ] Searched this document
- [ ] Tried reverting to known-good state

And it's still broken: **document what you tried** and ask for help. The documentation will save the next person (or future Claude) the same debugging time.

---

*This is a living document. Add issues as you encounter them.*
