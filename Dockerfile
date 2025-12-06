# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the SSR bundle
RUN npm run build:ssr

# Stage 2: Runtime stage
FROM node:22-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port Cloud Run expects
EXPOSE 8080

# Health check (optional but recommended for Cloud Run)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the SSR server
CMD ["node", "dist/pharm-work/server/main.js"]
