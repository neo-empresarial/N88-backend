# AGENTS.md — N88-backend (MatrUFSC)

NestJS 10 REST API — TypeScript, TypeORM, PostgreSQL, Passport/JWT auth.

---

## Build & Dev Commands

```bash
npm run build          # Compile via NestJS CLI → dist/
npm run start          # Run compiled app
npm run start:dev      # Watch mode (preferred for local dev)
npm run start:prod     # Run dist/main.js
```

---

## Lint & Format

```bash
npm run lint           # ESLint with --fix across src/, apps/, libs/, test/
npm run format         # Prettier --write across src/**/*.ts and test/**/*.ts
```

ESLint config (`.eslintrc.js`):

- Parser: `@typescript-eslint/parser`
- Extends: `plugin:@typescript-eslint/recommended`, `plugin:prettier/recommended`
- `@typescript-eslint/no-explicit-any`: **off** (any is allowed)
- `@typescript-eslint/explicit-function-return-type`: **off**
- `@typescript-eslint/explicit-module-boundary-types`: **off**

Prettier config (`.prettierrc`):

- `singleQuote: true`
- `trailingComma: "all"`

---

## Test Commands

```bash
npm test                                      # Run all unit tests (jest)
npm run test:watch                            # Watch mode
npm run test:cov                              # Coverage report → coverage/
npm run test:e2e                              # E2E tests (test/jest-e2e.json)
npm run test:debug                            # Debug mode with --runInBand

# Run a single test file
npx jest src/auth/auth.service.spec.ts

# Run a single test by name
npx jest --testNamePattern="should be defined"

# Run tests matching a pattern
npx jest src/users/

# Run with verbose output
npx jest --verbose src/auth/auth.service.spec.ts
```

Test config (in `package.json`):

- `rootDir: src`
- `testRegex: .*\.spec\.ts$`
- Transform via `ts-jest`
- Environment: `node`
- Test files live **next to source files** as `*.spec.ts`

---

## Database / Migrations

```bash
npm run migration:run         # Run pending migrations (TypeORM CLI)
npm run migration:generate    # Generate a new migration (pass --name=<name>)
npm run migration:create      # Create empty migration file
npm run migration:revert      # Revert last migration
```

TypeORM config: `src/config/typeorm.config.ts`  
CLI entry: `src/typeorm-cli.ts`

---

## Architecture & Module Structure

```
src/
  app.module.ts              # Root module (includes SemestersModule)
  main.ts                    # Bootstrap (port 8000, 10MB limit, CORS, ValidationPipe)
  auth/                      # Auth module (JWT, Google OAuth, local strategy)
    dto/                     # LoginDto, RegisterDto, RefreshTokensDto
    entities/                # RefreshToken entity
    guards/                  # JwtAuthGuard, GoogleAuthGuard, JwtRefreshAuthGuard
    strategies/              # local, jwt, jwt-refresh, google
  users/                     # Users module (CRUD)
    dto/                     # CreateUsersDto, UpdateUsersDto
    savedschedules/          # Saved schedule sub-resource (with total_credits, credits per item)
    friends/                 # Friends sub-resource
  courses/                   # Courses module (referenced on registration)
  groups/                    # Groups module
  subjects/                  # Subjects module (with semester FK, pedidos_sem_vaga column)
    dto/                     # CreateSubjectsDto (with semester, pedidos_sem_vaga)
    classes/                 # Classes sub-entity
    schedules/               # Schedules sub-entity
    professors/              # Professors sub-entity
  semesters/                 # Semesters module (NEW - manages semester catalog)
    dto/                     # CreateSemestersDto
  notifications/             # Notifications module
  feedback/                  # Feedback module
  config/                    # typeorm.config.ts (with logging), google-oauth.config.ts
  migrations/                # TypeORM migration files (includes semester and schema migrations)
  types/                     # Shared type declarations
```

---

## 🆕 New Features & Major Updates (v2.1.0)

### 🗓️ Multi-Semester Support
- **Semesters Entity**: New `/semesters` module manages semester catalog
- **Subject-Semester Relationship**: Subjects now link to specific semesters via FK
- **Composite Unique Constraint**: `(code, semester_id)` prevents duplicates per semester
- **API Versioning**: Subjects API now requires `semester` field in requests

### 📊 Order History Integration  
- **Simplified Schema**: `pedidos_sem_vaga` integer column on subjects table
- **No Separate Table**: Eliminated complex `order_history_no_vacancies` table
- **Per-Subject Updates**: Individual PATCH `/subjects/by-code/{code}` for scalability
- **Smart Merging**: Backend updates existing subjects (same ID) instead of creating duplicates

### 🚀 Performance & Scalability Improvements
- **10MB Request Limit**: Handles large scraped datasets without 413 errors
- **Individual Updates**: Eliminates batch operation size limitations  
- **Better Query Performance**: No JOINs needed for order history data
- **Database Constraint Fixes**: Proper unique constraints match business logic

### 🔧 Developer Experience Enhancements
- **TypeORM Logging**: Enhanced debugging with query and error logging
- **Route Ordering**: Fixed API route precedence for proper endpoint resolution
- **Migration Data Safety**: All schema changes preserve existing data
- **Backward Compatibility**: Legacy API calls continue to work

---

## Code Style Guidelines

### Imports

- Use **path aliases**: `src/users/users.service` (NOT relative `../../users/...`)
- Group: NestJS framework → third-party → internal project files
- No barrel (`index.ts`) files observed — import directly from source files

```typescript
// Correct
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

// Incorrect
import { UsersService } from '../../users/users.service';
```

### TypeScript

