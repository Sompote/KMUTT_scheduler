#!/bin/sh
set -e

# Default backend URL (for local Docker Compose)
BACKEND_URL=${BACKEND_URL:-"backend:3000"}

echo "🔧 Configuring backend URL: $BACKEND_URL"

# Replace BACKEND_URL placeholder in nginx config
sed -i "s|BACKEND_URL_PLACEHOLDER|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf

echo "✅ Nginx configuration updated"

# Start nginx
exec nginx -g 'daemon off;'
