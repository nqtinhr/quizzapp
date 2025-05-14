# 🏗️ Build stage
FROM node:22-alpine AS build-stage
WORKDIR /backend
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY prisma ./prisma
COPY src ./src
COPY .env ./
COPY nest-cli.json tsconfig*.json ./
RUN pnpm exec prisma generate \
 && pnpm run build \
 && pnpm prune --prod

# 🚀 Runtime stage
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
# Copy production artifacts
COPY --from=build-stage /backend/package.json ./
COPY --from=build-stage /backend/pnpm-lock.yaml ./
COPY --from=build-stage /backend/node_modules ./node_modules
COPY --from=build-stage /backend/dist ./dist
COPY --from=build-stage /backend/prisma ./prisma
COPY --from=build-stage /backend/.env ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
