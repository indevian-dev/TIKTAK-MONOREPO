import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import supabase from '@/lib/clients/supabaseServiceRoleClient';
import type { ApiRouteHandler } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const GET: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params }: ApiHandlerContext) => {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1'); // Default to page 1
    const limit = parseInt(searchParams.get('limit') || '10'); // Default to 10 items per page

    // Calculate the starting point for the query
    const from = (page - 1) * limit;

    // Fetch access endpoints from Supabase with pagination
    const { data, error, count } = await supabase
        .from('accounts_roles_endpoints')
        .select('*', { count: 'exact' })
        .range(from, from + limit - 1); // Supabase uses zero-based indexing for range

    ConsoleLogger.log('data', data);
    ConsoleLogger.log('error', error);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ endpoints: data, total: count }, { status: 200 });
})
