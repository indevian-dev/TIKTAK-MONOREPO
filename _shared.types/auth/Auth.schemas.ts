import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// AUTH INPUT SCHEMAS — Single Source of Truth
// ═══════════════════════════════════════════════════════════════
// Zod now resolves from root node_modules (bun workspace).
// Types derived with z.infer<> — no manual duplication.
// Both next/ and expo/ import from '@tiktak/shared/types/auth/Auth.schemas'
// ═══════════════════════════════════════════════════════════════

// ─── COMMON FIELDS ─────────────────────────────────────────────

const emailField = z.string().email('Invalid email address');
const passwordField = z.string().min(8, 'Password must be at least 8 characters');
const otpField = z.string().length(6, 'OTP must be exactly 6 characters');
const phoneField = z.string().min(7, 'Invalid phone number');

// ─── LOGIN ─────────────────────────────────────────────────────

export const LoginSchema = z.object({
    email: emailField,
    password: passwordField,
    deviceInfo: z.object({ userAgent: z.string().optional() }).optional(),
});
export type LoginInput = z.infer<typeof LoginSchema>;

// ─── REGISTER ──────────────────────────────────────────────────

export const RegisterSchema = z.object({
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(8, 'Please confirm your password'),
    firstName: z.string().min(2, 'Name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
    phone: phoneField,
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

// ─── OTP / VERIFY ──────────────────────────────────────────────

export const VerifyOtpSchema = z.object({
    type: z.enum(['email', 'phone']),
    target: z.string().min(1, 'Target (email or phone) is required'),
    otp: otpField,
});
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export const EmailOtpSchema = z.object({
    email: emailField,
    otp: otpField,
});
export type EmailOtpInput = z.infer<typeof EmailOtpSchema>;

export const PhoneOtpSchema = z.object({
    phone: phoneField,
    otp: otpField,
});
export type PhoneOtpInput = z.infer<typeof PhoneOtpSchema>;

// ─── TWO FACTOR ────────────────────────────────────────────────

export const TwoFactorValidateSchema = z.object({
    code: otpField,
    type: z.enum(['email', 'totp']).optional().default('email'),
});
export type TwoFactorValidateInput = z.infer<typeof TwoFactorValidateSchema>;

export const TwoFactorGenerateSchema = z.object({
    type: z.enum(['email', 'totp', 'phone']).optional().default('email'),
});
export type TwoFactorGenerateInput = z.infer<typeof TwoFactorGenerateSchema>;

// ─── PASSWORD RESET ────────────────────────────────────────────

export const PasswordResetRequestSchema = z.object({
    email: emailField.optional(),
    phone: phoneField.optional(),
    operation: z.string().optional().default('verification'),
}).refine(
    (data: { email?: string; phone?: string }) => data.email || data.phone,
    { message: 'Either email or phone is required', path: ['email'] }
);
export type PasswordResetRequestInput = z.infer<typeof PasswordResetRequestSchema>;

export const PasswordResetSetSchema = z.object({
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(8),
    otp: otpField,
}).refine(
    (data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword,
    { message: 'Passwords do not match', path: ['confirmPassword'] }
);
export type PasswordResetSetInput = z.infer<typeof PasswordResetSetSchema>;

// ─── UPDATE CONTACT ────────────────────────────────────────────

export const UpdateContactSchema = z.object({
    email: emailField.optional(),
    phone: phoneField.optional(),
}).refine(
    (data: { email?: string; phone?: string }) => data.email || data.phone,
    { message: 'Either email or phone is required', path: ['email'] }
);
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;

// ─── OAUTH ─────────────────────────────────────────────────────

export const OAuthInitiateSchema = z.object({
    provider: z.enum(['google', 'facebook', 'apple'], {
        errorMap: () => ({ message: 'Provider must be one of: google, facebook, apple' }),
    }),
});
export type OAuthInitiateInput = z.infer<typeof OAuthInitiateSchema>;

export const OAuthCallbackSchema = z.object({
    code: z.string().min(1, 'Authorization code is required'),
    state: z.string().optional(),
    provider: z.enum(['google', 'facebook', 'apple']).optional(),
});
export type OAuthCallbackInput = z.infer<typeof OAuthCallbackSchema>;

// ─── AVATAR ────────────────────────────────────────────────────

export const AvatarUploadSchema = z.object({
    fileType: z.string().min(1, 'File type is required'),
    fileName: z.string().min(1, 'File name is required'),
});
export type AvatarUploadInput = z.infer<typeof AvatarUploadSchema>;
