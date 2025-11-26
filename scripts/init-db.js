import { loadEnvConfig } from '@next/env';
import { initDatabase } from '../lib/db.js';

// Load environment variables from .env files
loadEnvConfig(process.cwd());

async function main() {
    try {
        console.log('Initializing database...');
        await initDatabase();
        console.log('✅ Done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        process.exit(1);
    }
}

main();
