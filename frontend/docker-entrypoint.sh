#!/bin/sh
set -e

# Default backend URL (for local Docker Compose)
BACKEND_URL=${BACKEND_URL:-"http://backend:3000"}

# Detect if URL already has protocol, if not add http://
if echo "$BACKEND_URL" | grep -q "^https\?://"; then
  # URL has protocol, use as-is
  FULL_BACKEND_URL="$BACKEND_URL"
else
  # URL doesn't have protocol, assume http://
  FULL_BACKEND_URL="http://${BACKEND_URL}"
fi

# Remove trailing slash if present
FULL_BACKEND_URL=${FULL_BACKEND_URL%/}

echo "🔧 Configuring backend URL: $FULL_BACKEND_URL"

# Replace BACKEND_URL placeholder in nginx config
sed -i "s|BACKEND_URL_PLACEHOLDER|${FULL_BACKEND_URL}|g" /etc/nginx/conf.d/default.conf

echo "✅ Nginx configuration updated"

# Start nginx
exec nginx -g 'daemon off;'
