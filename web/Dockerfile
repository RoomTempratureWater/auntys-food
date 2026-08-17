# --- 1. BASE STAGE ---
FROM node:20-slim AS base
WORKDIR /app

# Install OpenSSL for Prisma client compatibility
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

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
FROM base AS web
WORKDIR /app/web

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Build the Next.js application
RUN npm run build

EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "start"]


# --- 3. BOT TARGET ---
FROM base AS bot
WORKDIR /app/bot

ENV NODE_ENV=production

RUN npm run build --if-present

CMD ["npm", "start"]
