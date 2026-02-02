import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { asc, desc } from '@/db';
import { accountsRoles, actionLogs } from '@/db';
import type { ApiRouteHandler } from '@/types';
import type { AnyColumn } from 'drizzle-orm';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params, db }: ApiHandlerContext) => {
  // Validate API Request (Auth, Permissions, 2FA, Suspension)
  // Auth handled by withApiHandler - authData available in context
try {
        const { searchParams } = new URL(request.url);
        const sortBy = searchParams.get('sortBy') || 'name';
        const order = searchParams.get('order') || 'asc';

        // Map sortBy to the correct column with explicit type safety
        let sortColumn: AnyColumn = accountsRoles.name;
        if (sortBy === 'created_at' || sortBy === 'createdAt') {
            sortColumn = accountsRoles.createdAt;
        } else if (sortBy === 'name') {
            sortColumn = accountsRoles.name;
        } else if (sortBy === 'isStaff') {
            sortColumn = accountsRoles.isStaff;
        }

        // Get roles with more detailed error handling
        // Note: The schema has 'permissions' field, but query was selecting 'pages_permissions' and 'apis_permissions'
        // Selecting all fields and letting the application handle the transformation
        const result = await db
            .select()
            .from(accountsRoles)
            .orderBy(order === 'desc' ? desc(sortColumn) : asc(sortColumn));

        ConsoleLogger.log("Roles query result:", result);

        // Check if data exists and has content
        if (!result || !Array.isArray(result)) {
            return NextResponse.json({
                roles: [],
                message: "No data or invalid format returned"
            }, { status: 200 });
        }

        // Log the action
        // Return empty array if no roles
        return NextResponse.json({
            roles: result,
            count: result.length,
            message: result.length === 0 ? "No roles found" : undefined
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to fetch roles',
            details: errorMessage
        }, { status: 500 });
    }
})
