import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Initialize SQLite database
const sqlite = new Database('sqlite.db');

// Export drizzle instance with the schema
export const db = drizzle(sqlite, { schema }); 