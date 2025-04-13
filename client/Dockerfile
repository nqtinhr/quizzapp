FROM node:22:alpine as builder
WORKDIR /quizzapp-frontend
COPY public/ /quizzapp-frontend/public
COPY src/ /quizzapp-frontend/src
COPY tsconfig.json /quizzapp-frontend/tsconfig.json
COPY tsconfig.node.json /quizzapp-frontend/tsconfig.node.json
COPY tsconfig.app.json /quizzapp-frontend/tsconfig.app.json
COPY vite.config.ts /quizzapp-frontend/vite.config.ts
COPY index.html /quizzapp-frontend/index.html
COPY package.json /quizzapp-frontend/package.json
COPY package-lock.json /quizzapp-frontend/package-lock.json
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=builder /quizzapp-frontend/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
