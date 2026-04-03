# ── Stage 1: install dependencies ────────────────────────────────────────────
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Skip puppeteer's bundled Chrome download — we use system Chromium instead
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY package*.json ./
RUN npm ci --omit=dev=false   # include devDeps needed for the build stage


# ── Stage 2: build ────────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS builder
WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


# ── Stage 3: production runner ────────────────────────────────────────────────
FROM node:20-bookworm-slim AS runner
WORKDIR /app

# Install Chromium + fonts needed for PDF rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
      chromium \
      fonts-liberation \
      fonts-noto \
      libasound2 \
      libatk-bridge2.0-0 \
      libatk1.0-0 \
      libcups2 \
      libdbus-1-3 \
      libdrm2 \
      libgbm1 \
      libgtk-3-0 \
      libnspr4 \
      libnss3 \
      libxcomposite1 \
      libxdamage1 \
      libxrandr2 \
      xdg-utils \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Tell Puppeteer to use the system Chromium binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Standalone output lives here
COPY --from=builder /app/.next/standalone ./
# Static assets
COPY --from=builder /app/.next/static ./.next/static
# Public assets (logo, etc.)
COPY --from=builder /app/public ./public

# Create the data directory so history.json can be written
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "server.js"]