- Target: **ES2022**, module: **nodenext**, moduleResolution: **nodenext**
- `strictNullChecks: false` — null checks are NOT enforced by the compiler
- `noImplicitAny: false` — implicit `any` allowed (but avoid it where semantics matter)
- `emitDecoratorMetadata: true` and `experimentalDecorators: true` — required by NestJS DI
- **Never** use `@ts-ignore` or `@ts-expect-error`
- Return types on methods are optional (rule is off), but prefer explicit types on public service methods

### Naming Conventions

| Construct          | Convention                      | Example                                      |
| ------------------ | ------------------------------- | -------------------------------------------- |
| Classes            | PascalCase                      | `AuthService`, `UsersController`             |
| Files              | kebab-case                      | `auth.service.ts`, `refresh-token.entity.ts` |
| Methods/properties | camelCase                       | `findOneByEmail`, `refreshTokens`            |
| DTOs               | PascalCase + `Dto` suffix       | `CreateUsersDto`, `RegisterDto`              |
| Entities           | PascalCase (singular or plural) | `Users`, `RefreshToken`, `Courses`           |
| Guards             | PascalCase + `Guard` suffix     | `JwtAuthGuard`, `GoogleAuthGuard`            |
| Strategies         | PascalCase + `Strategy` suffix  | `LocalStrategy`, `JwtStrategy`               |
| Interfaces         | PascalCase (no `I` prefix)      | `AuthPayload`                                |
| Env vars           | SCREAMING_SNAKE_CASE            | `JWT_ACCESS_TOKEN_SECRET`                    |

### NestJS Patterns

- **Modules**: One module file per feature folder; use `forwardRef()` only to break circular dependencies
- **Controllers**: Thin — delegate all logic to services; use `@UseGuards()` per-route
- **Services**: All business logic here; inject repositories via `@InjectRepository()`
- **Guards**: Use `JwtAuthGuard` (imported from `src/auth/guards/local-auth.guard`) on protected routes
- **DTOs**: Use `class-validator` decorators (`@IsString()`, `@IsEmail()`, etc.) for all request bodies
- **Entities**: Use TypeORM decorators (`@Entity()`, `@Column()`, `@PrimaryGeneratedColumn()`, `@OneToMany()`, etc.)
- **ValidationPipe** is global with `transform: true` and `whitelist: true`

### Error Handling

- Throw NestJS built-in HTTP exceptions from services:
  - `NotFoundException` — resource not found
  - `UnauthorizedException` — auth failures
  - `BadRequestException` — invalid input
  - `ConflictException` — duplicate resource
- Do NOT return raw error objects — always throw exceptions
- `console.log` is used in some services for debugging; keep but don't proliferate

```typescript
// Correct
if (!user) throw new NotFoundException(`User with id ${id} not found`);

// Incorrect — don't return error objects
if (!user) return { error: 'Not found' };
```

### Environment Variables

All secrets come from `process.env` — no `ConfigService` wrapper for most values:

- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_SECRET`
- `SESSION_SECRET_KEY`
- `NODE_ENV` (controls `secure` cookie flag and `sameSite` policy)
- `NEXT_PUBLIC_FRONTEND_URL`

Google OAuth config uses `@nestjs/config` with `ConfigModule.forFeature()` — see `src/config/google-oauth.config.ts`.

### Auth Flow

- Access token: JWT, 3-minute expiry, sent as `access_token` httpOnly cookie
- Refresh token: JWT, 7-day expiry, stored in DB (`RefreshToken` entity), sent as `refresh_token` httpOnly cookie
- Google OAuth: redirects to frontend after login, sets session + token cookies
- Protected routes use `@UseGuards(JwtAuthGuard)` (which wraps `passport-jwt`)

---

## 🔗 API Endpoints

### Core Subjects API
```bash
# Create/update subject with semester
POST /subjects
Content-Type: application/json
X-Api-Key: your-api-key

{
  "code": "MTM7174",
  "name": "Cálculo I", 
  "semester": "2026.1",
  "pedidos_sem_vaga": 25,
  "classes": [...]
}
```

### Order History Updates
```bash
# Update order history for specific subject
PATCH /subjects/by-code/MTM7174
Content-Type: application/json
X-Api-Key: your-api-key

{
  "pedidos_sem_vaga": 30
}
```

### Semesters Management
```bash
# List all semesters
GET /semesters

# Get specific semester
GET /semesters/1

# Create semester (auto-created by subjects posting)
POST /semesters
{
  "semester": "2026.1"
}
```

### Smart Subject Merging
When posting a subject that already exists (same `code` + `semester_id`):
- ✅ **Preserves existing database ID** (no orphaned records)
- ✅ **Merges classes intelligently** (adds new classes, keeps existing ones)
- ✅ **Updates order history** (`pedidos_sem_vaga` reflects latest value)
- ✅ **No data loss** (existing schedules/professors preserved)

---

## Key Dependencies

| Package                                                                            | Purpose                                          |
| ---------------------------------------------------------------------------------- | ------------------------------------------------ |
| `@nestjs/typeorm` + `typeorm` + `pg`                                               | PostgreSQL ORM                                   |
| `@nestjs/passport` + `passport-jwt` + `passport-local` + `passport-google-oauth20` | Auth strategies                                  |
| `@nestjs/jwt` + `jsonwebtoken`                                                     | JWT signing/verification                         |
| `bcrypt`                                                                           | Password hashing                                 |
| `class-validator` + `class-transformer`                                            | DTO validation                                   |
| `cookie-parser`                                                                    | Cookie reading in Express                        |
| `jose`                                                                             | Used for session JWT signing (Google OAuth flow) |
| `uuid`                                                                             | UUID generation                                  |
