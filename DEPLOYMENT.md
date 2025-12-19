# KMUTT CE Scheduler - Docker Deployment Guide

## 📦 Overview

This guide provides instructions for deploying the KMUTT CE Scheduler application using Docker and Docker Compose.

### Architecture

- **Frontend**: React + Vite (served via Nginx on port 80)
- **Backend**: Node.js + Express (running on port 3000)
- **Database**: SQLite (persisted in Docker volume)

## 🚀 Quick Start

### Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)

### 1. Clone and Navigate

```bash
cd /Users/sompoteyouwai/env1/time_shcedule
```

### 2. Build and Start

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

### 4. Stop Services

```bash
# Stop services
docker-compose down

# Stop and remove volumes (WARNING: This deletes the database!)
docker-compose down -v
```

## 🔧 Configuration

### Environment Variables

Backend environment variables can be set in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - DATABASE_PATH=/app/data/scheduler.db
```

### Port Configuration

To change exposed ports, edit `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 8080 to your desired port

  backend:
    ports:
      - "4000:3000"  # Change 4000 to your desired port
```

## 📊 Database Management

### Data Persistence

The SQLite database is stored in a Docker volume named `scheduler-data`. This ensures data persists across container restarts.

### Backup Database

```bash
# Create backup directory
mkdir -p backups

# Copy database from container
docker cp kmutt-scheduler-backend:/app/data/scheduler.db ./backups/scheduler-$(date +%Y%m%d-%H%M%S).db
```

### Restore Database

```bash
# Stop the backend container
docker-compose stop backend

# Copy backup into container
docker cp ./backups/scheduler-20231215.db kmutt-scheduler-backend:/app/data/scheduler.db

# Restart backend
docker-compose start backend
```

### Reset Database

```bash
# Stop services
docker-compose down

# Remove volume
docker volume rm time_shcedule_scheduler-data

# Restart (will initialize fresh database)
docker-compose up -d
```

## 🐛 Debugging

### View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Access Container Shell

```bash
# Backend container
docker exec -it kmutt-scheduler-backend sh

# Frontend container
docker exec -it kmutt-scheduler-frontend sh
```

### Check Health Status

```bash
# Backend health
curl http://localhost:3000/api/health

# Frontend health (via Nginx)
curl http://localhost/health
```

### Common Issues

#### Port Already in Use

```bash
# Check what's using the port
lsof -i :80
lsof -i :3000

# Change ports in docker-compose.yml
```

#### Database Not Initializing

```bash
# Check backend logs
docker-compose logs backend

# Manually initialize database
docker exec -it kmutt-scheduler-backend npm run db:init
docker exec -it kmutt-scheduler-backend npm run db:seed
```

#### Cannot Connect to Backend from Frontend

```bash
# Verify network
docker network inspect time_shcedule_scheduler-network

# Check backend is running
docker-compose ps backend
```

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Clean up old images
docker image prune -f
```

### View Resource Usage

```bash
# See resource consumption
docker stats kmutt-scheduler-backend kmutt-scheduler-frontend
```

## 🚢 Production Deployment

### Production Checklist

1. **Set NODE_ENV to production**
   ```yaml
   environment:
     - NODE_ENV=production
   ```

2. **Configure CORS** (backend/src/server.ts)
   ```typescript
   app.use(cors({
     origin: 'https://yourdomain.com'
   }));
   ```

3. **Use HTTPS** with reverse proxy (Nginx/Caddy)

4. **Set up automated backups**
   ```bash
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

5. **Configure logging** (centralized logging service)

6. **Monitor health endpoints**

### Using Reverse Proxy (Nginx)

Example Nginx configuration for production:

```nginx
server {
    listen 443 ssl http2;
    server_name scheduler.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📝 Docker Commands Reference

```bash
# Build
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Scale services (not applicable for this app)
docker-compose up -d --scale backend=2

# Remove all stopped containers
docker-compose rm

# Execute command in container
docker-compose exec backend npm run db:seed

# Inspect volume
docker volume inspect time_shcedule_scheduler-data

# Remove unused resources
docker system prune -a
```

## 🏗️ Architecture Details

### Dockerfile Structure

**Backend Dockerfile**:
- Base: `node:18-alpine`
- Build TypeScript to JavaScript
- Install production dependencies only
- Auto-initialize database on first run

**Frontend Dockerfile**:
- Multi-stage build
- Stage 1: Build React app with Vite
- Stage 2: Serve with Nginx
- Includes API proxy configuration

### Network Flow

```
User Request (Port 80)
    ↓
Frontend Container (Nginx)
    ↓ (Static files served directly)
    ↓ (API requests proxied)
Backend Container (Express) (Port 3000)
    ↓
SQLite Database (Volume)
```

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify health endpoints
3. Review this documentation
4. Check Docker and Docker Compose versions

## 📄 License

MIT License - KMUTT CE Department
