import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'tinylink.db');

try {
    const db = new Database(dbPath, { readonly: true });

    console.log('📊 Current links in database:\n');

    const links = db.prepare('SELECT * FROM links ORDER BY created_at DESC').all();

    if (links.length === 0) {
        console.log('No links found.');
    } else {
        links.forEach(link => {
            console.log(`Code: ${link.code}`);
            console.log(`URL: ${link.target_url}`);
            console.log(`Clicks: ${link.total_clicks}`);
            console.log(`Created: ${link.created_at}`);
            console.log('---');
        });
    }

    console.log(`\nTotal links: ${links.length}`);

    db.close();
} catch (error) {
    console.error('Error reading database:', error.message);
    console.log('\nDatabase file location:', dbPath);
}
