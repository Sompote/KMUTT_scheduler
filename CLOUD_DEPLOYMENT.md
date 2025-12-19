# Cloud Deployment Guide

## Sliplane / Cloud Platform Deployment

This guide covers deploying the KMUTT Scheduler to cloud platforms like Sliplane, Railway, Render, etc.

### Architecture

The application consists of two services:
1. **Backend** (Node.js/Express) - Port 3000
2. **Frontend** (Nginx) - Port 80

### Service Configuration

#### Backend Service
- **Build**: `backend/Dockerfile`
- **Port**: 3000
- **Environment Variables**:
  ```
  NODE_ENV=production
  PORT=3000
  DATABASE_PATH=/app/data/scheduler.db
  ```
- **Volume**: Persistent storage for `/app/data` (SQLite database)

#### Frontend Service
- **Build**: `frontend/Dockerfile`
- **Port**: 80
- **Depends On**: Backend service
- **Environment Variables**: None required (API proxied through Nginx)

### Service Communication

The frontend Nginx proxies `/api/*` requests to the backend service. There are two approaches:

#### Option 1: Docker Compose (Recommended for local/VPS)
```yaml
networks:
  scheduler-network:
    driver: bridge
```
Services communicate using service names (`backend:3000`).

#### Option 2: Cloud Platform (Sliplane, Railway, Render)

**Important**: Cloud platforms handle service networking differently.

##### For Sliplane:
1. Deploy backend service first
2. Note the internal URL (usually `backend` or `servicename.internal`)
3. If services can't find each other by name, you may need to:
   - Check Sliplane's service networking documentation
   - Ensure both services are in the same project/network
   - Use internal DNS names provided by the platform

##### Nginx Configuration
The nginx.conf is configured for dynamic DNS resolution:
```nginx
resolver 127.0.0.11 valid=10s;
set $backend_upstream backend:3000;
proxy_pass http://$backend_upstream;
```

This allows Nginx to:
- Start even if backend isn't ready yet
- Resolve backend hostname dynamically
- Handle service restarts gracefully

### Common Issues

#### Error: "host not found in upstream 'backend'"

**Cause**: Nginx trying to resolve backend hostname before it's available.

**Solution**: The current nginx.conf uses dynamic resolution. If still failing:

1. **Check service names**: Ensure backend service is named `backend` on the platform
2. **Verify networking**: Confirm both services are on the same network
3. **Platform-specific**: Some platforms require environment variables for service URLs

For platforms that don't support service name resolution:

```nginx
# Replace backend:3000 with environment variable or actual URL
set $backend_upstream ${BACKEND_URL};
proxy_pass http://$backend_upstream;
```

Then set `BACKEND_URL` environment variable in the frontend service.

#### Database Persistence

**Critical**: Ensure the backend has persistent storage mounted at `/app/data`

Without persistence, the SQLite database will be lost on container restarts.

### Health Checks

Both services have health endpoints:

**Backend**: `http://backend:3000/api/health`
```bash
wget --no-verbose --tries=1 --spider http://localhost:3000/api/health
```

**Frontend**: `http://frontend/health`
```bash
wget --no-verbose --tries=1 --spider http://localhost/health
```

### Deployment Checklist

- [ ] Backend service deployed and healthy
- [ ] Backend has persistent volume for `/app/data`
- [ ] Frontend can resolve backend hostname
- [ ] Health checks passing
- [ ] Port 80 accessible from internet (frontend)
- [ ] Test login at deployed URL
- [ ] Test API calls (`/api/health`)

### Platform-Specific Notes

#### Sliplane
- Services communicate via internal DNS
- Use service names for internal communication
- Persistent volumes automatically handled
- Check Sliplane docs for service linking

#### Railway
- Use internal URLs: `servicename.railway.internal`
- Environment variables: `BACKEND_URL=http://backend.railway.internal:3000`

#### Render
- Use internal URLs: `servicename:port`
- Private services don't expose public ports
- Web services get public URLs

#### Docker Compose (Self-Hosted)
```bash
docker-compose up -d --build
```
No special configuration needed - uses the existing `docker-compose.yml`.

### Environment Variables

**Backend**:
```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=/app/data/scheduler.db
```

**Frontend** (if using environment-based backend URL):
```env
BACKEND_URL=http://backend:3000
# or platform-specific internal URL
```

### Testing Deployment

1. **Check backend health**:
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Check frontend health**:
   ```bash
   curl https://your-frontend-url.com/health
   ```

3. **Test API proxy**:
   ```bash
   curl https://your-frontend-url.com/api/health
   ```

4. **Test login**:
   - Visit `https://your-frontend-url.com`
   - Should see login page
   - Login with admin/admin123

### Troubleshooting

**Logs Commands**:
```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend

# Sliplane
# Use Sliplane dashboard to view logs

# Railway
railway logs backend
railway logs frontend
```

**Common Fixes**:
1. Restart services in order: backend first, then frontend
2. Check service networking configuration
3. Verify environment variables are set
4. Check persistent volume is mounted
5. Review platform-specific documentation

### Support

For deployment issues:
- Check platform documentation
- Review service logs
- Verify networking configuration
- Test health endpoints

---

**Last Updated**: December 19, 2025
