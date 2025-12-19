# Sliplane Deployment Setup Guide

## Problem
Your frontend deployment is failing with:
```
nginx: [emerg] host not found in upstream "backend" in /etc/nginx/conf.d/default.conf:36
```

This happens because the `BACKEND_URL` environment variable is not set in Sliplane.

## Solution: Configure Backend URL Environment Variable

### Step 1: Open Frontend Service Settings in Sliplane
1. Log in to your Sliplane dashboard
2. Navigate to your **frontend service** (the one that's failing)
3. Click on **Settings** or **Environment Variables**

### Step 2: Add Environment Variable
Add the following environment variable:

**Variable Name:**
```
BACKEND_URL
```

**Variable Value:**
```
https://kmutt-scheduler-ug1t3q.sliplane.app
```

⚠️ **Important Notes:**
- **INCLUDE** `https://` for cloud deployments
- Do NOT include `/api` in the value (nginx location block handles this)
- For local Docker Compose, you can use `http://backend:3000` or just `backend:3000`

### Step 3: Redeploy
After adding the environment variable:
1. Save the settings
2. Trigger a new deployment (or Sliplane may auto-deploy)
3. Wait for the build to complete

### Step 4: Verify Deployment
Check the runtime logs. You should see:
```
🔧 Configuring backend URL: https://kmutt-scheduler-ug1t3q.sliplane.app
✅ Nginx configuration updated
```

And nginx should start successfully without the "host not found" error.

## How It Works

The `docker-entrypoint.sh` script:
1. Reads the `BACKEND_URL` environment variable
2. Defaults to `http://backend:3000` if not set (for local Docker Compose)
3. Detects if URL includes protocol (`http://` or `https://`)
4. If no protocol, adds `http://` automatically
5. Replaces `BACKEND_URL_PLACEHOLDER` in nginx config with full URL
6. Starts nginx

Your nginx configuration then proxies all `/api/*` requests to:
```
https://kmutt-scheduler-ug1t3q.sliplane.app/api/*
```

## Testing After Deployment

Once deployed successfully:
1. Visit your frontend URL
2. Try to log in with credentials:
   - Username: `admin`
   - Password: `admin123`
3. The login should connect to your backend API successfully

## Troubleshooting

### If you still see "host not found" error:
- Check the environment variable is spelled correctly: `BACKEND_URL`
- Verify the value has no extra spaces
- Make sure you added it to the **frontend** service, not backend
- Try a full rebuild/redeploy

### If you get "connection refused" or "502 Bad Gateway":
- Check that your backend service is running at `https://kmutt-scheduler-ug1t3q.sliplane.app`
- Verify the backend API responds at `https://kmutt-scheduler-ug1t3q.sliplane.app/api/health`

### If login doesn't work:
- Check browser console for errors
- Verify API requests are going to the correct backend URL
- Check backend logs for authentication errors
