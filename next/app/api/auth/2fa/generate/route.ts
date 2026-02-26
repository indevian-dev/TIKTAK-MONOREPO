
import { unifiedApiHandler } from "@/lib/middleware/_Middleware.index";
import { okResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';
import { TwoFactorGenerateSchema } from '@tiktak/shared/types/auth/Auth.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

export const POST = unifiedApiHandler(async (request, { module, authData }) => {
    try {
        if (!authData?.user?.id || !authData?.account?.id) {
            return errorResponse("Unauthorized", 401, "UNAUTHORIZED");
        }

        const parsed = await validateBody(request, TwoFactorGenerateSchema);
        if (!parsed.success) return parsed.errorResponse;

        const { type } = parsed.data;

        // Fetch phone from DB when needed (not stored in session data)
        let phone: string | undefined;
        if (type === 'phone') {
            const userDetails = await module.auth.getUserDetails(authData.user.id);
            phone = userDetails.data?.user?.phone ?? undefined;
            if (!phone) {
                return errorResponse("No phone number on file", 400, "PHONE_MISSING");
            }
        }

        const result = await module.auth.requestVerificationCode({
            email: type === 'email' ? authData.user.email : undefined,
            phone,
            operation: '2fa',
        });

        if (!result.success) {
            return errorResponse(result.error, result.status);
        }

        return okResponse(result.data);
    } catch (error) {
        console.error("Error in 2FA generate route:", error);
        return serverErrorResponse("Server error occurred");
    }
});
