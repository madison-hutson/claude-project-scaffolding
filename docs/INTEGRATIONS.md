# External Integrations Reference

This document captures lessons learned, problems encountered, and solutions discovered when integrating with external systems.

---

## Section 1: [Integration Name] - Connection Setup

### Overview
Brief description of what this integration does and why it's needed.

### Authentication Method
<!-- Document the authentication approach that works -->
| Method | Status | Notes |
|--------|--------|-------|
| [Method 1] | Failed/Works | [Reason] |
| [Method 2] | Failed/Works | [Reason] |

### What We Tried (And Why It Failed)
<!-- Document failed approaches to prevent repeating mistakes -->

**Attempt 1: [Approach Name]**
```
Code/Config: [Example]
Result: [Error message]
Reason: [Why it failed]
```

**Attempt 2: [Approach Name]**
```
Code/Config: [Example]
Result: [Error message]
Reason: [Why it failed]
```

### The Solution
<!-- Document the working approach -->
```
[Working code/configuration example]
```

### Key Learnings
1. [Learning 1]
2. [Learning 2]
3. [Learning 3]

---

## Section 2: API Formats and Endpoints

### API Version Differences
<!-- If the external system has multiple API versions -->

| Version | URL Pattern | Features | Notes |
|---------|-------------|----------|-------|
| V1 | `/api/v1/...` | [Features] | [Notes] |
| V2 | `/api/v2/...` | [Features] | [Notes] |

### Recommended Methods/Endpoints
<!-- Document the preferred way to interact with the API -->

| Operation | Method | Endpoint | Notes |
|-----------|--------|----------|-------|
| [Operation 1] | GET/POST | `/path` | [Notes] |
| [Operation 2] | GET/POST | `/path` | [Notes] |

---

## Section 3: Access Configuration

### API Key/Credentials Setup
<!-- Document how to set up access -->

**Location:** [Where to configure in external system]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Required Permissions
<!-- Document what permissions/scopes are needed -->

| Permission/Scope | Purpose |
|------------------|---------|
| [Permission 1] | [Why needed] |
| [Permission 2] | [Why needed] |

### User Configuration
<!-- Document user-level requirements -->

Required settings:
1. [Setting 1]
2. [Setting 2]

---

## Section 4: Common Patterns and Best Practices

### [Pattern 1 Name]
```
[Code example]
```

### [Pattern 2 Name]
```
[Code example]
```

---

## Section 5: Debugging Tips

### Diagnosing Connection Issues
1. [Diagnostic step 1]
2. [Diagnostic step 2]
3. [Diagnostic step 3]

### Common Error Codes
| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad request | [Solution] |
| 401 | Authentication failed | [Solution] |
| 403 | Forbidden/No permission | [Solution] |
| 404 | Not found | [Solution] |
| 500 | Server error | [Solution] |

---

## Section 6: Quick Reference

### Environment Variables
```
[INTEGRATION]_BASE_URL=[url]
[INTEGRATION]_API_KEY=[key]
[INTEGRATION]_USERNAME=[user]
[INTEGRATION]_PASSWORD=[pass]
```

### Key Files
| File | Purpose |
|------|---------|
| `[file1]` | [Purpose] |
| `[file2]` | [Purpose] |

### Required Packages
| Package | Purpose |
|---------|---------|
| `[package1]` | [Purpose] |
| `[package2]` | [Purpose] |

---

*Last Updated: [Date]*
