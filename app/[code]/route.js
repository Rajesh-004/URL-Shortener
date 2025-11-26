import { NextResponse } from 'next/server';
import { sql } from '../../lib/db';


export async function GET(request, { params }) {
    try {
        const { code } = await params;

        // Fetch the link
        const links = await sql`
      SELECT * FROM links WHERE code = ${code}
    `;

        if (links.length === 0) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            );
        }

        const link = links[0];

        // Update click count and last clicked time
        await sql`
      UPDATE links 
      SET total_clicks = total_clicks + 1,
          last_clicked_at = CURRENT_TIMESTAMP
      WHERE code = ${code}
    `;

        // Perform 302 redirect
        return NextResponse.redirect(link.target_url, { status: 302 });
    } catch (error) {
        console.error('Error redirecting:', error);
        return NextResponse.json(
            { error: 'Failed to redirect' },
            { status: 500 }
        );
    }
}
