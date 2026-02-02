import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from '@/db';
import { users } from '@/db/schema';
import type { OtpType, ApiRouteHandler, ApiHandlerContext } from '@/types';
import {
    generateOtp,
    storeOtp,
    checkRecentOtpExists
} from '@/lib/utils/otpHandlingUtility';
import { generateVerificationOtpEmail }
    from '@/lib/signals/mail/mailGenerator';
import { sendMail }
    from '@/lib/clients/mailServiceClient';
import { generateVerificationOtpSms }
    from '@/lib/signals/sms/smsGenerator';
import { sendOtpSmsPlus }
    from '@/lib/clients/smsServiceClient';

export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, db, log }: ApiHandlerContext) => {
  // Validate API Request (Auth, Permissions, 2FA, Suspension)
  // Auth handled by withApiHandler - authData available in context
try {
        if (!authData) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }

        const userId = authData.user.id;

        const body = await request.json();
        const { method } = body;

        if (!method || !['email', 'phone'].includes(method)) {
            return NextResponse.json({ error: 'Invalid method. Must be email or phone' }, { status: 400 });
        }

        // Check if user has recent OTP (within 2 minutes)
        const recentOtp = await checkRecentOtpExists({ userId, type: `2fa_${method}` as OtpType });
        if (recentOtp && recentOtp.expireAt) {
            const expireTime = new Date(recentOtp.expireAt).getTime();
            const currentTime = new Date().getTime();
            return NextResponse.json({
                error: 'OTP already sent recently. Please wait before requesting a new one.',
                nextAvailableIn: Math.ceil((expireTime - currentTime) / 1000)
            }, { status: 429 });
        }

        // Generate OTP
        const { otpCode } = generateOtp();
        const { isOtpIssued } = await storeOtp({
            userId,
            otpCode,
            type: `2fa_${method}` as OtpType,
            ttlMinutes: 10
        });

        if (!isOtpIssued) {
            return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
        }

        // Get user contact info
        const [user] = await db
            .select({
                email: users.email,
                phone: users.phone
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }

        const { email, phone } = user;

        // Send OTP based on method
        if (method === 'email') {
            if (!email) {
                return NextResponse.json({ error: 'Email not available' }, { status: 400 });
            }

            const emailTemplate = generateVerificationOtpEmail({
                username: userId,
                otp: otpCode,
                expiryMinutes: 10
            });

            const result = await sendMail({
                to: email,
                subject: 'Two-Factor Authentication Code',
                html: emailTemplate.html
            });

            if (!result.success) {
                return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
            }
        } else if (method === 'phone') {
            if (!phone) {
                return NextResponse.json({ error: 'Phone number not available' }, { status: 400 });
            }

            // Generate SMS template (for logging/future use)
            generateVerificationOtpSms({
                username: userId,
                otp: otpCode,
                expiryMinutes: 10
            });

            const result = await sendOtpSmsPlus({
                number: phone,
                otp: otpCode,
                expiryMinutes: 10
            });

            if (!result.success) {
                return NextResponse.json({ error: 'Failed to send verification SMS' }, { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Verification code sent via ${method}`,
            expiresIn: 600 // 10 minutes in seconds
        }, { status: 200 });

    } catch (error) {
        log?.error('2FA OTP generation error', error as Error);
        return NextResponse.json({ error: 'Failed to process verification request' }, { status: 500 });
    }
});
