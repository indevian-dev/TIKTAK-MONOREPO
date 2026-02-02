import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import OpenSearch , { OPENSEARCH_INDEX } from '@/lib/clients/openSearchClient';
import type { ApiRouteHandler } from '@/types';

const indexName = OPENSEARCH_INDEX;

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData }) => {
  if (!indexName)
    return NextResponse.json({ error: 'OPENSEARCH_INDEX_NAME is not set in environment' }, { status: 500 });

  try {
    const { body: mapping } = await OpenSearch.indices.getMapping({ index: indexName });
    return NextResponse.json({ mapping });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage || 'Failed to fetch OpenSearch mapping' },
      { status: 500 }
    );
  }
});
