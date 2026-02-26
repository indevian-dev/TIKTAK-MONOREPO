import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import { cleanPhoneNumber, validateAzerbaijanPhone } from '@/lib/utils/Formatter.Phone.util';
import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { createdResponse, errorResponse, serverErrorResponse } from '@/lib/middleware/Response.Api.middleware';

export const POST = unifiedApiHandler(async (req, { module, auth }) => {
  try {
    // Get authenticated account ID
    if (!auth || !auth.accountId) {
      return errorResponse('Unauthorized', 401);
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
      return errorResponse('All fields are required: contact_name, phone, email, voen, store_name, store_address', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse('Invalid email format', 400);
    }

    // Validate Azerbaijan phone number format
    if (!validateAzerbaijanPhone(phone)) {
      return errorResponse('Please enter a valid Azerbaijan phone number', 400);
    }

    // Clean phone number for storage
    const cleanedPhone = cleanPhoneNumber(phone);

    const result = await module.workspace.submitProviderApplication(
      auth.accountId,
      {
        title: store_name,
        metadata: {
          contact_name,
          phone: cleanedPhone,
          email,
          voen,
          store_address,
        },
      },
      'provider'
    );

    if (!('data' in result)) {
      return errorResponse((result as { success: boolean; error: string }).error ?? 'Failed to submit application', 400);
    }

    // Send email notification to admins (optional - can be implemented later)
    ConsoleLogger.log('📧 Store application notification should be sent to admins:', {
      applicant: contact_name,
      store_name: store_name,
      email: email,
      phone: cleanedPhone,
      application_id: result.data.id
    });

    return createdResponse({
      message: 'Store application submitted successfully',
      data: {
        id: result.data.id,
        contact_name: contact_name,
        store_name: store_name,
        created_at: result.data.createdAt
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Handle specific error cases
    if (errorMessage.includes('VOEN already exists')) {
      return errorResponse('An application with this VOEN already exists', 409);
    }

    if (errorMessage.includes('already have a pending')) {
      return errorResponse('You already have a pending store application', 409);
    }

    return serverErrorResponse(errorMessage || 'Failed to submit store application');
  }
});