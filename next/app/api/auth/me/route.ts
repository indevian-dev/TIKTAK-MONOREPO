import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile
 */
export const GET = unifiedApiHandler(async (request, { module }) => {
  const result = await module.auth.getAuthProfile();

  return NextResponse.json(result, {
    status: result.status
  });
});
