import { withApiHandler }
from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse }
    from 'next/server';
import { eq, and } from '@/db';
import { users, otps } from '@/db/schema';
import {
    validateOtp
} from '@/lib/utils/otpHandlingUtility';
import type { OtpType, ApiRouteHandler, ApiHandlerContext } from '@/types';

export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, db, log }: ApiHandlerContext) => {
    try {
        if (!authData) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        const userId = authData.user.id;

        const body = await request.json();
        const { code, method } = body;

        if (!code || !method || !['email', 'phone'].includes(method)) {
            return NextResponse.json({
                error: 'Invalid request. Code and method (email/phone) are required'
            }, { status: 400 });
        }

        // Validate OTP
        const isValid = await validateOtp({
            userId,
            type: `2fa_${method}` as OtpType,
            otp: code
        });

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
        }

        // Update user's 2FA expiration timestamp to 10 minutes from now
        const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const updateData = method === 'email'
            ? { twoFactorAuthEmailExpireAt: expireAt }
            : { twoFactorAuthPhoneExpireAt: expireAt };

        const updateResult = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                two_factor_auth_email_expire_at: users.twoFactorAuthEmailExpireAt,
                two_factor_auth_phone_expire_at: users.twoFactorAuthPhoneExpireAt
            });

        if (!updateResult?.length) {
            return NextResponse.json({ error: 'Failed to update 2FA status' }, { status: 500 });
        }

        // Clean up used OTPs
        await db
            .delete(otps)
            .where(and(
                eq(otps.userId, userId),
                eq(otps.type, `2fa_${method}`)
            ));

        return NextResponse.json({
            success: true,
            message: 'Two-factor authentication verified successfully',
            method,
            expiresAt: expireAt.toISOString(),
            expiresIn: 600 // 10 minutes in seconds
        }, { status: 200 });

    } catch (error) {
        log?.error('2FA OTP validation error', error as Error);
        return NextResponse.json({ error: 'Failed to validate verification code' }, { status: 500 });
    }
});
