import db from './connection';
import fs from 'fs';
import path from 'path';

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Split by semicolon and execute each statement
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

console.log('🔄 Initializing database schema...');

try {
  const transaction = db.transaction(() => {
    for (const statement of statements) {
      db.exec(statement);
    }
  });

  transaction();

  console.log('✅ Database schema initialized successfully!');
  console.log(`📊 Total tables created: ${db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'").get().count}`);
} catch (error) {
  console.error('❌ Error initializing database:', error);
  process.exit(1);
}

process.exit(0);
