# Next.js Database & Scalability

## 1. Overview
The platform uses **PostgreSQL** driven by **Drizzle ORM**. Our architecture employs a **CQRS (Command Query Responsibility Segregation)** pattern spanning two distinct database hostings:
- **Supabase (Primary):** Handles writes, transactions, auth, and relational integrity.
- **Neon + ParadeDB (Replica):** Handles heavy reads, analytics, and full-text search.

Data is synced from Supabase to Neon in near real-time via PostgreSQL **Foreign Data Wrappers (FDW)** and row-level triggers.

## 2. Key Directories & Schema
- **Schema Source of Truth:** `next/lib/database/schema.ts`
- **Database Client Provider:** The generic `db` instance is injected into handlers via `UnifiedContext` or `ModuleFactory`.

## 3. Architecture & Sharding Patterns

### The "Workspace/Tenant" Rule
Although we are not physically sharding across databases yet, we use **Logical Sharding**. Every entity that belongs to a workspace (e.g., classes, content, members) **MUST** include a `workspaceId`.
- **Foreign Keys**: Always include `ON DELETE CASCADE` where an entity belongs strictly to a parent or workspace to prevent orphaned data.
- **Varchar UUIDs**: Primary keys like `id`, `workspaceId`, and `accountId` are typically `varchar` types representing a UUID or ULID.

### Transaction Safety
Complex operations must start and finish atomically.
- Use `db.transaction(async (tx) => { ... })` within Repositories.
- This prevents partial writes if an error occurs mid-operation.

## 4. Agent Rules (Do's and Don'ts)
- **ALWAYS** adhere to the established schema definitions in `schema.ts`. If making a table addition, update `schema.ts` immediately.
- **ALWAYS** use `db.transaction` for multi-step write processes.
- **DO NOT** attempt to map relations or insert dummy data manually—use Drizzle's typed insert objects.
- **DO** use Drizzle's Relational Queries (`db.query.tableName.findMany`) with `with: {}` to efficiently fetch relations instead of chaining multiple disparate SQL calls, unless massive datasets require specialized Raw SQL/Neon search routing.
