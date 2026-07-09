---
name: Database driver must be node-postgres, not neon-http
description: Why this project's Drizzle setup uses pg Pool instead of the Neon HTTP driver
---

Rule: connect to the database with `drizzle-orm/node-postgres` + a `pg.Pool`, never `drizzle-orm/neon-http` + `@neondatabase/serverless`.

**Why:** This environment's DATABASE_URL is served through a Neon-compatible HTTP proxy that executes `INSERT/UPDATE/DELETE ... RETURNING` but silently returns zero rows over HTTP. All Drizzle `.returning()` calls yielded `undefined`, so writes succeeded while routes reported 404/undefined (e.g., analytics track endpoints incremented counts yet returned "Product not found"). Raw `neon()` SQL showed the same empty-RETURNING behavior, proving it's the proxy, not Drizzle. TCP connections (psql, pg Pool) return RETURNING rows correctly.

**How to apply:** If any write endpoint reports "not found"/undefined while the data actually changes in the DB, suspect an HTTP-driver connection and check that all db initializations use the pg Pool. `@neondatabase/serverless` may still linger in package.json as an unused dep — do not reintroduce it for runtime queries.
