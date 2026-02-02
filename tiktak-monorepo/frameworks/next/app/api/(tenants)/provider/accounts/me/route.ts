import { NextResponse } from 'next/server';
import { eq } from '@/db';
import { accounts, users, accountsRoles } from '@/db/schema';
import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, db, log }: ApiHandlerContext) => {
  if (!authData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!authData.account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 401 });
  }

  const accountId = authData.account.id;

  try {
    const [data] = await db
      .select({
        account_id: accounts.id,
        account_created_at: accounts.createdAt,
        account_updated_at: accounts.updatedAt,
        account_suspended: accounts.suspended,
        account_role: accounts.role,
        account_is_personal: accounts.isPersonal,
        user_id: users.id,
        user_email: users.email,
        user_name: users.name,
        user_last_name: users.lastName,
        user_avatar_base64: users.avatarBase64,
        user_avatar_url: users.avatarUrl,
        user_sessions: users.sessions,
        user_phone: users.phone,
        user_email_is_verified: users.emailIsVerified,
        user_phone_is_verified: users.phoneIsVerified,
        role_permissions: accountsRoles.permissions
      })
      .from(accounts)
      .leftJoin(users, eq(accounts.userId, users.id))
      .leftJoin(accountsRoles, eq(accounts.role, accountsRoles.name))
      .where(eq(accounts.id, accountId))
      .limit(1);

    if (!data) {
      return NextResponse.json({
        error: 'Account not found'
      }, { status: 404 });
    }

    const accountData = {
      account: {
        id: data.account_id,
        created_at: data.account_created_at,
        updated_at: data.account_updated_at,
        suspended: data.account_suspended,
        role: data.account_role,
        is_personal: data.account_is_personal,
      },
      user: {
        id: data.user_id,
        email: data.user_email,
        name: data.user_name,
        last_name: data.user_last_name,
        avatar_base64: data.user_avatar_base64,
        avatar_url: data.user_avatar_url,
        sessions: data.user_sessions,
        phone: data.user_phone,
        email_is_verified: data.user_email_is_verified,
        phone_is_verified: data.user_phone_is_verified
      },
      permissions: data.role_permissions || []
    };

    return NextResponse.json(accountData);
  } catch (error) {
    log?.error('Error fetching account data', error as Error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
});
