FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the OMG version of the app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_BRAND omg

# Run build command for OMG version
RUN npm run build:omg

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_BRAND omg

# Copy built static files
COPY --from=builder /app/out ./out

# Install serve to host the static files
RUN npm install -g serve

# Expose port 80
EXPOSE 80

# Start the app with serve on port 80
CMD ["serve", "-s", "out", "-l", "80"]