# Rebuild the source code only when needed
FROM node:16-buster-slim AS builder
WORKDIR /app
COPY .npmrc package.json pnpm-lock.yaml ./

RUN npm install -g pnpm \
	&& apt install libvips libvips-dev \
    && pnpm install --frozen-lockfile

WORKDIR /app
COPY . .

ARG ENV_FILE
ENV NODE_ENV production

RUN echo $ENV_FILE | base64 -d > .env \
    && pnpm build

# Production image, copy all the files and run next
FROM node:16-buster-slim AS runner
WORKDIR /app

ARG ENV_FILE
ENV NODE_ENV production

COPY .npmrc package.json pnpm-lock.yaml ./

RUN addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 nodejs \
    && echo $ENV_FILE | base64 -d > .env \
	&& npm i -g pnpm \
	&& apt install libvips libvips-dev \
    && pnpm install --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

USER nodejs

EXPOSE 3001

ENV PORT 3001

CMD ["pnpm", "serve"]
