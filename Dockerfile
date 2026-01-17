# Multi-stage build: build Angular frontend, bundle with backend, run single Node app

FROM node:20-alpine AS base
WORKDIR /app

# Copy manifests separately for better caching
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

# Install dependencies
RUN npm ci --prefix backend && npm ci --prefix frontend

# Copy source
COPY backend backend
COPY frontend frontend

# Build frontend (static)
RUN npm run build --prefix frontend

# Copy built frontend into backend/public
RUN mkdir -p backend/public && cp -r frontend/dist/frontend/browser/* backend/public/

# Prune dev deps for backend
RUN npm prune --prefix backend --production

# Runtime image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy backend with built frontend assets
COPY --from=base /app/backend /app

EXPOSE 3000
CMD ["node", "src/index.js"]
