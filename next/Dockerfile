
# ═══════════════════════════════════════════════════════════════
# 🐳 Dockerfile for Next.js (Standalone) with Bun & Monorepo Support
# Build context: monorepo root  |  Dockerfile: next/Dockerfile
# ═══════════════════════════════════════════════════════════════

FROM oven/bun:1 AS base

# ──────────────────────────────────────────────────────────────
# 1. Install dependencies
#    Must install from monorepo root so Bun workspaces resolves
#    the shared root bun.lock correctly.
# ──────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy root workspace manifest + lockfile (source of truth for workspaces)
COPY package.json bun.lock ./

# Copy each workspace package.json (Bun needs these to resolve workspace:*)
COPY next/package.json ./next/
COPY _shared.types/package.json ./_shared.types/

# Install all workspace dependencies from the root lockfile
RUN bun install --frozen-lockfile

# ──────────────────────────────────────────────────────────────
# 2. Build the Next.js app
# ──────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

# Restore installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/next/node_modules ./next/node_modules

# Copy source
COPY _shared.types ./_shared.types
COPY next ./next

WORKDIR /app/next
ENV NEXT_TELEMETRY_DISABLED=1

# Run next build directly (bypasses prebuild validators which are dev-only)
RUN bun x next build

# ──────────────────────────────────────────────────────────────
# 3. Production runner (minimal image - standalone only)
# ──────────────────────────────────────────────────────────────
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy the standalone build output
COPY --from=builder /app/next/.next/standalone ./

# Copy public and static assets into the correct location inside standalone
COPY --from=builder /app/next/public ./next/public
COPY --from=builder /app/next/.next/static ./next/.next/static

USER bun

EXPOSE 8000
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "next/server.js"]
