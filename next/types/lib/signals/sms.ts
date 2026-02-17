/**
 * SMS Signal Types
 * Types for SMS generation and sending
 */

// ═══════════════════════════════════════════════════════════════
// SMS TEMPLATE
// ═══════════════════════════════════════════════════════════════

export interface SMSTemplate {
  message: string;
  encoding?: 'GSM-7' | 'UCS-2';
}

export interface SendSMSInput {
  to: string; // Phone number in international format
  template: SMSTemplate;
  from?: string;
}

export interface SendSMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  segmentCount?: number;
}

