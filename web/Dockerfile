# --- 1. BASE STAGE ---
# This sets up the foundation, installs dependencies, and generates Prisma
FROM node:20-alpine AS base
WORKDIR /app

# Copy root workspace configuration
COPY package*.json ./
COPY web/package.json ./web/
COPY bot/package.json ./bot/
COPY db/package.json ./db/

# Install dependencies for the whole monorepo
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma client so both web and bot can access the database
WORKDIR /app/db
RUN npm run generate


# --- 2. WEB TARGET ---
# Coolify will build this specifically for your 'web' service
FROM base AS web
WORKDIR /app/web

# Force Next.js to build for production and bind to 0.0.0.0 (Fixes Traefik routing)
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Build the Next.js application
RUN npm run build

# Explicitly expose the port for the reverse proxy
EXPOSE 3000

# Start the optimized Next.js production server
CMD ["npm", "start"]


# --- 3. BOT TARGET ---
# Coolify will build this specifically for your 'bot' service
FROM base AS bot
WORKDIR /app/bot

ENV NODE_ENV=production

# Compile the bot (if you have a build script for TypeScript)
RUN npm run build --if-present

# Start the bot
CMD ["npm", "start"]
