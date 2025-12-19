#!/usr/bin/env node
/**
 * Production startup script
 * Initializes database if needed, then starts the server
 */

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../data/scheduler.db');

console.log('🚀 Starting KMUTT Scheduler Backend...\n');

// Check if database exists
if (!existsSync(DATABASE_PATH)) {
  console.log('📦 Database not found. Initializing...');

  try {
    // Run database initialization
    execSync('node dist/database/init.js', { stdio: 'inherit' });
    console.log('✅ Database initialized successfully\n');

    // Run database seeding
    console.log('🌱 Seeding initial data...');
    execSync('node dist/database/seed.js', { stdio: 'inherit' });
    console.log('✅ Data seeded successfully\n');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
} else {
  console.log('✅ Database found at:', DATABASE_PATH, '\n');
}

// Start the server
console.log('🌐 Starting Express server...\n');
require('./server');
