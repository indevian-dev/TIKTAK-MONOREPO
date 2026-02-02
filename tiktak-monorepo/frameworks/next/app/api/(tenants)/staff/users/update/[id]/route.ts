import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { users, actionLogs, eq } from '@/db';

// Support both PATCH and POST per endpoints mapping
export const PUT = withApiHandler(async (req: NextRequest, { authData, params, db }: ApiHandlerContext) => {
  if (!authData || !authData.account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  const userId = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;

  // Auth (require accountId)
  const accountId = authData.account.id;

  try {
    const body = await req.json();
    const { email_is_verified, phone_is_verified, emailVerified, phoneVerified } = body || {};

    // Normalize input: allow both snake_case and camelCase
    const nextEmailVerified = typeof emailVerified === 'boolean' ? emailVerified
      : (typeof email_is_verified === 'boolean' ? email_is_verified : undefined);
    const nextPhoneVerified = typeof phoneVerified === 'boolean' ? phoneVerified
      : (typeof phone_is_verified === 'boolean' ? phone_is_verified : undefined);

    if (typeof nextEmailVerified === 'undefined' && typeof nextPhoneVerified === 'undefined') {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const result = await db.transaction(async (tx: DbTransaction) => {
      const updateData: any = {
        updatedAt: new Date()
      };

      if (typeof nextEmailVerified === 'boolean') {
        updateData.emailIsVerified = nextEmailVerified;

        }

      if (typeof nextPhoneVerified === 'boolean') {
        updateData.phoneIsVerified = nextPhoneVerified;

        }

      // Update user
      await tx
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId));

      // Return updated user minimal fields
      const [user] = await tx
        .select({
          id: users.id,
          email: users.email,
          phone: users.phone,
          emailIsVerified: users.emailIsVerified,
          phoneIsVerified: users.phoneIsVerified,
          updatedAt: users.updatedAt
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return { user };
    });

    return NextResponse.json({ success: true, user: result.user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user verification' }, { status: 500 });
  }
})

