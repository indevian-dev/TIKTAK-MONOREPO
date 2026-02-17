/**
 * OTP (One-Time Password) Types
 * Types for OTP generation, validation, and delivery
 */

import type { OtpType as DbOtpType } from '@/lib/domain/user';

// ═══════════════════════════════════════════════════════════════
// OTP TYPE ENUM
// Re-export from database types for consistency
// ═══════════════════════════════════════════════════════════════

export { OtpType } from '@/lib/domain/user';
export type { OtpType as OtpTypeEnum } from '@/lib/domain/user';

// Use the imported type for local references
type OtpType = DbOtpType;

// ═══════════════════════════════════════════════════════════════
// OTP RECORD TYPES
// ═══════════════════════════════════════════════════════════════

export interface OtpRecord {
  id: number;
  createdAt: Date;
  code: string;
  expireAt: Date;
  userId: string;
  type: OtpType;
  attempts?: number;
  isUsed?: boolean;
}

export interface RecentOtpRecord extends OtpRecord {
  isExpired: boolean;
  attempts: number;
  remainingAttempts: number;
}

export interface OtpPartialRecord {
  id: number;
  createdAt: Date;
  expireAt: Date | null;
}

// ═══════════════════════════════════════════════════════════════
// OTP GENERATION
// ═══════════════════════════════════════════════════════════════

export interface GenerateOtpInput {
  userId: string;
  type: OtpType;
  length?: number; // OTP code length (default: 6)
  expiresIn?: number; // Expiry time in minutes (default: 10)
}

export interface GenerateOtpResult {
  success: boolean;
  code?: string;
  otpId?: number;
  expiresAt?: Date;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// OTP VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface ValidateOtpInput {
  userId: string;
  code: string;
  type: OtpType;
}

export interface ValidateOtpResult {
  isValid: boolean;
  otpId?: number;
  error?: OtpValidationError;
  remainingAttempts?: number;
}

export type OtpValidationError =
  | 'OTP_NOT_FOUND'
  | 'OTP_EXPIRED'
  | 'OTP_INVALID'
  | 'OTP_ALREADY_USED'
  | 'TOO_MANY_ATTEMPTS'
  | 'OTP_LOCKED';

// ═══════════════════════════════════════════════════════════════
// OTP STORAGE
// ═══════════════════════════════════════════════════════════════

export interface StoreOtpResult {
  success: boolean;
  otpId?: number;
  error?: string;
  storedOtp?: string;
  isOtpIssued?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// OTP DELIVERY
// ═══════════════════════════════════════════════════════════════

export interface SendOtpInput {
  userId: string;
  type: OtpType;
  destination: string; // Email or phone number
  code: string;
  language?: string;
}

export interface SendOtpResult {
  sent: boolean;
  sendError?: string;
  deliveryMethod: 'email' | 'sms';
}

export interface StoreAndSendOtpResult extends StoreOtpResult {
  sent: boolean;
  sendError?: string;
  emailSent?: boolean;
  smsSent?: boolean;
  emailError?: string;
  smsError?: string;
  otp?: string;
}

// ═══════════════════════════════════════════════════════════════
// OTP RESEND
// ═══════════════════════════════════════════════════════════════

export interface ResendOtpRequest {
  userId: string;
  type: OtpType;
  destination?: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  sent: boolean;
  nextAllowedAt?: string;
}

// ═══════════════════════════════════════════════════════════════
// OTP CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface OtpConfig {
  length: number;
  expiryMinutes: number;
  maxAttempts: number;
  resendDelaySeconds: number;
  lockoutAfterAttempts: number;
  lockoutDurationMinutes: number;
}

