#!/bin/sh
# Runs automatically before nginx starts (nginx:alpine's default entrypoint
# executes every *.sh file in /docker-entrypoint.d/). Starts the Angular SSR
# server as a background companion process on 127.0.0.1:4000 — nginx (see
# nginx.conf's `@ssr` location) proxies to it for any route that isn't
# already covered by a build-time prerendered index.html, and falls back to
# the plain client-rendered shell if this process isn't reachable.
#
# Note: this process isn't supervised (no restart-on-crash) and doesn't
# receive SIGTERM directly when the container stops — acceptable here since
# SSR is a progressive enhancement, not a hard dependency (see nginx.conf).
set -e

if [ -f /app/server/server.mjs ]; then
  PORT=4000 node /app/server/server.mjs > /var/log/ssr-server.log 2>&1 &
  echo "[docker-entrypoint-ssr] Angular SSR server starting on 127.0.0.1:4000 (pid $!)"
else
  echo "[docker-entrypoint-ssr] WARNING: /app/server/server.mjs not found — skipping SSR, static/prerendered routes only"
fi
