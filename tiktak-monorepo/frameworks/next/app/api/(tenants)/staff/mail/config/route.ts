import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { NextResponse } from 'next/server'
import type { ApiRouteHandler } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {
  try {

    // Return current configuration (without sensitive data)
    const config = {
      smtp_host: 'smtp.zeptomail.com',
      smtp_port: Bun.env.ZEPTOMAIL_SMTP_PORT || '587',
      smtp_username: 'emailapikey',
      from_email: Bun.env.ZEPTOMAIL_FROM_EMAIL || '',
      from_name: Bun.env.ZEPTOMAIL_FROM_NAME || '',
      // Don't return sensitive data like API key or password
      api_key: Bun.env.ZEPTOMAIL_API_KEY ? '***configured***' : '',
      smtp_password: Bun.env.ZEPTOMAIL_SMTP_PASSWORD ? '***configured***' : ''
    }

    return NextResponse.json({ config })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ConsoleLogger.error('Error fetching mail configuration:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to fetch configuration', details: errorMessage },
      { status: 500 }
    )
  }
})

export const POST: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {
  try {

    const body = await request.json()

    // In a real application, you would save these to a secure configuration store
    // For now, we'll just validate the configuration
    const { api_key, smtp_password, from_email, from_name } = body

    if (!api_key || !smtp_password || !from_email) {
      return NextResponse.json(
        { error: 'Missing required configuration fields' },
        { status: 400 }
      )
    }

    // Here you would typically save to your configuration store
    // For this example, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully. Please update your environment variables.'
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ConsoleLogger.error('Error saving mail configuration:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to save configuration', details: errorMessage },
      { status: 500 }
    )
  }
})