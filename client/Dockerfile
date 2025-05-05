FROM node:22-alpine AS builder

# Cài pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /frontend

COPY public/ /frontend/public
COPY src/ /frontend/src
COPY tsconfig.json /frontend/tsconfig.json
COPY tsconfig.node.json /frontend/tsconfig.node.json
COPY tsconfig.app.json /frontend/tsconfig.app.json
COPY vite.config.ts /frontend/vite.config.ts
COPY index.html /frontend/index.html
COPY package.json /frontend/package.json
COPY pnpm-lock.yaml /frontend/pnpm-lock.yaml

RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Stage 2
FROM nginx:alpine
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
