import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { categories, actionLogs } from '@/db';

export const POST = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
    if (!authData || !authData.account) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const accountId = authData.account.id;

    try {
        // Parse request body
        const body = await req.json();
        const { title, description, parent_id, type } = body;

        if (!title || !description || !type)
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

        // Transaction: insert category and action log
        const category = await db.transaction(async (tx: DbTransaction) => {
            // Insert category (slug is generated on-the-fly, not stored)
            const [cat] = await tx.insert(categories).values({
                title,
                description,
                parentId: parent_id ?? null,
                type
            }).returning();

            // Insert action log
            return cat;
        });

        return NextResponse.json({ category }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
})
