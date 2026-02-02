import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';

import { NextResponse } from 'next/server';
import type { ApiRouteHandler } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const POST: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {

  try {
    const body = await request.json()
    const { to_email, to_name, subject, htmlbody, textbody } = body

    // Validate required fields
    if (!to_email || !subject || !htmlbody) {
      return NextResponse.json(
        { error: 'Missing required fields: to_email, subject, htmlbody' },
        { status: 400 }
      )
    }

    // Get configuration from environment variables
    const apiKey = Bun.env.ZEPTOMAIL_API_KEY
    const fromEmail = Bun.env.ZEPTOMAIL_FROM_EMAIL
    const fromName = Bun.env.ZEPTOMAIL_FROM_NAME || 'Your App'

    if (!apiKey || !fromEmail) {
      return NextResponse.json(
        { error: 'ZeptoMail not configured. Please set API key and from email.' },
        { status: 500 }
      )
    }

    // Prepare email payload for ZeptoMail API
    const emailPayload: any = {
      from: {
        address: fromEmail,
        name: fromName
      },
      to: [{
        email_address: {
          address: to_email,
          name: to_name || to_email
        }
      }],
      subject,
      htmlbody
    }

    // Add text body if provided
    if (textbody) {
      emailPayload.textbody = textbody
    }

    // Send email via ZeptoMail API
    const response = await fetch('https://zeptomail.zoho.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Zoho-enczapikey ${apiKey}`
      },
      body: JSON.stringify(emailPayload)
    })

    const result = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        message_id: result.data?.[0]?.message_id || 'unknown',
        status: 'sent'
      })
    } else {
      return NextResponse.json(
        { error: result.message || 'Failed to send email via ZeptoMail' },
        { status: response.status }
      )
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ConsoleLogger.error('Error sending email:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to send email', details: errorMessage },
      { status: 500 }
    )
  }
})