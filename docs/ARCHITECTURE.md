# Architecture

## Project Overview

<!-- Brief description of what this project does -->
[Project Name] is a [type of application] that [primary purpose/functionality].

**Owner:** [Company/Team Name]

## Tech Stack

- **Frontend:** [Framework + Language, Build Tool]
- **Backend:** [Framework/Runtime (port)]
- **Database:** [Database + ORM]
- **Other:** [Additional technologies]

## Application Modes/Features

<!-- If your app has distinct modes or feature areas, document them here -->
| Mode/Feature | Purpose | Required Fields |
|--------------|---------|-----------------|
| [Mode 1] | [Description] | [Fields] |
| [Mode 2] | [Description] | [Fields] |

## Directory Structure

```
/
├── [entry_file]            # Main entry point
├── [server_file]           # Backend server (if applicable)
├── [components/]           # UI components
│   ├── [feature1]/         # Feature-specific components
│   ├── [feature2]/         # Feature-specific components
│   └── common/             # Shared components
├── hooks/                  # Custom hooks/utilities
├── services/               # External service integrations
├── utils/                  # Utility functions
├── types/                  # Type definitions
├── [database/]             # Database schema/migrations
├── docs/                   # Documentation
└── tasks/                  # Task tracking
```

## Data Sources

### Primary Data Source
<!-- Document where your authoritative data comes from -->
| Data | Service/Source | Notes |
|------|----------------|-------|
| [Data Type 1] | [Source] | [Description] |
| [Data Type 2] | [Source] | [Description] |

### Local Database
<!-- Document what data you store locally -->
| Table/Collection | Purpose |
|------------------|---------|
| [Table 1] | [Description] |
| [Table 2] | [Description] |

### External Storage
<!-- Document any external file storage, network drives, etc. -->
[Path/Location]: [Description of what's stored there]

## API Endpoints

### [Category 1] (`/api/[category]/`)
- `GET /endpoint1` - [Description]
- `POST /endpoint2` - [Description]
- `GET /endpoint3/:param` - [Description]

### [Category 2] (`/api/[category]/`)
- `GET /endpoint1` - [Description]
- `POST /endpoint2` - [Description]

## Key Patterns

### [Pattern 1 Name]
<!-- Document reusable patterns in your codebase -->
```
[Code example or description]
```

### [Pattern 2 Name]
```
[Code example or description]
```

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `[VAR_1]` | [Description] | Yes/No |
| `[VAR_2]` | [Description] | Yes/No |

---

*Last Updated: [Date]*