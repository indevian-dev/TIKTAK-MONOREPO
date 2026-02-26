/**
 * ID Validation Utility
 * Provides simple ID validation for API route parameters
 */

interface IdValidationResult {
  isValid: boolean;
  sanitized: string;
}

export class ValidationService {
  /**
   * Validate and sanitize an ID parameter
   * Accepts strings and numbers, rejects empty/null/undefined
   */
  static validateId(id: unknown): IdValidationResult {
    if (id === null || id === undefined || id === '') {
      return { isValid: false, sanitized: '' };
    }

    const stringId = String(id).trim();

    if (stringId === '' || stringId === 'undefined' || stringId === 'null') {
      return { isValid: false, sanitized: '' };
    }

    return { isValid: true, sanitized: stringId };
  }
}
