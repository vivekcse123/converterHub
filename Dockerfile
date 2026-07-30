# ─── Build stage ────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:prod

# ─── Production nginx + SSR stage ────────────────
FROM nginx:alpine

# Node to run the bundled Angular SSR server (dist/converter-hub/server) as a
# companion process behind nginx — see nginx.conf's `@ssr` location.
RUN apk add --no-cache nodejs

COPY --from=builder /app/dist/converter-hub/browser /usr/share/nginx/html
COPY --from=builder /app/dist/converter-hub/server /app/server

COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx:alpine's default entrypoint runs every *.sh file in
# /docker-entrypoint.d/ before starting nginx.
COPY docker-entrypoint-ssr.sh /docker-entrypoint.d/50-start-ssr.sh
RUN chmod +x /docker-entrypoint.d/50-start-ssr.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
