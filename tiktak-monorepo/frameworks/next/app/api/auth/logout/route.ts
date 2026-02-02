import { withApiHandler }
  from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse }
  from 'next/server';
import type { ApiRouteHandler, ApiHandlerContext, DbTransaction } from '@/types';
import { eq } from '@/db';
import { users } from '@/db/schema';
import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
import { CookieManager }
  from '@/lib/auth/CookieManager';


export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db }: ApiHandlerContext) => {
  try {
    ConsoleLogger.log(('🚪 Logout request initiated'))

    // Extract authentication cookies using CookieManager
    const userId = authData?.user?.id;
    const accountId = authData?.account?.id;
    const sessionId = 'logout-session';

    ConsoleLogger.log((`📊 Processing logout for User ID: ${userId}, Account ID: ${accountId}, Session ID: ${sessionId}`))

    // Remove session from database in transaction
    const result = await db.transaction(async (tx: DbTransaction) => {
      // Remove current session from user's sessions if sessionId exists
      if (sessionId && userId) {
        ConsoleLogger.log(('🔄 Removing session from database'))

        // First, get the current user's sessions
        const [currentUser] = await tx
          .select({ sessions: users.sessions })
          .from(users)
          .where(eq(users.id, userId));

        if (currentUser) {
          // Parse the sessions, remove the target session, and update
          const currentSessions = (currentUser.sessions as Record<string, any>) || {};
          const { [sessionId]: removedSession, ...remainingSessions } = currentSessions;

          const sessionUpdateResult = await tx
            .update(users)
            .set({
              sessions: remainingSessions
            })
            .where(eq(users.id, userId))
            .returning({ id: users.id, sessions: users.sessions });

          if (sessionUpdateResult.length === 0) {
            ConsoleLogger.log(('❌ User not found during session cleanup'))
          } else {
            ConsoleLogger.log(('✅ Session removed from database'))
          }
        } else {
          ConsoleLogger.log(('❌ User not found'))
        }
      }

      return { success: true }
    })

    // Create response
    const initialResponse = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 })

    // Clear all authentication cookies using CookieManager
    const { authCookiesResponse } = CookieManager.clearAuthCookies({ response: initialResponse })

    // Log successful logout
    ConsoleLogger.log((`✅ Logout completed successfully for Account ID: ${accountId}`))

    return authCookiesResponse
  } catch (error) {
    ConsoleLogger.error(('❌ Logout error:'), error)

    // Even if there's an error, we should still clear cookies for security
    const initialResponse = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 })

    // Always clear cookies on logout, regardless of database errors
    const { authCookiesResponse } = CookieManager.clearAuthCookies({ response: initialResponse })

    return authCookiesResponse
  }
});