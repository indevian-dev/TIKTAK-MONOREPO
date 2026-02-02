import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';

import { NextResponse } from 'next/server';

import supabase from '@/lib/clients/supabaseServiceRoleClient';
import type { ApiRouteHandler } from '@/types';

export const POST: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {
  if (!authData || !authData.account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const accountId = authData.account.id;

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
