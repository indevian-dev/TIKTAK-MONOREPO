import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import supabase from '@/lib/clients/supabaseServiceRoleClient';
import type { ApiRouteHandler } from '@/types';

export const POST: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
        return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
    }
    const id = resolvedParams.id;
    const { path, method, action } = await request.json();

    // Validate required fields
    if (!path || !action) {
        return NextResponse.json({ error: 'Path and action are required' }, { status: 400 });
    }

    if (action !== 'add' && action !== 'remove') {
        return NextResponse.json({ error: 'Action must be "add" or "remove"' }, { status: 400 });
    }

    try {
        // First, get the current role with its permissions
        const { data: role, error: roleError } = await supabase
            .from('accounts_roles')
            .select('permissions')
            .eq('id', id)
            .single();

        if (roleError) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        // Initialize permissions object if it doesn't exist
        let permissions = role.permissions || {};

        if (action === 'add') {
            // Add the permission to the JSON object
            permissions[path] = {
                m: method || 'GET',  // Default to GET if method not provided
                v: 'permissions',    // Standard value based on your codebase
                t: 'api',            // Assuming most permissions are for API endpoints
                d: `Permission for ${path}`  // Description
            };
        } else {
            // Remove the permission from the JSON object
            if (permissions[path]) {
                delete permissions[path];
            }
        }

        // Update the permissions in the database
        const { data, error } = await supabase
            .from('accounts_roles')
            .update({ permissions })
            .eq('id', id)
            .select('permissions')
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            role: data,
            action: action === 'add' ? 'added' : 'removed',
            path
        }, { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
})
