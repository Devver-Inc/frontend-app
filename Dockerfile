# Stage 1: Build
FROM node:24.21.0-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack (version pinned by "packageManager" in package.json)
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies (pnpm store cached across builds)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# Copy source code
COPY . .

# Build arguments for environment variables
# These will be available during build time as VITE_ prefixed variables
ARG VITE_API_BASE_URL
ARG VITE_LOGTO_ENDPOINT
ARG VITE_LOGTO_APP_ID
ARG VITE_LOGTO_CALLBACK_URI
ARG VITE_LOGTO_SIGN_OUT_URI

# Export as environment variables for Vite build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_LOGTO_ENDPOINT=$VITE_LOGTO_ENDPOINT
ENV VITE_LOGTO_APP_ID=$VITE_LOGTO_APP_ID
ENV VITE_LOGTO_CALLBACK_URI=$VITE_LOGTO_CALLBACK_URI
ENV VITE_LOGTO_SIGN_OUT_URI=$VITE_LOGTO_SIGN_OUT_URI

# Build the application
RUN pnpm build

# Stage 2: Production with Nginx
FROM nginx:1.30.5-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
