/**
 * Password Utility Types
 * Types for password hashing and validation utilities
 */

// ═══════════════════════════════════════════════════════════════
// PASSWORD VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface PasswordValidationResult {
  isPasswordValid: boolean;
  validatedPassword: string | null;
  errors: string[];
  strength?: PasswordStrength;
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';

// ═══════════════════════════════════════════════════════════════
// PASSWORD HASHING
// ═══════════════════════════════════════════════════════════════

export interface HashPasswordResult {
  hashedPassword: string;
  salt?: string;
}

export interface HashPasswordOptions {
  rounds?: number;
  algorithm?: 'bcrypt' | 'argon2' | 'pbkdf2';
}

// ═══════════════════════════════════════════════════════════════
// PASSWORD VERIFICATION
// ═══════════════════════════════════════════════════════════════

export interface VerifyPasswordResult {
  isPasswordValid: boolean;
  needsRehash?: boolean;
}

export interface VerifyPasswordOptions {
  checkStrength?: boolean;
  requireMinStrength?: PasswordStrength;
}

// ═══════════════════════════════════════════════════════════════
// PASSWORD GENERATION
// ═══════════════════════════════════════════════════════════════

export interface GeneratePasswordOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  excludeSimilar?: boolean;
  excludeAmbiguous?: boolean;
  customCharset?: string;
}

export interface GeneratePasswordResult {
  password: string;
  strength: PasswordStrength;
}

