import { NextRequest } from 'next/server';
import { unifiedApiHandler } from '@/lib/middleware/_Middleware.index';
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { PasswordResetRequestSchema } from '@tiktak/shared/types/auth/Auth.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

/**
 * POST /api/auth/reset/request
 * 
 * Verification code request endpoint decoupled into AuthService
 */
export const POST = unifiedApiHandler(async (request: NextRequest, { module, log }) => {
  try {
    const parsed = await validateBody(request, PasswordResetRequestSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { email, phone, operation } = parsed.data;

    // Delegate to AuthService
    const result = await module.auth.requestVerificationCode({
      email,
      phone,
      operation: (operation as 'verification' | 'password_reset' | '2fa') ?? 'verification',
    });

    if (!result.success) {
      if (log) log.warn("Verification request failed", { email, phone, operation, error: result.error });
      return errorResponse(result.error, result.status);
    }

    return okResponse(result.data);
  } catch (error) {
    if (log) log.error("Verification request route error", error);
    return serverErrorResponse('Failed to process verification request');
  }
});

