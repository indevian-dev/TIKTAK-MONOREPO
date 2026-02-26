import type { NextRequest } from "next/server";
import { unifiedApiHandler } from "@/lib/middleware/_Middleware.index";
import { CookieAuthenticator } from "@/lib/middleware/Authenticator.Cookie.middleware";
import { createdResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { RegisterSchema } from '@tiktak/shared/types/auth/Auth.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

/**
 * POST /api/auth/register
 *
 * Registration endpoint decoupled into AuthService
 */
export const POST = unifiedApiHandler(
  async (request: NextRequest, { module, log }) => {
    try {
      const parsed = await validateBody(request, RegisterSchema);
      if (!parsed.success) return parsed.errorResponse;

      const { email, password, confirmPassword, firstName, lastName, phone } = parsed.data;

      // Extract client info for session creation
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") ||
        "0.0.0.0";
      const userAgent = request.headers.get("user-agent") || "unknown";

      // Call AuthService to handle registration logic
      const result = await module.auth.register({
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phone,
        ip: ip ?? '0.0.0.0',
        userAgent,
      });

      if (!result.success) {
        if (log) log.warn("Registration failed", { email, error: result.error });
        return errorResponse(result.error || "Registration failed", result.status || 400);
      }

      // Prepare success response
      const responsePayload = {
        ...result.data,
        success: true,
      };

      const response = createdResponse(responsePayload);

      // Set authentication cookies if session was created
      if (result.data?.session?.id) {
        const { authCookiesResponse } = CookieAuthenticator.setAuthCookies({
          response,
          data: {
            session: result.data.session.id,
          },
        });
        return authCookiesResponse;
      }

      return response;
    } catch (error) {
      if (log) log.error("Registration route error", error);
      return serverErrorResponse("An unexpected error occurred during registration");
    }
  }
);

