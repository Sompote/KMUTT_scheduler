#!/bin/bash

###############################################################################
# KMUTT CE Scheduler - Deployment Script
# This script automates the deployment process using Docker Compose
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   KMUTT CE Scheduler - Docker Deployment Script      ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

check_dependencies() {
    print_info "Checking dependencies..."

    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_success "All dependencies are installed"
    echo ""
}

stop_services() {
    print_info "Stopping existing services..."
    docker-compose down || true
    print_success "Services stopped"
    echo ""
}

build_services() {
    print_info "Building Docker images..."
    docker-compose build --no-cache
    print_success "Images built successfully"
    echo ""
}

start_services() {
    print_info "Starting services..."
    docker-compose up -d
    print_success "Services started"
    echo ""
}

wait_for_health() {
    print_info "Waiting for services to be healthy..."

    # Wait for backend
    for i in {1..30}; do
        if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
            print_success "Backend is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Backend health check timeout"
            exit 1
        fi
        sleep 2
    done

    # Wait for frontend
    for i in {1..30}; do
        if curl -f -s http://localhost/health > /dev/null 2>&1; then
            print_success "Frontend is healthy"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Frontend health check timeout"
            exit 1
        fi
        sleep 2
    done

    echo ""
}

show_status() {
    print_info "Service Status:"
    docker-compose ps
    echo ""
}

show_info() {
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          Deployment Completed Successfully!          ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "🌐 Frontend:  ${BLUE}http://localhost${NC}"
    echo -e "🔧 Backend:   ${BLUE}http://localhost:3000${NC}"
    echo -e "💚 Health:    ${BLUE}http://localhost:3000/api/health${NC}"
    echo ""
    echo -e "📊 View logs:        ${YELLOW}docker-compose logs -f${NC}"
    echo -e "🛑 Stop services:    ${YELLOW}docker-compose down${NC}"
    echo -e "🔄 Restart services: ${YELLOW}docker-compose restart${NC}"
    echo ""
}

backup_database() {
    print_info "Creating database backup..."
    BACKUP_DIR="./backups"
    mkdir -p "$BACKUP_DIR"
    BACKUP_FILE="$BACKUP_DIR/scheduler-$(date +%Y%m%d-%H%M%S).db"

    if docker ps | grep -q kmutt-scheduler-backend; then
        docker cp kmutt-scheduler-backend:/app/data/scheduler.db "$BACKUP_FILE" 2>/dev/null || true
        if [ -f "$BACKUP_FILE" ]; then
            print_success "Database backed up to: $BACKUP_FILE"
        else
            print_info "No existing database to backup"
        fi
    else
        print_info "Backend container not running, skipping backup"
    fi
    echo ""
}

# Main deployment flow
main() {
    print_header

    # Parse arguments
    SKIP_BUILD=false
    BACKUP=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --backup)
                BACKUP=true
                shift
                ;;
            *)
                echo "Unknown option: $1"
                echo "Usage: $0 [--skip-build] [--backup]"
                exit 1
                ;;
        esac
    done

    check_dependencies

    if [ "$BACKUP" = true ]; then
        backup_database
    fi

    stop_services

    if [ "$SKIP_BUILD" = false ]; then
        build_services
    else
        print_info "Skipping build step (using existing images)"
        echo ""
    fi

    start_services
    wait_for_health
    show_status
    show_info
}

# Run main function
main "$@"
