import { neon } from '@neondatabase/serverless';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadEnvConfig } from '@next/env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars manually because Next.js might not have loaded them yet when this file is imported
const projectDir = process.cwd();
loadEnvConfig(projectDir);

console.log('🔍 Debug: Current directory:', projectDir);
console.log('🔍 Debug: DATABASE_URL present?', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('🔍 Debug: DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 10) + '...');
}

// Configuration
const USE_NEON = !!process.env.DATABASE_URL;

let sqliteDb;
if (!USE_NEON) {
    const dbPath = join(__dirname, '..', 'tinylink.db');
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('foreign_keys = ON');
}

// Initialize database schema
export async function initDatabase() {
    try {
        if (USE_NEON) {
            const sqlFn = neon(process.env.DATABASE_URL);
            console.log('🌐 Initializing Neon (PostgreSQL) database...');

            await sqlFn`
                CREATE TABLE IF NOT EXISTS links (
                    id SERIAL PRIMARY KEY,
                    code TEXT UNIQUE NOT NULL,
                    target_url TEXT NOT NULL,
                    total_clicks INTEGER DEFAULT 0,
                    last_clicked_at TIMESTAMP WITH TIME ZONE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            `;
            await sqlFn`CREATE INDEX IF NOT EXISTS idx_links_code ON links(code)`;
        } else {
            console.log('📂 Initializing local SQLite database...');
            sqliteDb.exec(`
                CREATE TABLE IF NOT EXISTS links (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    code TEXT UNIQUE NOT NULL,
                    target_url TEXT NOT NULL,
                    total_clicks INTEGER DEFAULT 0,
                    last_clicked_at TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `);
            sqliteDb.exec(`CREATE INDEX IF NOT EXISTS idx_links_code ON links(code)`);
        }
        console.log('✅ Database initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
}

// Unified SQL tag function
export async function sql(strings, ...values) {
    if (USE_NEON) {
        const sqlFn = neon(process.env.DATABASE_URL);
        return sqlFn(strings, ...values);
    } else {
        // SQLite implementation
        const query = strings.reduce((acc, str, i) => {
            return acc + str + (i < values.length ? '?' : '');
        }, '');

        const isSelect = query.trim().toUpperCase().startsWith('SELECT');
        const isInsert = query.trim().toUpperCase().startsWith('INSERT');
        const isDelete = query.trim().toUpperCase().startsWith('DELETE');
        const isUpdate = query.trim().toUpperCase().startsWith('UPDATE');

        try {
            if (isSelect) {
                const stmt = sqliteDb.prepare(query);
                const rows = stmt.all(...values);
                return Promise.resolve(rows);
            } else if (isInsert && query.includes('RETURNING')) {
                const insertQuery = query.replace(/RETURNING.*/i, '');
                const stmt = sqliteDb.prepare(insertQuery);
                const info = stmt.run(...values);
                const row = sqliteDb.prepare('SELECT * FROM links WHERE id = ?').get(info.lastInsertRowid);
                return Promise.resolve([row]);
            } else if (isDelete && query.includes('RETURNING')) {
                const codeParam = values[0]; // Assuming code is the first param for delete
                const row = sqliteDb.prepare('SELECT * FROM links WHERE code = ?').get(codeParam);
                if (row) {
                    const deleteQuery = query.replace(/RETURNING.*/i, '');
                    sqliteDb.prepare(deleteQuery).run(...values);
                    return Promise.resolve([row]);
                }
                return Promise.resolve([]);
            } else {
                const stmt = sqliteDb.prepare(query);
                const info = stmt.run(...values);
                return Promise.resolve({ changes: info.changes });
            }
        } catch (error) {
            console.error('SQLite Error:', error);
            throw error;
        }
    }
}

// Auto-initialize if running locally and not in build phase
if (!USE_NEON && process.env.NODE_ENV !== 'production') {
    // We don't await this top-level, but it's synchronous for SQLite
    try {
        // Check if table exists to avoid re-init spam
        const tableExists = sqliteDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='links'").get();
        if (!tableExists) {
            initDatabase();
        }
    } catch (e) {
        // Ignore
    }
}
