import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import ablyRest from '@/lib/clients/ablyClient';
import type { ApiRouteHandler } from '@/types';

export const POST: ApiRouteHandler = withApiHandler(async (_req: NextRequest, { authData }: ApiHandlerContext) => {
  try {
    // Check if Ably is configured
    if (!ablyRest) {
      return NextResponse.json({ error: 'Ably service not configured' }, { status: 503 });
    }

    // Get authenticated account ID from cookie
    const accountId = authData?.account?.id;

    if (!accountId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate Ably token for the authenticated user with subscribe permissions
    const tokenRequest = await ablyRest.auth.createTokenRequest({
      clientId: accountId.toString(),
      capability: {
        // Allow all operations on all channels (for debugging)
        '*': ['*']
      }
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
});
