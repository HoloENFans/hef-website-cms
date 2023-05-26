# Rebuild the source code only when needed
FROM node:18-bullseye-slim AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN npm install --location=global pnpm \
  && pnpm install --frozen-lockfile

WORKDIR /app
COPY . .

ENV NODE_ENV production

RUN pnpm build \
  && pnpm prune --prod

# Production image, copy all the files and run next
FROM node:18-bullseye-slim AS runner
ENV NODE_ENV production
ENV PAYLOAD_CONFIG_PATH dist/payload.config.js

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nodejs

USER nodejs
WORKDIR /app

# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy transpiled code
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/build ./build

USER nodejs

EXPOSE 3001

ENV PORT 3001

CMD ["node", "dist/server.js"]
