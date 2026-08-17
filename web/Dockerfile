# --- 1. BASE STAGE ---
FROM node:20-slim AS base
WORKDIR /app

# Install OpenSSL, build tools, and native dependencies
RUN apt-get update -y && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy root workspace configuration
COPY package*.json ./
COPY web/package.json ./web/
COPY bot/package.json ./bot/
COPY db/package.json ./db/

# Install dependencies including linux-x64 native binaries
RUN npm install --include=optional --os=linux --cpu=x64

# Copy all source code
COPY . .

# Generate Prisma Client for builds
WORKDIR /app/db
RUN npm run generate


# --- 2. WEB TARGET ---
FROM base AS web
WORKDIR /app/web

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Remove any stale dev cache
RUN rm -rf .next

# Build production Next.js application
RUN npm run build

EXPOSE 3000

# Push schema to live DB on boot, then start Next.js
CMD ["sh", "-c", "cd /app/db && npx prisma migrate deploy --accept-data-loss && cd /app/web && npm start"]


# --- 3. BOT TARGET ---
FROM base AS bot
WORKDIR /app/bot

ENV NODE_ENV=production

RUN npm run build --if-present

CMD ["npm", "start"]
