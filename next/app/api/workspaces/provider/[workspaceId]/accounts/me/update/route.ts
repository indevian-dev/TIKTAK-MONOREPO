import { NextResponse } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';

/**
 * PATCH /api/workspaces/provider/[workspaceId]/accounts/me/update
 * Updates current user/account profile
 */
export const PATCH = unifiedApiHandler(async (request, { module, auth, log }) => {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user) {
      return NextResponse.json({ error: 'User data is required' }, { status: 400 });
    }

    // Mapping fields if necessary
    const updateData = {
      firstName: user.name,
      lastName: user.last_name,
      phone: user.phone,
      avatarBase64: user.avatar_base64
    };

    const result = await module.auth.updateProfile(auth.userId!, updateData);

    return NextResponse.json(result, { status: result.status });

  } catch (error: any) {
    log.error('[Provider Account Update API] Error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
});
