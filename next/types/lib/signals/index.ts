/**
 * Signal Types - Central Export
 * All notification signal types (Email, SMS, Push)
 */

// ═══════════════════════════════════════════════════════════════
// EMAIL
// ═══════════════════════════════════════════════════════════════

export type {
  EmailTemplate,
  EmailRecipient,
  SendEmailInput,
  EmailAttachment,
  SendEmailResult,
} from './email';

// ═══════════════════════════════════════════════════════════════
// SMS
// ═══════════════════════════════════════════════════════════════

export type {
  SMSTemplate,
  SendSMSInput,
  SendSMSResult,
} from './sms';

