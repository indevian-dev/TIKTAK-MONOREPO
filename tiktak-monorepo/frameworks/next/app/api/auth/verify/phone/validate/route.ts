import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse } from 'next/server';
import type { ApiRouteHandler, ApiHandlerContext, DbTransaction } from '@/types';
import {
  db,
  eq,
  and,
  ne
} from '@/db';
import {
  users,
  accounts,
  otps,
  actionLogs
} from '@/db/schema';
import { OtpType } from '@/types/resources/user/user';
import { validateOtp } from '@/lib/utils/otpHandlingUtility';

export const POST: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db }: ApiHandlerContext) => {
  try {
    if (!authData || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = authData.user.id;

    const body = await request.json();
    const { phone, otp } = body || {};

    // Validate input
    if (!phone || !otp) {
      return NextResponse.json({
        error: 'Phone and OTP are required'
      }, { status: 400 });
    }

    // Get current user
    const userResult = await db
      .select({
        id: users.id,
        phone: users.phone,
        phoneIsVerified: users.phoneIsVerified,
        name: users.name,
        accountId: accounts.id
      })
      .from(users)
      .innerJoin(
        accounts,
        and(
          eq(users.id, accounts.userId),
          eq(accounts.isPersonal, true)
        )
      )
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult?.length) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 400 });
    }

    const user = userResult[0];

    // Check if the provided phone is different from current phone
    const phoneChanged = user.phone !== phone.trim();

    // If phone changed, check if new phone already exists for another user
    if (phoneChanged) {
      const existingUser = await db
        .select({
          id: users.id,
          phone: users.phone,
          phoneIsVerified: users.phoneIsVerified
        })
        .from(users)
        .where(
          and(
            eq(users.phone, phone.trim()),
            ne(users.id, userId)
          )
        )
        .limit(1);

      if (existingUser?.length > 0) {
        return NextResponse.json({
          error: 'This phone number is already registered to another account'
        }, { status: 400 });
      }
    }

    // Validate OTP
    const isValidOtp = await validateOtp({
      userId: user.id,
      type: OtpType.PHONE_VERIFICATION,
      otp
    });

    if (!isValidOtp) {
      return NextResponse.json({
        error: 'Invalid or expired OTP'
      }, { status: 400 });
    }

    // OTP is valid, update user phone (if changed) and verification status in transaction
    await db.transaction(async (tx: DbTransaction) => {
      // Update phone and mark as verified
      if (phoneChanged) {
        await tx
          .update(users)
          .set({
            phone: phone.trim(),
            phoneIsVerified: true,
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));
      } else {
        await tx
          .update(users)
          .set({
            phoneIsVerified: true,
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id));
      }

      // Delete the used OTP
      await tx
        .delete(otps)
        .where(
          and(
            eq(otps.userId, user.id),
            eq(otps.type, 'phone_verification'),
            eq(otps.code, otp)
          )
        );

      // Log the verification action
      const action = phoneChanged ? 'phone_updated_and_verified' : 'phone_verified';
      await tx
        .insert(actionLogs)
        .values({
          action,
          createdBy: user.accountId,
          resourceType: 'accounts',
          resourceId: user.accountId
        });
    });

    const message = phoneChanged
      ? 'Phone number updated and verified successfully'
      : 'Phone verified successfully';

    return NextResponse.json({
      success: true,
      message,
      phoneUpdated: phoneChanged,
      userId: user.id
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to verify phone'
    }, { status: 500 });
  }
});
