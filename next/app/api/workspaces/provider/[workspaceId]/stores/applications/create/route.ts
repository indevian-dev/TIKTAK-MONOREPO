import { unifiedApiHandler } from '@/lib/middleware/handlers/ApiInterceptor';
import { NextResponse } from 'next/server';
import { cleanPhoneNumber, validateAzerbaijanPhone } from '@/lib/utils/formatting/phoneFormatterUtility';
import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

export const POST = unifiedApiHandler(async (req, { module, auth }) => {
  try {
    // Get authenticated account ID
    if (!auth || !auth.account) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Validate required fields (Basic check, service does detailed check but good to fail fast)
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

    const result = await module.stores.submitApplication({
      contact_name,
      phone: cleanedPhone,
      email,
      voen,
      store_name,
      store_address
    });

    // Send email notification to admins (optional - can be implemented later)
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
});