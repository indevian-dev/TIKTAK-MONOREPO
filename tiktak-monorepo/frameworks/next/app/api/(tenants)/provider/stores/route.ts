import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData }) => {
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // TODO: Implement store ownership
    // The stores table doesn't have account_id column yet
    // Either add: ALTER TABLE stores ADD COLUMN account_id bigint REFERENCES accounts(id);
    // Or use stores_applications table to find approved stores for this account

    return NextResponse.json({
      stores: [],
      message: 'Store ownership not yet implemented. Add account_id column to stores table.'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
});
