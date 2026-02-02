import { NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { eq } from '@/db';
import {
  stores,
  storesApplications,
  accounts,
  accountsNotifications,
  users,
  actionLogs
} from '@/db/schema';

export const PUT = withApiHandler(async (req: NextRequest, { authData, params, log, db }: ApiHandlerContext) => {
  log?.info('PUT function started');

  try {
    // Step 1: Get parameters
    log?.debug('Getting parameters...');
    const resolvedParams = await params;
    const applicationId = (resolvedParams as Record<string, string>)?.applicationId;
    log?.debug('ApplicationId', { applicationId });

    if (!applicationId || isNaN(parseInt(applicationId))) {
      log?.warn('Invalid application ID');
      return NextResponse.json({ error: 'Valid application ID is required' }, { status: 400 });
    }

    // Step 2: Get authentication from authData
    if (!authData || !authData.account) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const authAccId = authData.account.id;
    log?.debug('AuthAccId', { authAccId });

    // Step 3: Parse request body
    log?.debug('Parsing request body...');
    const body = await req.json();
    const { approved = false, reason = '' } = body;
    log?.debug('Body parsed', { approved, reason });

    // Step 4: Database transaction
    log?.debug('Starting database transaction...');
    let result;

    try {
      result = await db.transaction(async (tx: DbTransaction) => {
        log?.debug('Inside transaction...');

        // Get application using Drizzle ORM
        const appResult = await tx
          .select({
            id: storesApplications.id,
            createdAt: storesApplications.createdAt,
            storeName: storesApplications.storeName,
            storeAddress: storesApplications.storeAddress,
            contactName: storesApplications.contactName,
            phone: storesApplications.phone,
            email: storesApplications.email,
            voen: storesApplications.voen,
            accountId: storesApplications.accountId,
            accountName: users.name,
            accountLastName: users.lastName,
            accountEmail: users.email,
          })
          .from(storesApplications)
          .leftJoin(accounts, eq(storesApplications.accountId, accounts.id))
          .leftJoin(users, eq(accounts.userId, users.id))
          .where(eq(storesApplications.id, parseInt(applicationId)))
          .limit(1);

        log?.debug('Applications found', { count: appResult.length });

        if (!appResult || appResult.length === 0) {
          throw new Error('Store application not found');
        }

        const application = appResult[0];
        log?.debug('Application data', {
          applicationId: application.id,
          storeName: application.storeName,
          accountId: application.accountId
        });

        if (approved) {
          log?.info('Processing approval...');
          const applicantAccountId = application.accountId;

          if (!applicantAccountId) {
            throw new Error('Application does not have an associated account');
          }

          // Get the user_id from the current account using Drizzle
          log?.debug('Getting user_id from existing account...');
          const [existingAccount] = await tx
            .select({ userId: accounts.userId })
            .from(accounts)
            .where(eq(accounts.id, applicantAccountId))
            .limit(1);

          if (!existingAccount) {
            throw new Error('Cannot find user for the application account');
          }

          const userId = existingAccount.userId;
          log?.debug('Found user_id', { userId });

          // Create store using Drizzle
          log?.debug('Creating store...');
          const [newStore] = await tx
            .insert(stores)
            .values({
              title: application.storeName || '',
              description: application.storeAddress || '',
              isActive: true,
            })
            .returning();

          log?.info('Store created', { storeId: newStore.id });

          // Create new account for this user with store_owner role using Drizzle
          log?.debug('Creating new store_owner account...');
          const [newAccount] = await tx
            .insert(accounts)
            .values({
              userId: userId,
              role: 'store_owner',
              isPersonal: false,
              tenantType: 'store',
              tenantAccessKey: newStore.id,
            })
            .returning();

          log?.info('New store_owner account created', { accountId: newAccount.id });

          // Delete application using Drizzle
          log.debug('Deleting application...');
          await tx
            .delete(storesApplications)
            .where(eq(storesApplications.id, parseInt(applicationId)));

          // Create notification using Drizzle
          log.debug('Creating notification...');
          const approvalMessage = `Congratulations! Your store application has been approved and your store is now active. A new store owner account has been created for you.`;

          await tx
            .insert(accountsNotifications)
            .values({
              name: 'Store Application Approved',
              body: approvalMessage,
              markAsRead: false,
              accountId: applicantAccountId,
            });

          // Log action using Drizzle
          log?.debug('Logging action...');
          log?.info('Approval process completed');
          return {
            application,
            approved: true,
            store: newStore,
            newAccount: newAccount,
            originalAccountId: applicantAccountId,
            message: 'Store application approved successfully - New store owner account created'
          };

        } else {
          log?.info('Processing rejection...');

          // Delete application using Drizzle
          await tx
            .delete(storesApplications)
            .where(eq(storesApplications.id, parseInt(applicationId)));

          // Create notification if account exists using Drizzle
          if (application.accountId) {
            const rejectMessage = reason
              ? `Your store application has been rejected. Reason: ${reason}`
              : `Your store application has been rejected.`;

            await tx
              .insert(accountsNotifications)
              .values({
                name: 'Store Application Rejected',
                body: rejectMessage,
                markAsRead: false,
                accountId: application.accountId,
              });
          }

          // Log action using Drizzle
          log?.info('Rejection process completed');
          return {
            application,
            approved: false,
            reason,
            message: 'Store application rejected successfully'
          };
        }
      });

      log?.info('Transaction completed successfully');

    } catch (dbError) {
      log?.error('Database transaction error', dbError as Error);
      throw dbError;
    }

    // Step 5: Return response
    log?.debug('Returning response...');

    if (!result) {
      log?.error('Transaction returned null/undefined result');
      return NextResponse.json({
        error: 'Transaction failed to return a result'
      }, { status: 500 });
    }

    log?.info('PUT function completed successfully');
    return NextResponse.json({
      message: result.message,
      data: result
    }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to process store application';
    const errorStack = error instanceof Error ? error.stack : undefined;
    log?.error('PUT function error', error as Error);

    return NextResponse.json({
      error: errorMessage,
      stack: Bun.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 });
  }
});