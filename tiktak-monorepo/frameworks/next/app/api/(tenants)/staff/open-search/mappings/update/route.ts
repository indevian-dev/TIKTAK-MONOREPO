import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';

import { NextResponse } from 'next/server';

import openSearchClient , { OPENSEARCH_INDEX } from '@/lib/clients/openSearchClient';
import type { ApiRouteHandler } from '@/types';

export const PUT: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {
  // Validate API Request (Auth, Permissions, 2FA, Suspension)
  // Auth handled by withApiHandler - authData available in context
try {
    const { mappings } = await request.json();

    if (!mappings)
      return NextResponse.json({ error: 'Missing index or mapping' }, { status: 400 });

    // Update mapping
    const response = await openSearchClient.indices.putMapping({
      index: OPENSEARCH_INDEX,
      body: mappings,
    });

    if (response.statusCode !== 200) {
      return NextResponse.json({ error: 'Failed to update mapping' }, { status: 500 });
    }

    return NextResponse.json({ success: true, response });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
})