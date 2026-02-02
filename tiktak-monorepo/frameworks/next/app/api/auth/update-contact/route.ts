import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { eq, and, ne } from '@/db';
import { users, actionLogs } from '@/db/schema';
import { cleanPhoneNumber, validateAzerbaijanPhone } from '@/lib/utils/phoneUtility';
import type { ApiRouteHandler } from '@/types';

/**
 * Update contact information for unverified users
 * This allows users who entered wrong email/phone during registration to correct it
 * Only works for users who haven't verified their email yet
 */
export const PATCH: ApiRouteHandler = withApiHandler(async (request: NextRequest, { authData, params, db, log }: ApiHandlerContext) => {
  try {
    const body = await request.json();
    const { email, phone } = body;

    // Get authenticated account ID from cookie
    const accountId = authData?.account?.id;
    const userId = authData?.user?.id;

    if (!accountId || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate that at least one contact method is provided
    if (!email && !phone) {
      return NextResponse.json({
        error: 'Either email or phone must be provided'
      }, { status: 400 });
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({
        error: 'Invalid email format',
        field: 'email'
      }, { status: 400 });
    }

    // Validate phone format if provided
    let cleanedPhone = null;
    if (phone) {
      const { cleanedPhone: cleaned } = cleanPhoneNumber({ phone });
      cleanedPhone = cleaned;
      const { isPhoneValid } = validateAzerbaijanPhone({ cleanedPhone });
      if (!isPhoneValid) {
        return NextResponse.json({
          error: 'Please provide a valid Azerbaijan phone number',
          field: 'phone'
        }, { status: 400 });
      }
    }

    const result = await db.transaction(async (tx: DbTransaction) => {
      // First, verify user exists and is not verified yet
      const [user] = await tx
        .select({
          id: users.id,
          email: users.email,
          phone: users.phone,
          email_is_verified: users.emailIsVerified,
          phone_is_verified: users.phoneIsVerified,
          name: users.name,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }

      // Only allow contact updates for unverified users
      if (user.email_is_verified) {
        throw new Error('Cannot update contact information for verified users. Please use account settings instead.');
      }

      // Check if new email is already taken by a verified user
      if (email && email !== user.email) {
        const existingEmail = await tx
          .select({ id: users.id })
          .from(users)
          .where(and(
            eq(users.email, email),
            eq(users.emailIsVerified, true),
            ne(users.id, userId)
          ))
          .limit(1);

        if (existingEmail.length > 0) {
          throw new Error('This email is already registered and verified');
        }
      }

      // Check if new phone is already taken by a verified user
      if (cleanedPhone && cleanedPhone !== user.phone) {
        const existingPhone = await tx
          .select({ id: users.id })
          .from(users)
          .where(and(
            eq(users.phone, cleanedPhone),
            eq(users.emailIsVerified, true),
            ne(users.id, userId)
          ))
          .limit(1);

        if (existingPhone.length > 0) {
          throw new Error('This phone number is already registered and verified');
        }
      }

      // Update contact information
      const updateFields: any = { updatedAt: new Date() };
      if (email) updateFields.email = email;
      if (cleanedPhone) updateFields.phone = cleanedPhone;

      const [updatedUser] = await tx
        .update(users)
        .set(updateFields)
        .where(eq(users.id, userId))
        .returning({
          id: users.id,
          email: users.email,
          phone: users.phone,
          name: users.name,
          email_is_verified: users.emailIsVerified,
          phone_is_verified: users.phoneIsVerified,
        });

      // Log the action
      await tx
        .insert(actionLogs)
        .values({
          action: 'contact_info_updated_unverified',
          createdBy: accountId,
          resourceType: 'accounts',
          resourceId: accountId
        });

      return updatedUser;
    });

    return NextResponse.json({
      success: true,
      message: 'Contact information updated successfully',
      user: {
        id: result.id,
        email: result.email,
        phone: result.phone,
        name: result.name,
        email_is_verified: result.email_is_verified,
        phone_is_verified: result.phone_is_verified
      }
    }, { status: 200 });

  } catch (error) {
    log?.error('Update contact error', error as Error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to update contact information'
    }, { status: 500 });
  }
});
