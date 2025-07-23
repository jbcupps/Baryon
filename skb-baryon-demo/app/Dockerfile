# Dockerfile for SKB Baryon Demo Next.js App

# Use official Node.js LTS as base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json .yarnrc.yml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  elif [ -f .yarnrc.yml ]; then yarn install; \
  else npm install; \
  fi

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy built assets from base stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Copy public directory
COPY --from=base /app/public ./public

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 