#!/bin/bash

echo "🧹 Cleaning up old backend processes..."
pkill -f "time_shcedule/backend.*tsx"
sleep 2

echo "🚀 Starting backend server..."
cd /Users/sompoteyouwai/env1/time_shcedule/backend
npm run dev
