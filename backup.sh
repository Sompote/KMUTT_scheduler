#!/bin/bash

###############################################################################
# KMUTT CE Scheduler - Database Backup Script
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
CONTAINER_NAME="kmutt-scheduler-backend"
DB_PATH="/app/data/scheduler.db"
RETENTION_DAYS=30  # Keep backups for 30 days

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/scheduler-$TIMESTAMP.db"

echo -e "${YELLOW}📦 Starting database backup...${NC}"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}✗ Error: Container $CONTAINER_NAME is not running${NC}"
    exit 1
fi

# Create backup
if docker cp "$CONTAINER_NAME:$DB_PATH" "$BACKUP_FILE"; then
    FILE_SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
    echo -e "${GREEN}✓ Backup created successfully${NC}"
    echo -e "  File: $BACKUP_FILE"
    echo -e "  Size: $FILE_SIZE"
else
    echo -e "${RED}✗ Backup failed${NC}"
    exit 1
fi

# Compress backup
echo -e "${YELLOW}🗜️  Compressing backup...${NC}"
gzip "$BACKUP_FILE"
COMPRESSED_FILE="$BACKUP_FILE.gz"
COMPRESSED_SIZE=$(ls -lh "$COMPRESSED_FILE" | awk '{print $5}')
echo -e "${GREEN}✓ Compressed to: $COMPRESSED_FILE ($COMPRESSED_SIZE)${NC}"

# Clean old backups
echo -e "${YELLOW}🧹 Cleaning old backups (older than $RETENTION_DAYS days)...${NC}"
find "$BACKUP_DIR" -name "scheduler-*.db.gz" -mtime +$RETENTION_DAYS -delete
REMAINING=$(ls -1 "$BACKUP_DIR"/scheduler-*.db.gz 2>/dev/null | wc -l)
echo -e "${GREEN}✓ Cleanup complete. $REMAINING backup(s) remaining${NC}"

echo -e "${GREEN}✓ Backup completed successfully${NC}"
