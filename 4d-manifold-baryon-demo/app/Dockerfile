# Dockerfile for 4D Manifold Baryon Demo (Next.js)

# Use official Node.js LTS as base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# System dependencies for Next.js and Prisma
RUN apk add --no-cache openssl libstdc++

# Install dependencies
# Copy manifest and lockfiles first for better layer caching
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* .yarnrc.yml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else npm install --no-audit --no-fund --legacy-peer-deps; \
  fi

# Copy application code
COPY . .

# Ensure Prisma client is generated in the builder image
RUN npx prisma generate || echo "Prisma generate skipped"

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Runtime deps for Prisma
RUN apk add --no-cache openssl libstdc++

ENV NODE_ENV=production

# Add a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy production runtime: compiled Next app, public assets, and node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application in production mode
CMD ["npm", "run", "start"]