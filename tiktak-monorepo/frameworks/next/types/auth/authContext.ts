/**
 * Auth Context Types
 * Core authentication context and data structures
 */

import type { Session } from './session';

// ═══════════════════════════════════════════════════════════════
// AUTH DATA (Server-side Context)
// ═══════════════════════════════════════════════════════════════

/**
 * Authentication data passed to API handlers and pages
 * Contains user, account, and session information
 */
export interface AuthData {
  user: {
    id: string;
    email: string;
    name?: string;
    emailIsVerified?: boolean;
    phoneIsVerified?: boolean;
  };
  account: {
    id: number;
    name: string;
    type: string;
    role?: string;
    suspended?: boolean;
    tenantType?: string;
    tenantAccessKey?: number;
  };
  session: Session;
}

// ═══════════════════════════════════════════════════════════════
// LOGIN TYPES
// ═══════════════════════════════════════════════════════════════

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  account?: {
    id: number;
    role: string;
  };
  requiresTwoFactor?: boolean;
  twoFactorToken?: string;
}

// ═══════════════════════════════════════════════════════════════
// REGISTER TYPES
// ═══════════════════════════════════════════════════════════════

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  acceptTerms?: boolean;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    phone?: string;
    name?: string;
    emailIsVerified: boolean;
    phoneIsVerified: boolean;
  };
  account?: {
    id: number;
    role: string;
    isPersonal: boolean;
  };
  verificationRequired?: boolean;
  verificationSent?: {
    email: boolean;
    sms: boolean;
  };
  devCode?: string; // Only in development environment
}

// ═══════════════════════════════════════════════════════════════
// LOGOUT TYPES
// ═══════════════════════════════════════════════════════════════

export interface LogoutRequest {
  refreshToken?: string;
  logoutAll?: boolean; // Logout from all devices
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

// ═══════════════════════════════════════════════════════════════
// PASSWORD RESET TYPES
// ═══════════════════════════════════════════════════════════════

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetTokenSent?: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// ═══════════════════════════════════════════════════════════════
// CHANGE PASSWORD TYPES
// ═══════════════════════════════════════════════════════════════

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

