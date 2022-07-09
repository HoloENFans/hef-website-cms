# Rebuild the source code only when needed
FROM node:16-bullseye-slim AS builder
WORKDIR /app
COPY .npmrc package.json pnpm-lock.yaml ./

RUN npm install --location=global pnpm \
  && pnpm install --frozen-lockfile

WORKDIR /app
COPY . .

ENV NODE_ENV production

RUN pnpm build

# Production image, copy all the files and run next
FROM node:16-bullseye-slim AS runner
ENV NODE_ENV production
ENV PAYLOAD_CONFIG_PATH dist/payload.config.js

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nodejs \
  && npm install --location=global pnpm
  
USER nodejs
WORKDIR /app

COPY --chown=nodejs:nodejs .npmrc package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/build ./build

USER nodejs

EXPOSE 3001

ENV PORT 3001

CMD ["node", "dist/server.js"]
