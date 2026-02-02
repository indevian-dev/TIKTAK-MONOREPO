/**
 * Password Types
 * Types for password validation, strength checking, and requirements
 */

// ═══════════════════════════════════════════════════════════════
// PASSWORD REQUIREMENTS
// ═══════════════════════════════════════════════════════════════

export interface PasswordRequirements {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  specialChars: string;
  preventCommonPasswords: boolean;
  preventUserInfo: boolean;
}

// ═══════════════════════════════════════════════════════════════
// PASSWORD STRENGTH
// ═══════════════════════════════════════════════════════════════

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
  requirements: {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    notCommon: boolean;
    notUserInfo: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════
// PASSWORD VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface ValidatePasswordInput {
  password: string;
  confirmPassword?: string;
  userInfo?: {
    email?: string;
    name?: string;
    username?: string;
  };
}

export interface PasswordValidationResult {
  isValid: boolean;
  isPasswordValid: boolean; // Alias for isValid
  validatedPassword: string | null;
  errors: string[];
  strength?: PasswordStrengthResult;
}

// ═══════════════════════════════════════════════════════════════
// PASSWORD HASHING
// ═══════════════════════════════════════════════════════════════

export interface PasswordHashResult {
  hash: string;
  salt?: string;
  algorithm: 'bcrypt' | 'argon2' | 'pbkdf2';
}

export interface PasswordVerifyInput {
  password: string;
  hash: string;
}

export interface PasswordVerifyResult {
  isValid: boolean;
  needsRehash?: boolean;
}

// ═══════════════════════════════════════════════════════════════
// PASSWORD RESET TOKEN
// ═══════════════════════════════════════════════════════════════

export interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: Date;
  isUsed: boolean;
}

export interface GeneratePasswordResetTokenInput {
  userId: string;
  email: string;
  expiresInMinutes?: number;
}

export interface GeneratePasswordResetTokenResult {
  success: boolean;
  token?: string;
  expiresAt?: Date;
  error?: string;
}

export interface ValidatePasswordResetTokenInput {
  token: string;
}

export interface ValidatePasswordResetTokenResult {
  isValid: boolean;
  userId?: string;
  error?: PasswordResetTokenError;
}

export type PasswordResetTokenError =
  | 'TOKEN_NOT_FOUND'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_ALREADY_USED'
  | 'TOKEN_INVALID';

// ═══════════════════════════════════════════════════════════════
// PASSWORD HISTORY
// ═══════════════════════════════════════════════════════════════

export interface PasswordHistoryEntry {
  id: number;
  userId: string;
  passwordHash: string;
  createdAt: Date;
}

export interface CheckPasswordHistoryInput {
  userId: string;
  newPassword: string;
  historyLimit?: number; // Check last N passwords
}

export interface CheckPasswordHistoryResult {
  isReused: boolean;
  message?: string;
}

