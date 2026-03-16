# N88-backend — MatrUFSC API

## Stack

| Layer       | Technology                                                              |
|-------------|-------------------------------------------------------------------------|
| Framework   | NestJS 10 (Express)                                                     |
| Language    | TypeScript 5 (ES2022)                                                   |
| Database    | PostgreSQL + TypeORM 0.3                                                |
| Auth        | Passport.js — local, JWT, JWT-refresh, Google OAuth 2.0                |
| Validation  | class-validator + class-transformer (global `ValidationPipe`)           |
| Deployment  | Vercel (`vercel.json` with `@vercel/node`)                              |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance (local or remote)

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=n88

# Auth
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
SESSION_SECRET_KEY=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback

# App
NODE_ENV=development
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Scraper API key (for the /subjects POST endpoint)
API_KEY=your_api_key
```

### Run

```bash
npm run start:dev     # Development (watch mode) — http://localhost:8000
npm run build         # Compile to dist/
npm run start:prod    # Run compiled output
```

---

## Database Migrations

```bash
npm run migration:run                             # Apply all pending migrations
npm run migration:generate -- --name=MyMigration  # Generate migration from entity diff
npm run migration:create -- --name=MyMigration    # Create empty migration file
npm run migration:revert                          # Roll back last migration
```

TypeORM config: `src/config/typeorm.config.ts`

---

## Testing

```bash
npm test                                        # All unit tests
npm run test:watch                              # Watch mode
npm run test:cov                                # Coverage report → coverage/
npm run test:e2e                                # End-to-end tests

# Single test file
npx jest src/auth/auth.service.spec.ts

# Single test by name
npx jest --testNamePattern="should be defined"

# All tests in a folder
npx jest --verbose src/users/
```

Test files live next to their source as `*.spec.ts` (e.g., `auth.service.spec.ts` alongside `auth.service.ts`).

---

## Lint & Format

```bash
npm run lint      # ESLint --fix (src/, apps/, libs/, test/)
npm run format    # Prettier --write (src/**/*.ts, test/**/*.ts)
```

Prettier: `singleQuote: true`, `trailingComma: "all"`.

---

## Architecture

```
src/
  main.ts              # Bootstrap — port 8000, CORS, ValidationPipe, cookie-parser
  app.module.ts        # Root module
  auth/                # Authentication (local, JWT, Google OAuth)
  users/               # User CRUD, saved schedules, shared schedules, friends
  subjects/            # Subjects + class schedules (scraped data)
  courses/             # Courses (referenced at registration)
  groups/              # Study groups
  notifications/       # In-app notifications
  feedback/            # User feedback
  config/              # TypeORM config, Google OAuth config
  migrations/          # TypeORM migration files
  types/               # Shared TypeScript types
```

Each feature is a self-contained NestJS module: one module file, one controller (thin), one service (all business logic), DTOs with `class-validator` decorators, and TypeORM entities.

---

## API Overview

All endpoints are prefixed with the module name (e.g., `/auth`, `/users`, `/subjects`). Protected routes require the `access_token` httpOnly cookie set by login.

### Auth — `/auth`

| Method | Path                    | Auth   | Description                                        |
|--------|-------------------------|--------|----------------------------------------------------|
| POST   | `/auth/register`        | Public | Register with email + password                     |
| POST   | `/auth/login`           | Public | Login — sets `access_token` + `refresh_token` cookies |
| POST   | `/auth/refresh`         | Cookie | Rotate access + refresh tokens                     |
| GET    | `/auth/google/login`    | Public | Redirect to Google OAuth consent screen            |
| GET    | `/auth/google/callback` | Google | OAuth callback — sets session cookie               |

### Users — `/users`

| Method | Path                 | Auth | Description          |
|--------|----------------------|------|----------------------|
| GET    | `/users`             | JWT  | List all users       |
| GET    | `/users/:id`         | JWT  | Get user by ID       |
| PUT    | `/users/:id`         | JWT  | Update user          |
| DELETE | `/users/:id`         | JWT  | Delete user          |
| GET    | `/users/search?q=`   | JWT  | Search users by name |

### Subjects — `/subjects`

| Method | Path                         | Auth    | Description                          |
|--------|------------------------------|---------|--------------------------------------|
| GET    | `/subjects`                  | Public  | List all subjects                    |
| GET    | `/subjects/with-relations`   | Public  | List subjects with classes/schedules |
| GET    | `/subjects/search?name=`     | Public  | Search subjects by name              |
| GET    | `/subjects/by-codes?codes=`  | Public  | Fetch multiple subjects by code list |
| GET    | `/subjects/:id`              | Public  | Get single subject                   |
| POST   | `/subjects`                  | API Key | Create subject (scraper use only)    |
| PATCH  | `/subjects/:id`              | JWT     | Update subject                       |
| DELETE | `/subjects/:id`              | JWT     | Delete subject                       |

### Groups — `/groups`

All group endpoints require JWT authentication.

| Method | Path                          | Description                 |
|--------|-------------------------------|-----------------------------|
| POST   | `/groups`                     | Create a group              |
| GET    | `/groups`                     | List current user's groups  |
| GET    | `/groups/search-users?q=`     | Search users to invite      |
| GET    | `/groups/:id`                 | Get group details           |
| PATCH  | `/groups/:id`                 | Update group                |
| POST   | `/groups/:id/members/:userId` | Add member to group         |

### Saved Schedules — `/saved-schedules`

Saved schedule management and sharing between group members. See [SCHEDULE_SHARING.md](SCHEDULE_SHARING.md) for full sharing flow details.

### Notifications — `/notifications`

In-app notifications for group invites and schedule share events.

---

## Auth Flow

- **Access token**: JWT, 3-minute expiry, delivered as `access_token` httpOnly cookie.
- **Refresh token**: JWT, 7-day expiry, stored in the `RefreshToken` database table and delivered as `refresh_token` httpOnly cookie.
- **Cookie security**: `secure: true` + `sameSite: "none"` in production; `sameSite: "lax"` in development.
- **Google OAuth**: completes at `/auth/google/callback`, sets a signed session cookie via `jose`, then redirects to the frontend.
- **API Key auth**: the scraper POSTs subjects using `X-Api-Key` header — guarded by `ApiKeyGuard`.
