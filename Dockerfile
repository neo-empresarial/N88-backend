# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- Builder: install ALL deps and build ----------
FROM base AS builder
# install deps (dev + prod) deterministically
COPY package*.json ./
RUN npm ci
# copy source and build
COPY . .
RUN npm run build
# after building, prune dev deps so node_modules = prod-only
RUN npm prune --omit=dev

# ---------- Runner: slim image with prod deps + dist ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# non-root (optional)
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs

# copy pruned node_modules and built app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

USER nestjs
EXPOSE 8000
ENV PORT=8000
ENV HOSTNAME=0.0.0.0

CMD ["node", "dist/main.js"]
