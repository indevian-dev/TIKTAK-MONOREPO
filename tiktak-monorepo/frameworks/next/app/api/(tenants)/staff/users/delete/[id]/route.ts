import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { users, accounts, actionLogs, eq, isNull } from '@/db';

export const DELETE = withApiHandler(async (req: NextRequest, { authData, params, db }: ApiHandlerContext) => {
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
    // Use a transaction to handle all operations
    const result = await db.transaction(async (tx: DbTransaction) => {
      // First check if user exists
      const [user] = await tx
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          lastName: users.lastName
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }

      // Get all accounts associated with this user for logging
      const userAccounts = await tx
        .select({
          id: accounts.id,
          role: accounts.role,
          isPersonal: accounts.isPersonal
        })
        .from(accounts)
        .where(eq(accounts.userId, userId));

      // Set user_id to NULL and mark accounts as deleted
      const updatedAccounts = await tx
        .update(accounts)
        .set({
          userId: null,
          isDeleted: true,
          updatedAt: new Date()
        })
        .where(eq(accounts.userId, userId))
        .returning({
          id: accounts.id,
          role: accounts.role
        });

      // Now we can safely delete the user from users table
      await tx
        .delete(users)
        .where(eq(users.id, userId));

      // Log the action for audit purposes
      // Log account updates as well
      for (const account of updatedAccounts) {
        }

      return {
        deletedUser: user,
        disconnectedAccounts: updatedAccounts.length,
        affectedAccounts: updatedAccounts
      };
    });

    return NextResponse.json({
      message: 'User deleted successfully',
      data: {
        userId: result.deletedUser.id,
        userEmail: result.deletedUser.email,
        disconnectedAccounts: result.disconnectedAccounts,
        affectedAccounts: result.affectedAccounts
      }
    }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Handle specific error cases
    if (errorMessage === 'User not found') {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      error: errorMessage || 'Failed to delete user'
    }, { status: 500 });
  }
})

