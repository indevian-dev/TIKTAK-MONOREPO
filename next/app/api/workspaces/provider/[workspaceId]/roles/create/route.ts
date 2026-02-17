import { withApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types/next';
import supabase from '@/lib/clients/supabaseServiceRoleClient';
import { NextResponse } from 'next/server';
import type { ApiRouteHandler } from '@/types/next';

export const POST: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {
  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    // Basic validation
    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      );
    }

    // Create role
    const { data: role, error } = await supabase
      .from('accounts_roles')
      .insert({
        name,
        permissions: permissions || []
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create role' },
        { status: 500 }
      );
    }

    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
})
