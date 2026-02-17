/**
 * Two-Factor Authentication Types
 * Types for 2FA configuration, challenges, and verification
 */

// ═══════════════════════════════════════════════════════════════
// 2FA METHODS
// ═══════════════════════════════════════════════════════════════

export type TwoFactorMethod = 'sms' | 'email' | 'authenticator' | 'backup_codes';

export const TwoFactorMethods = {
  SMS: 'sms',
  EMAIL: 'email',
  AUTHENTICATOR: 'authenticator',
  BACKUP_CODES: 'backup_codes',
} as const;

// ═══════════════════════════════════════════════════════════════
// 2FA CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export interface TwoFactorConfig {
  userId: string;
  enabled: boolean;
  primaryMethod?: TwoFactorMethod;
  enabledMethods: TwoFactorMethod[];
  backupCodesGenerated: boolean;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════
// 2FA SETUP
// ═══════════════════════════════════════════════════════════════

export interface SetupTwoFactorRequest {
  method: TwoFactorMethod;
  phoneNumber?: string; // For SMS
  email?: string; // For email
}

export interface SetupTwoFactorResponse {
  success: boolean;
  method: TwoFactorMethod;
  qrCode?: string; // For authenticator app
  secret?: string; // For manual entry in authenticator
  backupCodes?: string[]; // Generated backup codes
  verificationRequired: boolean;
}

// ═══════════════════════════════════════════════════════════════
// 2FA VERIFICATION
// ═══════════════════════════════════════════════════════════════

export interface VerifyTwoFactorRequest {
  code: string;
  method: TwoFactorMethod;
  trustDevice?: boolean;
}

export interface VerifyTwoFactorResponse {
  success: boolean;
  verified: boolean;
  remainingAttempts?: number;
  trustedDeviceToken?: string;
  message?: string;
}

// ═══════════════════════════════════════════════════════════════
// 2FA CHALLENGE
// ═══════════════════════════════════════════════════════════════

export interface TwoFactorChallenge {
  id: string;
  userId: string;
  method: TwoFactorMethod;
  code: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  isVerified: boolean;
}

export interface CreateTwoFactorChallengeInput {
  userId: string;
  method: TwoFactorMethod;
  expiresInMinutes?: number;
}

export interface CreateTwoFactorChallengeResult {
  success: boolean;
  challengeId?: string;
  code?: string;
  expiresAt?: Date;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// BACKUP CODES
// ═══════════════════════════════════════════════════════════════

export interface BackupCode {
  id: number;
  userId: string;
  code: string;
  used: boolean;
  usedAt?: Date;
  createdAt: Date;
}

export interface GenerateBackupCodesRequest {
  count?: number; // Default: 10
}

export interface GenerateBackupCodesResponse {
  success: boolean;
  codes: string[];
  message: string;
}

export interface UseBackupCodeRequest {
  code: string;
}

export interface UseBackupCodeResponse {
  success: boolean;
  verified: boolean;
  remainingCodes: number;
  message?: string;
}

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATOR APP
// ═══════════════════════════════════════════════════════════════

export interface AuthenticatorSetup {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
  issuer: string;
  accountName: string;
}

export interface VerifyAuthenticatorRequest {
  secret: string;
  code: string;
}

export interface VerifyAuthenticatorResponse {
  success: boolean;
  verified: boolean;
  backupCodes?: string[];
}

// ═══════════════════════════════════════════════════════════════
// TRUSTED DEVICES
// ═══════════════════════════════════════════════════════════════

export interface TrustedDevice {
  id: string;
  userId: string;
  deviceToken: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  ipAddress: string;
  userAgent: string;
  trustedAt: Date;
  lastUsedAt: Date;
  expiresAt?: Date;
}

export interface RegisterTrustedDeviceInput {
  userId: string;
  deviceName?: string;
  ipAddress: string;
  userAgent: string;
  expiresInDays?: number; // Default: 30
}

export interface RegisterTrustedDeviceResult {
  success: boolean;
  deviceToken?: string;
  expiresAt?: Date;
}

export interface RemoveTrustedDeviceRequest {
  deviceId: string;
}

export interface RemoveTrustedDeviceResponse {
  success: boolean;
  message: string;
}

// ═══════════════════════════════════════════════════════════════
// 2FA DISABLE
// ═══════════════════════════════════════════════════════════════

export interface DisableTwoFactorRequest {
  password: string;
  verificationCode?: string;
}

export interface DisableTwoFactorResponse {
  success: boolean;
  message: string;
}

// ═══════════════════════════════════════════════════════════════
// 2FA STATUS
// ═══════════════════════════════════════════════════════════════

export interface TwoFactorStatusResponse {
  enabled: boolean;
  primaryMethod?: TwoFactorMethod;
  enabledMethods: TwoFactorMethod[];
  backupCodesRemaining: number;
  trustedDevices: number;
  lastUsedAt?: string;
}

