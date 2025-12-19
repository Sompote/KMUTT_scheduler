#!/usr/bin/env node
/**
 * Production startup script
 * Initializes database if needed, then starts the server
 */

import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';

dotenv.config();

const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../data/scheduler.db');

console.log('🚀 Starting KMUTT Scheduler Backend...\n');

// Check if database exists and has data
const needsInit = !existsSync(DATABASE_PATH);
let needsSeed = false;

if (!needsInit) {
  // Database exists, check if it has data
  try {
    const db: Database.Database = new Database(DATABASE_PATH);
    const result = db.prepare('SELECT COUNT(*) as count FROM subjects').get() as { count: number };
    db.close();
    needsSeed = result.count === 0;

    if (needsSeed) {
      console.log('⚠️  Database exists but is empty. Will seed data...\n');
    } else {
      console.log('✅ Database found with data at:', DATABASE_PATH, '\n');
    }
  } catch (error) {
    console.log('⚠️  Database exists but may be corrupted. Reinitializing...\n');
    needsSeed = true;
  }
}

if (needsInit || needsSeed) {
  try {
    if (needsInit) {
      console.log('📦 Database not found. Initializing...');
      execSync('node dist/database/init.js', { stdio: 'inherit' });
      console.log('✅ Database initialized successfully\n');
    }

    // Run database seeding
    console.log('🌱 Seeding initial data...');
    execSync('node dist/database/seed.js', { stdio: 'inherit' });
    console.log('✅ Data seeded successfully\n');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

// Start the server
console.log('🌐 Starting Express server...\n');
require('./server');
