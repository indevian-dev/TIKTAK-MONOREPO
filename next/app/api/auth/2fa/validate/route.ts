
import { unifiedApiHandler } from "@/lib/middleware/_Middleware.index";
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { SessionStore } from "@/lib/middleware/Store.Session.middleware";
import { TwoFactorValidateSchema } from '@tiktak/shared/types/auth/Auth.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

export const POST = unifiedApiHandler(async (request, { module, authData }) => {
    try {
        if (!authData?.user?.id || !authData?.account?.id) {
            return errorResponse("Unauthorized", 401, "UNAUTHORIZED");
        }

        const parsed = await validateBody(request, TwoFactorValidateSchema);
        if (!parsed.success) return parsed.errorResponse;

        const { code } = parsed.data;

        // Validate the 2FA OTP via AuthService (uses OTP type '2fa')
        const result = await module.auth.validate2FA({
            accountId: authData.account.id,
            code: String(code).trim(),
        });

        if (!result.success) {
            return errorResponse(result.error || "Invalid OTP", result.status || 400);
        }

        // Set 2FA verified flag in Redis for this session
        const sessionId = authData.session?.id;
        if (sessionId) {
            await SessionStore.set2FAVerified(sessionId);
        }

        return okResponse({
            verified: true,
            message: "Two-factor authentication verified successfully"
        });
    } catch (error) {
        console.error("Error in 2FA validate route:", error);
        return serverErrorResponse("Server error occurred");
    }
});
