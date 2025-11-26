import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';
import { generateShortCode, isValidShortCode, isValidUrl } from '../../../lib/utils';


// GET /api/links - List all links
export async function GET() {
    try {
        const links = await sql`
      SELECT * FROM links 
      ORDER BY created_at DESC
    `;

        return NextResponse.json(links);
    } catch (error) {
        console.error('Error fetching links:', error);
        return NextResponse.json(
            { error: 'Failed to fetch links' },
            { status: 500 }
        );
    }
}

// POST /api/links - Create a new link
export async function POST(request) {
    try {
        const body = await request.json();
        const { targetUrl, customCode } = body;

        // Validate target URL
        if (!targetUrl || !isValidUrl(targetUrl)) {
            return NextResponse.json(
                { error: 'Invalid or missing target URL' },
                { status: 400 }
            );
        }

        // Generate or validate short code
        let code = customCode;
        if (code) {
            // Validate custom code format
            if (!isValidShortCode(code)) {
                return NextResponse.json(
                    { error: 'Custom code must be 6-8 alphanumeric characters' },
                    { status: 400 }
                );
            }

            // Check if code already exists
            const existing = await sql`
        SELECT code FROM links WHERE code = ${code}
      `;

            if (existing.length > 0) {
                return NextResponse.json(
                    { error: 'Short code already exists' },
                    { status: 409 }
                );
            }
        } else {
            // Generate a unique code
            let attempts = 0;
            const maxAttempts = 10;
            console.log('Generating unique code...');
            while (attempts < maxAttempts) {
                code = generateShortCode();
                const existing = await sql`
          SELECT code FROM links WHERE code = ${code}
        `;

                if (existing.length === 0) break;
                attempts++;
            }

            if (attempts === maxAttempts) {
                return NextResponse.json(
                    { error: 'Failed to generate unique code' },
                    { status: 500 }
                );
            }
        }

        // Insert the new link
        const result = await sql`
      INSERT INTO links (code, target_url)
      VALUES (${code}, ${targetUrl})
      RETURNING *
    `;

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json(
            { error: 'Failed to create link' },
            { status: 500 }
        );
    }
}
