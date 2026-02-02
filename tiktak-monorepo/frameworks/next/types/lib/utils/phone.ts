/**
 * Phone Utility Types
 * Types for phone number validation and formatting
 */

// ═══════════════════════════════════════════════════════════════
// PHONE VALIDATION
// ═══════════════════════════════════════════════════════════════

export interface PhoneValidationResult {
  isPhoneValid: boolean;
  validatedPhone: string | null;
  errors: string[];
  countryCode?: string;
  nationalNumber?: string;
}

export interface PhoneFormatOptions {
  countryCode?: string;
  format?: 'E164' | 'INTERNATIONAL' | 'NATIONAL' | 'RFC3966';
  defaultCountry?: string;
}

// ═══════════════════════════════════════════════════════════════
// PHONE OPERATIONS
// ═══════════════════════════════════════════════════════════════

export interface CleanPhoneResult {
  cleanedPhone: string;
  originalPhone: string;
}

export interface FormattedPhoneResult {
  formattedPhone: string;
  format: string;
  isValid: boolean;
}

export interface ParsedPhone {
  countryCode: string;
  nationalNumber: string;
  extension?: string;
  isValid: boolean;
  isPossible: boolean;
  country?: string;
  type?: PhoneNumberType;
}

export type PhoneNumberType = 
  | 'FIXED_LINE'
  | 'MOBILE'
  | 'FIXED_LINE_OR_MOBILE'
  | 'TOLL_FREE'
  | 'PREMIUM_RATE'
  | 'SHARED_COST'
  | 'VOIP'
  | 'PERSONAL_NUMBER'
  | 'PAGER'
  | 'UAN'
  | 'VOICEMAIL'
  | 'UNKNOWN';

// ═══════════════════════════════════════════════════════════════
// COUNTRY SPECIFIC
// ═══════════════════════════════════════════════════════════════

export interface CountryPhoneConfig {
  country: string;
  countryCode: string;
  format: string;
  pattern: RegExp;
  placeholder: string;
}

export const AzerbaijanPhoneConfig: CountryPhoneConfig = {
  country: 'AZ',
  countryCode: '+994',
  format: '+994 XX XXX XX XX',
  pattern: /^\+994\d{9}$/,
  placeholder: '+994 XX XXX XX XX',
};

