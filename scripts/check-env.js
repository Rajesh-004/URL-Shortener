import fs from 'fs';
import path from 'path';

const files = ['.env', '.env.local', '.env.development', '.env.test', '.env.production'];

console.log('Checking for environment files in:', process.cwd());

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ Found ${file}`);
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`   Content length: ${content.length}`);
        console.log(`   First 20 chars: ${content.substring(0, 20).replace(/\n/g, '\\n')}`);
    } else {
        console.log(`❌ Missing ${file}`);
    }
});
