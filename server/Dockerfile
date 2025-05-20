# Build stage
FROM node:22-alpine AS build-stage
WORKDIR /backend

RUN corepack enable && corepack prepare pnpm@latest --activate \
  && pnpm config set node-linker hoisted

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
COPY src ./src
COPY nest-cli.json tsconfig*.json ./
COPY .env ./

RUN pnpm exec prisma generate \
 && pnpm run build \
 && pnpm prune --prod

# Runtime stage
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build-stage /backend/dist ./dist
COPY --from=build-stage /backend/node_modules ./node_modules
COPY --from=build-stage /backend/package.json ./package.json
COPY --from=build-stage /backend/.env ./

EXPOSE 3000
CMD ["node", "dist/main.js"]
