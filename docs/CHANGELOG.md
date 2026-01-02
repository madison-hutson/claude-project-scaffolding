# Changelog

All notable changes to [Project Name] will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project scaffolding
- Documentation structure (CLAUDE.md, docs/, tasks/)
- **Environment documentation:** `docs/DEV_ENVIRONMENT.md` for servers, ports, startup order
- **Troubleshooting guide:** `docs/TROUBLESHOOTING.md` with debugging methodology as opening requirement
- **Debugging methodology sections:** Clean Slate First, Multi-Service Debugging
- **Health check guidance:** Functional checks vs health checks distinction in DEV_ENVIRONMENT.md
- **Rule 13 (Governance):** CLAUDE.md is now a protected file requiring human approval
- **Pre-commit hook:** Blocks CLAUDE.md changes, requires `--no-verify` after human review

### Changed
- **Before Committing Checklist:** Expanded to include all documentation files, organized by category (core, user-facing, technical, learning, planning)

### Fixed
<!-- List bug fixes -->

### Removed
<!-- List removed features/files -->

---

## [0.1.0] - YYYY-MM-DD

### Added
- Initial release
- [Feature 1]
- [Feature 2]
- [Feature 3]

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 0.1.0 | YYYY-MM-DD | Initial release |

---

## Changelog Entry Guidelines

### Entry Format
```markdown
### [Category]
- **[Feature/Area]:** Description of change
  - Sub-detail if needed
  - Another sub-detail
```

### Categories
- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Features to be removed in future
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security-related changes

### Good Entry Examples
```markdown
### Added
- **User Authentication:** JWT-based login with refresh tokens
  - Login endpoint at POST /api/auth/login
  - Token refresh at POST /api/auth/refresh

### Fixed
- **Data Export:** Fixed Excel export failing for large datasets (>10k rows)
```

---

*Last Updated: [Date]*
