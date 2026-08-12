FROM node:20-slim AS base
WORKDIR /app

# Copy package manifests for workspace
COPY package*.json ./
COPY web/package.json ./web/
COPY bot/package.json ./bot/
COPY db/package.json ./db/

# Install dependencies once for all packages
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
WORKDIR /app/db
RUN npm run generate

# --- Web Service Stage ---
FROM base AS web
WORKDIR /app/web
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Bot Service Stage ---
FROM base AS bot
WORKDIR /app/bot
CMD ["npm", "start"]
