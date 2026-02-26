import { NextRequest } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/_Middleware.index';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { PasswordResetSetSchema } from '@tiktak/shared/types/auth/Auth.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

/**
 * POST /api/auth/reset/set
 * 
 * Password reset completion endpoint decoupled into AuthService
 */
export const POST = unifiedApiHandler(async (request: NextRequest, { module, log }) => {
  try {
    const parsed = await validateBody(request, PasswordResetSetSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { email, password, confirmPassword, otp } = parsed.data;

    // Delegate to AuthService
    const result = await module.auth.verifyAndResetPassword({
      email,
      password,
      confirmPassword,
      otp
    });

    if (!result.success) {
      if (log) log.warn("Password reset failed", { email, error: result.error });
      return errorResponse(result.error, result.status);
    }

    return okResponse(result.data);
  } catch (error) {
    if (log) log.error("Password reset route error", error);
    return serverErrorResponse('An error occurred while processing your request');
  }
});

