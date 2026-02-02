import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import openSearchClient from '@/lib/clients/openSearchClient';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData }) => {
  try {
    // Fetch cluster stats from OpenSearch
    const { body: stats } = await openSearchClient.cluster.stats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage ?? 'Failed to fetch OpenSearch stats' },
      { status: 500 }
    );
  }
});
