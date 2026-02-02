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

export const POST: ApiRouteHandler = withApiHandler(async (request, { authData, params, db }) => {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
        return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
    }
    const roleId = requireIntParam(resolvedParams.id, 'Role ID');

    const { permission, action } = await request.json();

    // Validate required fields
    if (!permission || !action) {
        return NextResponse.json(
            { error: 'Permission and action are required' },
            { status: 400 }
        );
    }

    if (action !== 'add' && action !== 'remove') {
        return NextResponse.json(
            { error: 'Action must be "add" or "remove"' },
            { status: 400 }
        );
    }

    try {
        // First, get the current role with its permissions
        const roleResult = await db
            .select()
            .from(accountsRoles)
            .where(eq(accountsRoles.id, roleId))
            .limit(1);

        if (roleResult.length === 0) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        const role = roleResult[0];

        // Parse existing permissions - handle JSON array stored in DB
        let currentPermissions = role.permissions;
        let permissions: string[] = [];

        if (Array.isArray(currentPermissions)) {
            permissions = [...currentPermissions];
        } else if (currentPermissions && typeof currentPermissions === 'object') {
            // Convert object format to array (for backwards compatibility)
            permissions = Object.keys(currentPermissions as Record<string, any>)
                .filter(k => (currentPermissions as Record<string, any>)[k]);
        }

        if (action === 'add') {
            // Add permission if not already present
            if (!permissions.includes(permission)) {
                permissions.push(permission);
            }
        } else {
            // Remove permission from array
            permissions = permissions.filter(p => p !== permission);
        }

        // Update the permissions in the database
        const result = await db
            .update(accountsRoles)
            .set({ permissions: permissions as any })
            .where(eq(accountsRoles.id, roleId))
            .returning();

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Failed to update permissions' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            role: result[0],
            action: action === 'add' ? 'added' : 'removed',
            permission,
            permissions
        }, { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
})
