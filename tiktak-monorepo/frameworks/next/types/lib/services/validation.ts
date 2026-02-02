/**
 * Validation Service Types
 * Types for the validation service
 */

// ═══════════════════════════════════════════════════════════════
// VALIDATION ERROR
// ═══════════════════════════════════════════════════════════════

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: any;
}

// ═══════════════════════════════════════════════════════════════
// VALIDATION RESULT
// ═══════════════════════════════════════════════════════════════

export interface ValidationResult<T = any> {
  isValid: boolean;
  errors: ValidationError[];
  sanitized?: T;
  firstError?: ValidationError | null;
}

// ═══════════════════════════════════════════════════════════════
// VALIDATION RULE
// ═══════════════════════════════════════════════════════════════

export interface ValidationRule<T = any> {
  validate: (value: T, ...args: any[]) => boolean;
  message: string;
  code?: string;
}

// ═══════════════════════════════════════════════════════════════
// SANITIZER FUNCTION
// ═══════════════════════════════════════════════════════════════

export interface SanitizerFunction {
  (value: any, ...args: any[]): any;
}

// ═══════════════════════════════════════════════════════════════
// VALIDATION SCHEMA
// ═══════════════════════════════════════════════════════════════

export interface ValidationSchema {
  [key: string]: {
    rules: ValidationRule[];
    sanitizers?: SanitizerFunction[];
    optional?: boolean;
    defaultValue?: any;
  };
}

// ═══════════════════════════════════════════════════════════════
// FIELD VALIDATION CONFIG
// ═══════════════════════════════════════════════════════════════

export interface FieldValidationConfig {
  rules: ValidationRule[];
  sanitizers?: SanitizerFunction[];
  optional?: boolean;
  defaultValue?: any;
  customValidation?: (value: any, allValues: any) => boolean | string;
}

// ═══════════════════════════════════════════════════════════════
// COMMON VALIDATION TYPES
// ═══════════════════════════════════════════════════════════════

export interface EmailValidationResult {
  isValid: boolean;
  email?: string;
  error?: string;
}

export interface PhoneValidationResult {
  isValid: boolean;
  phone?: string;
  countryCode?: string;
  error?: string;
}

export interface UrlValidationResult {
  isValid: boolean;
  url?: string;
  protocol?: string;
  domain?: string;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════
// VALIDATION OPTIONS
// ═══════════════════════════════════════════════════════════════

export interface ValidationOptions {
  abortEarly?: boolean; // Stop on first error
  stripUnknown?: boolean; // Remove unknown fields
  allowUnknown?: boolean; // Allow unknown fields
  context?: Record<string, any>; // Additional context for validation
}

// ═══════════════════════════════════════════════════════════════
// VALIDATOR PRESETS
// ═══════════════════════════════════════════════════════════════

export interface ValidatorPresets {
  email: ValidationRule;
  phone: ValidationRule;
  url: ValidationRule;
  required: (message?: string) => ValidationRule;
  minLength: (length: number, message?: string) => ValidationRule;
  maxLength: (length: number, message?: string) => ValidationRule;
  min: (value: number, message?: string) => ValidationRule;
  max: (value: number, message?: string) => ValidationRule;
  pattern: (regex: RegExp, message?: string) => ValidationRule;
  oneOf: (values: any[], message?: string) => ValidationRule;
}

