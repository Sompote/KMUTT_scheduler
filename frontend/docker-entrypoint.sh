#!/bin/sh
set -e

# Default backend URL (for local Docker Compose)
BACKEND_URL=${BACKEND_URL:-"backend:3000"}

# Remove http:// or https:// prefix if present (nginx adds it automatically)
BACKEND_URL=$(echo "$BACKEND_URL" | sed 's|^https\?://||')

# Remove trailing slash if present
BACKEND_URL=${BACKEND_URL%/}

echo "🔧 Configuring backend URL: $BACKEND_URL"

# Replace BACKEND_URL placeholder in nginx config
sed -i "s|BACKEND_URL_PLACEHOLDER|${BACKEND_URL}|g" /etc/nginx/conf.d/default.conf

echo "✅ Nginx configuration updated"

# Start nginx
exec nginx -g 'daemon off;'
