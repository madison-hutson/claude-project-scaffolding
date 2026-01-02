# Development Environment

This document captures the runtime environment: what servers run, on what ports, in what order, and how to verify they're healthy.

---

## Servers

<!-- Fill in for your project -->

| Server | Port | Start Command | Health Check | Notes |
|--------|------|---------------|--------------|-------|
| Backend | 3000 | `npm run server` | `curl localhost:3000/health` | Must start before frontend |
| Frontend | 5173 | `npm run dev` | Browser opens | Proxies /api/* to backend |
| [Service] | [Port] | [Command] | [Check] | [Notes] |

## Startup Order

Order matters when services depend on each other.

```
1. [First service] - [why it must be first, e.g., "model load takes 30s"]
2. [Second service] - [dependencies]
3. [Third service] - [dependencies]
```

### Quick Start

```bash
# Terminal 1
[first service command]

# Terminal 2 (after Terminal 1 shows "ready")
[second service command]

# Terminal 3
[third service command]
```

Or use the startup script:

```bash
./scripts/start-servers.ps1   # Windows
./scripts/start-servers.sh    # Unix
```

---

## Port Architecture

```
┌─────────────────────────────────────────────────────┐
│ Browser (localhost:5173)                            │
│   ↓                                                 │
│ Frontend (Vite) ──proxy──→ Backend (Express:3000)   │
│                               ↓                     │
│                            [Database/Services]      │
└─────────────────────────────────────────────────────┘
```

### Port Assignments

| Port | Service | Protocol | Notes |
|------|---------|----------|-------|
| 3000 | Backend API | HTTP | Primary API server |
| 5173 | Frontend dev | HTTP | Vite default |
| [Port] | [Service] | [Protocol] | [Notes] |

**Rule:** Never reuse ports. If you add a service, pick an unused port and document it here.

---

## Environment Variables

### Required

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | Database connection | `postgresql://...` |
| `[VAR]` | [Purpose] | [Example] |

### Optional

| Variable | Purpose | Default |
|----------|---------|---------|
| `PORT` | Backend port override | `3000` |
| `[VAR]` | [Purpose] | [Default] |

### Local Setup

```bash
# Copy template
cp .env.example .env

# Edit with your values
# Never commit .env to git
```

---

## Health Checks

Run these to verify the environment is working:

```bash
# Backend health
curl http://localhost:3000/health
# Expected: {"status":"ok"} or 200 response

# Frontend
# Open http://localhost:5173 in browser
# Expected: App loads without console errors

# [Service] health
[health check command]
# Expected: [expected response]
```

### All-in-One Check

```bash
npm run health-check   # If you create this script
```

### Health Check vs Functional Check

> **Warning:** A passing health check doesn't mean the service works.

Health endpoints often only verify "process is running"—not that the service can actually do its job. For critical services:

| Check Type | What It Tests | Example |
|------------|---------------|---------|
| Health check | Process alive, dependencies connected | `/health` returns 200 |
| Functional check | Actual capability works | `/ocr` processes a test image |

**Startup scripts should test functional endpoints**, not just health endpoints. A service with a loaded model that can't process requests is broken, even if `/health` returns OK.

---

## Common Environment Issues

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `EADDRINUSE` | Port already in use | Kill process on that port or change port |
| API returns HTML | Wrong server responding (port mismatch) | Check proxy config, verify correct port |
| `ECONNREFUSED` | Service not running | Start the service |
| CORS errors | Frontend/backend port mismatch | Check Vite proxy config |
| "Model not loaded" | Service started but not ready | Wait for ready message, check logs |

See `docs/TROUBLESHOOTING.md` for detailed resolution steps.

---

## IDE Setup

### VS Code

Recommended extensions:
- [List relevant extensions]

Workspace settings (`.vscode/settings.json`):
```json
{
  // Project-specific settings
}
```

### Other IDEs

[Add setup instructions as needed]

---

*Last Updated: [Date]*
