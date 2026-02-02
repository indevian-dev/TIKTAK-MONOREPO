import { withApiHandler }
from '@/lib/auth/AccessValidatorForApis';
import { NextResponse }
    from 'next/server';
import type { ApiRouteHandler } from '@/types';
import {
    db,
    eq
} from '@/db';
import { accountsRoles }
    from '@/db/schema';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params, db }) => {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
        return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
    }
    const roleId = requireIntParam(resolvedParams.id, 'Role ID');

    try {
        const result = await db
            .select()
            .from(accountsRoles)
            .where(eq(accountsRoles.id, roleId))
            .limit(1);

        if (result.length === 0) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        // Transform permissions to array for widget compatibility
        const role = result[0];
        let permissions = [];

        if (Array.isArray(role.permissions)) {
            permissions = role.permissions;
        } else if (role.permissions && typeof role.permissions === 'object') {
            // Convert object format to array (backwards compatibility)
            permissions = Object.keys(role.permissions as Record<string, any>)
                .filter(k => (role.permissions as Record<string, any>)[k]);
        }

        return NextResponse.json({
            role: { ...role, permissions }
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to fetch role',
            details: errorMessage
        }, { status: 500 });
    }
})

