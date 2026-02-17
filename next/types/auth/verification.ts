/**
 * Verification Types
 * Types for email and phone verification flows
 */

// ═══════════════════════════════════════════════════════════════
// VERIFICATION TYPES
// ═══════════════════════════════════════════════════════════════

export type VerificationType = 'email' | 'phone';
export type VerificationStatus = 'pending' | 'verified' | 'expired' | 'failed';

// ═══════════════════════════════════════════════════════════════
// EMAIL VERIFICATION
// ═══════════════════════════════════════════════════════════════

export interface SendEmailVerificationRequest {
  email: string;
  userId: string;
  language?: string;
}

export interface SendEmailVerificationResponse {
  success: boolean;
  message: string;
  sent: boolean;
  expiresAt?: Date;
  devCode?: string; // Only in development
}

export interface VerifyEmailRequest {
  code: string;
  userId?: string;
  token?: string; // Alternative: token-based verification
}

export interface VerifyEmailResponse {
  success: boolean;
  verified: boolean;
  message: string;
  email?: string;
}

// ═══════════════════════════════════════════════════════════════
// PHONE VERIFICATION
// ═══════════════════════════════════════════════════════════════

export interface SendPhoneVerificationRequest {
  phone: string;
  userId: string;
  countryCode?: string;
  method?: 'sms' | 'call';
}

export interface SendPhoneVerificationResponse {
  success: boolean;
  message: string;
  sent: boolean;
  expiresAt?: Date;
  devCode?: string; // Only in development
}

export interface VerifyPhoneRequest {
  code: string;
  userId?: string;
  phone?: string;
}

export interface VerifyPhoneResponse {
  success: boolean;
  verified: boolean;
  message: string;
  phone?: string;
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION TOKEN
// ═══════════════════════════════════════════════════════════════

export interface VerificationToken {
  id: number;
  userId: string;
  type: VerificationType;
  token: string;
  code?: string;
  target: string; // Email or phone number
  status: VerificationStatus;
  attempts: number;
  maxAttempts: number;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION CODE GENERATION
// ═══════════════════════════════════════════════════════════════

export interface GenerateVerificationCodeInput {
  userId: string;
  type: VerificationType;
  target: string; // Email or phone
  codeLength?: number;
  expiresInMinutes?: number;
}

export interface GenerateVerificationCodeResult {
  success: boolean;
  code?: string;
  token?: string;
  expiresAt?: Date;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION CODE VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface ValidateVerificationCodeInput {
  userId: string;
  type: VerificationType;
  code: string;
  target?: string;
}

export interface ValidateVerificationCodeResult {
  isValid: boolean;
  verified: boolean;
  error?: VerificationError;
  remainingAttempts?: number;
}

export type VerificationError =
  | 'CODE_NOT_FOUND'
  | 'CODE_EXPIRED'
  | 'CODE_INVALID'
  | 'CODE_ALREADY_USED'
  | 'TOO_MANY_ATTEMPTS'
  | 'USER_NOT_FOUND'
  | 'ALREADY_VERIFIED';

// ═══════════════════════════════════════════════════════════════
// RESEND VERIFICATION
// ═══════════════════════════════════════════════════════════════

export interface ResendVerificationRequest {
  type: VerificationType;
  userId?: string;
  email?: string;
  phone?: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
  sent: boolean;
  nextAllowedAt?: string;
  cooldownSeconds?: number;
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION STATUS CHECK
// ═══════════════════════════════════════════════════════════════

export interface CheckVerificationStatusRequest {
  userId: string;
  type?: VerificationType;
}

export interface CheckVerificationStatusResponse {
  emailVerified: boolean;
  phoneVerified: boolean;
  email?: string;
  phone?: string;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
}

// ═══════════════════════════════════════════════════════════════
// CHANGE EMAIL/PHONE WITH VERIFICATION
// ═══════════════════════════════════════════════════════════════

export interface ChangeEmailRequest {
  newEmail: string;
  password: string;
}

export interface ChangeEmailResponse {
  success: boolean;
  message: string;
  verificationSent: boolean;
  verificationRequired: boolean;
}

export interface ChangePhoneRequest {
  newPhone: string;
  countryCode?: string;
  password: string;
}

export interface ChangePhoneResponse {
  success: boolean;
  message: string;
  verificationSent: boolean;
  verificationRequired: boolean;
}

// ═══════════════════════════════════════════════════════════════
// VERIFICATION CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface VerificationConfig {
  email: {
    enabled: boolean;
    required: boolean;
    codeLength: number;
    expiryMinutes: number;
    maxAttempts: number;
    resendCooldownSeconds: number;
  };
  phone: {
    enabled: boolean;
    required: boolean;
    codeLength: number;
    expiryMinutes: number;
    maxAttempts: number;
    resendCooldownSeconds: number;
    defaultMethod: 'sms' | 'call';
  };
}

