import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';


// GET /api/links/:code - Get stats for a single link
export async function GET(request, { params }) {
    try {
        const { code } = await params;

        const links = await sql`
      SELECT * FROM links WHERE code = ${code}
    `;

        if (links.length === 0) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(links[0]);
    } catch (error) {
        console.error('Error fetching link:', error);
        return NextResponse.json(
            { error: 'Failed to fetch link' },
            { status: 500 }
        );
    }
}

// DELETE /api/links/:code - Delete a link
export async function DELETE(request, { params }) {
    try {
        const { code } = await params;

        const result = await sql`
      DELETE FROM links WHERE code = ${code}
      RETURNING *
    `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Link not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, deleted: result[0] });
    } catch (error) {
        console.error('Error deleting link:', error);
        return NextResponse.json(
            { error: 'Failed to delete link' },
            { status: 500 }
        );
    }
}
