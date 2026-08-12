FROM node:20-alpine

WORKDIR /app

# Copy root workspace configuration
COPY package*.json ./
COPY web/package.json ./web/
COPY bot/package.json ./bot/
COPY db/package.json ./db/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate prisma client
WORKDIR /app/db
RUN npm run generate

WORKDIR /app/web
CMD ["npm", "run", "dev"]
