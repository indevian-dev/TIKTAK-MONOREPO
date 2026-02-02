import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import OpenSearch from '@/lib/clients/openSearchClient';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData }) => {
  try {
    const { body } = await OpenSearch.cluster.health();
    return NextResponse.json({ status: body.status, details: body }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch OpenSearch status', details: errorMessage },
      { status: 500 }
    );
  }
});
