
import { NextRequest } from 'next/server';
import { unifiedApiHandler } from "@/lib/middleware/_Middleware.index";
import { CookieAuthenticator } from "@/lib/middleware/Authenticator.Cookie.middleware";
import { ConsoleLogger } from "@/lib/logging/Console.logger";
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { LoginSchema } from '@tiktak/shared/types/auth/Auth.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

export const POST = unifiedApiHandler(async (request: NextRequest, { module }) => {
  try {
    const parsed = await validateBody(request, LoginSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { email, password, deviceInfo } = parsed.data;

    // Use AuthService from ModuleFactory
    const result = await module.auth.login({
      email,
      password,
      deviceInfo,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "0.0.0.0",
    });

    if (!result.success || !result.data) {
      return errorResponse(result.error, result.status);
    }

    // Create minimal response
    const response = okResponse({ success: true, message: "Logged in successfully" });

    const { session, expireAt } = result.data;

    // Set authentication cookies
    const { authCookiesResponse } = CookieAuthenticator.setAuthCookies({
      response,
      data: {
        session,
        expireAt,
      },
    });

    return authCookiesResponse;
  } catch (error) {
    ConsoleLogger.error("Error in login route:", error);
    return serverErrorResponse("Server error occurred");
  }
});

