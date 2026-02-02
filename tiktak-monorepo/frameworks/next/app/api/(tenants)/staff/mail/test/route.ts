import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server'
import type { ApiRouteHandler } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const POST: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {
  try {
    // Verify authentication
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { api_key, from_email } = body

    if (!api_key || !from_email) {
      return NextResponse.json(
        { error: 'API key and from email are required for testing' },
        { status: 400 }
      )
    }

    // Test the connection by making a simple API call to ZeptoMail
    try {
      const response = await fetch('https://zeptomail.zoho.com/v1.1/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Zoho-enczapikey ${api_key}`
        },
        body: JSON.stringify({
          from: {
            address: from_email,
            name: 'Test'
          },
          to: [{
            email_address: {
              address: 'test@example.com',
              name: 'Test'
            }
          }],
          subject: 'Test Connection',
          htmlbody: '<p>This is a test</p>'
        })
      })

      // Even if the email fails to send (due to invalid recipient),
      // a 400 error with proper ZeptoMail response means the connection works
      if (response.status === 400 || response.status === 200) {
        return NextResponse.json({
          success: true,
          message: 'Connection to ZeptoMail API successful'
        })
      } else if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key or authentication failed' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: 'Failed to connect to ZeptoMail API' },
          { status: 400 }
        )
      }

    } catch (fetchError) {
      return NextResponse.json(
        { error: 'Network error connecting to ZeptoMail API' },
        { status: 400 }
      )
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ConsoleLogger.error('Error testing mail connection:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to test connection', details: errorMessage },
      { status: 500 }
    )
  }
})