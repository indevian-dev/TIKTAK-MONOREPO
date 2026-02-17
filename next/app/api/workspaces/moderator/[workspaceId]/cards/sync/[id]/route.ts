import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { ModuleFactory } from '@/lib/domain/factory';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types/next';

export const POST = withApiHandler(async (request: NextRequest, ctx: ApiHandlerContext) => {
    const { authData, params } = ctx;

    if (!authData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params?.id ? parseInt(params.id as string) : null;
    if (!id) {
        return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    const modules = new ModuleFactory(authData as any);

    try {
        const syncResult = await modules.cards.syncCard(id);
        return NextResponse.json({
            operation: 'success',
            syncResult
        });
    } catch (error) {
        console.error('[Moderator API] Sync Error:', error);
        return NextResponse.json({ error: 'Failed to sync card' }, { status: 500 });
    }
});
