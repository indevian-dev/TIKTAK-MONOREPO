import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';

import { NextResponse } from 'next/server';
import type { ApiRouteHandler } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params }) => {
  // Validate API Request (Auth, Permissions, 2FA, Suspension)
  // Auth handled by withApiHandler - authData available in context
try {
    // Verify authentication
    if (!authData || !authData.account) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authAccId = authData.account.id

    // Check environment variables for configuration
    const apiKey = Bun.env.ZEPTOMAIL_API_KEY
    const smtpPassword = Bun.env.ZEPTOMAIL_SMTP_PASSWORD
    const fromEmail = Bun.env.ZEPTOMAIL_FROM_EMAIL
    const mailAgent = Bun.env.ZEPTOMAIL_MAIL_AGENT

    const api_configured = !!apiKey
    const smtp_configured = !!smtpPassword

    let status = 'operational'
    let message = 'ZeptoMail service is operational'

    if (!api_configured && !smtp_configured) {
      status = 'down'
      message = 'ZeptoMail is not configured. Please add API key and SMTP credentials.'
    } else if (!api_configured || !smtp_configured) {
      status = 'degraded'
      message = 'ZeptoMail is partially configured. Some features may not work.'
    }

    return NextResponse.json({
      status,
      message,
      api_configured,
      smtp_configured,
      mail_agent: mailAgent || 'Not configured',
      last_checked: new Date().toISOString()
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    ConsoleLogger.error('Error checking mail service status:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to check service status', details: errorMessage },
      { status: 500 }
    )
  }
})