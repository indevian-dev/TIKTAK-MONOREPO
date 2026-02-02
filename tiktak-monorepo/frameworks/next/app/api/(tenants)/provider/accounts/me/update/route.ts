import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { users, accounts } from '@/db/schema';
import type { ApiRouteHandler } from '@/types';

export const PATCH: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db, log }: ApiHandlerContext) => {
  try {
    const accountId = authData?.account?.id;
    const userId = authData?.user?.id;

    // Check if user is authenticated
    if (!accountId || !userId) {
      return NextResponse.json({
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Get request body
    const requestBody = await request.json();
    const { user } = requestBody;

    // Basic validation
    if (!user) {
      return NextResponse.json({
        error: 'User data is required'
      }, { status: 400 });
    }

    // Update user information
    const updateData: any = {};
    if (user.name !== undefined) updateData.name = user.name;
    if (user.last_name !== undefined) updateData.lastName = user.last_name;
    if (user.phone !== undefined) updateData.phone = user.phone;
    if (user.avatar_base64 !== undefined) updateData.avatarBase64 = user.avatar_base64;

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        last_name: users.lastName,
        email: users.email,
        phone: users.phone,
        avatar_base64: users.avatarBase64
      });

    if (!updatedUser) {
      return NextResponse.json({
        error: 'User update failed'
      }, { status: 500 });
    }

    // Get the updated account data to return in response
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    if (!account) {
      return NextResponse.json({
        error: 'Error fetching updated account data'
      }, { status: 500 });
    }

    // Return success response with updated data
    return NextResponse.json({
      success: true,
      user: updatedUser,
      account
    });
  } catch (error) {
    log?.error('Error in account update endpoint', error as Error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
})
