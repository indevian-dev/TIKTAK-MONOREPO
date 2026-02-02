import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import supabase from '@/lib/clients/supabaseServiceRoleClient';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {
    const resolvedParams = await params;
    if (!resolvedParams?.id) {
        return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
    }
    const id = resolvedParams.id;
    const { data, error } = await supabase.from('accounts_roles').select('*').eq('id', id).single();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ role: data });
})
