import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { storesApplications, actionLogs } from '@/db/schema';
import { cleanPhoneNumber, validateAzerbaijanPhone } from '@/lib/utils/phoneUtility';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const POST = withApiHandler(async (req: NextRequest, { authData, params, db }: ApiHandlerContext) => {
  try {
    // Get authenticated account ID
    if (!authData || !authData.account) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const accountId = authData.account.id;

    // Parse the request body
    const body = await req.json();
    const {
      contact_name,
      phone,
      email,
      voen,
      store_name,
      store_address
    } = body;

    // Validate required fields
    if (!contact_name || !phone || !email || !voen || !store_name || !store_address) {
      return NextResponse.json({
        error: 'All fields are required: contact_name, phone, email, voen, store_name, store_address'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Validate Azerbaijan phone number format
    if (!validateAzerbaijanPhone(phone)) {
      return NextResponse.json({
        error: 'Please enter a valid Azerbaijan phone number'
      }, { status: 400 });
    }

    // Clean phone number for storage
    const cleanedPhone = cleanPhoneNumber(phone);

    // Use a transaction to handle all operations
    const result = await db.transaction(async (tx: DbTransaction) => {
      // Check if VOEN already exists
      const [existingApplication] = await tx
        .select({ id: storesApplications.id })
        .from(storesApplications)
        .where(eq(storesApplications.voen, voen));

      if (existingApplication) {
        throw new Error('An application with this VOEN already exists');
      }

      // Check if user already has a pending application
      const [userApplication] = await tx
        .select({ id: storesApplications.id })
        .from(storesApplications)
        .where(eq(storesApplications.accountId, accountId));

      if (userApplication) {
        throw new Error('You already have a pending store application');
      }

      // Create the store application
      const [newApplication] = await tx.insert(storesApplications).values({
        contactName: contact_name,
        phone: cleanedPhone,
        email,
        voen,
        storeName: store_name,
        storeAddress: store_address,
        accountId
      } as any).returning();

      // Log the action
      return newApplication;
    });

    // Send email notification to admins (optional - can be implemented later)
    // This would typically be sent to admin users, for now we'll just log it
    ConsoleLogger.log('📧 Store application notification should be sent to admins:', {
      applicant: contact_name,
      store_name: store_name,
      email: email,
      phone: cleanedPhone,
      application_id: result.id
    });

    return NextResponse.json({
      message: 'Store application submitted successfully',
      data: {
        id: result.id,
        contact_name: result.contactName,
        store_name: result.storeName,
        created_at: result.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Handle specific error cases
    if (errorMessage.includes('VOEN already exists')) {
      return NextResponse.json({
        error: 'An application with this VOEN already exists'
      }, { status: 409 });
    }

    if (errorMessage.includes('already have a pending')) {
      return NextResponse.json({
        error: 'You already have a pending store application'
      }, { status: 409 });
    }

    return NextResponse.json({
      error: errorMessage || 'Failed to submit store application'
    }, { status: 500 });
  }
})