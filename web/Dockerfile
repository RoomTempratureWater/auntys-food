# --- 1. BASE STAGE ---
FROM node:20-slim AS base
WORKDIR /app

# OpenSSL + build tools for native node bindings
RUN apt-get update -y && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy root workspace configuration
COPY package*.json ./
COPY web/package.json ./web/
COPY bot/package.json ./bot/
COPY db/package.json ./db/

# Force installation of platform-specific optional binaries
RUN npm install --include=optional

# Copy all source code
COPY . .

# Generate Prisma client
WORKDIR /app/db
RUN npm run generate


# --- 2. WEB TARGET ---
FROM base AS web
WORKDIR /app/web

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Remove any leftover local .next build cache copied into the image
RUN rm -rf .next

# Build Next.js in production mode
RUN npm run build

EXPOSE 3000

# Run production server
CMD ["npm", "start"]


# --- 3. BOT TARGET ---
FROM base AS bot
WORKDIR /app/bot

ENV NODE_ENV=production

RUN npm run build --if-present

CMD ["npm", "start"]
