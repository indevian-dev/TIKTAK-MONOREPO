/**
 * Value Objects with Business Logic
 * Domain value objects that encapsulate behavior
 */

// ═══════════════════════════════════════════════════════════════
// MONEY VALUE OBJECT
// ═══════════════════════════════════════════════════════════════

/**
 * Money value object
 * Represents monetary amount with currency
 */
export interface Money {
  amount: number;
  currency: string; // ISO 4217 currency code (e.g., 'AZN', 'USD')
}

export namespace Money {
  /**
   * Create a Money value object
   */
  export function create(amount: number, currency: string = 'AZN'): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    return { amount, currency: currency.toUpperCase() };
  }

  /**
   * Format money for display
   */
  export function format(money: Money, locale: string = 'az-AZ'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(money.amount);
  }

  /**
   * Add two money values (must be same currency)
   */
  export function add(a: Money, b: Money): Money {
    if (a.currency !== b.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return { amount: a.amount + b.amount, currency: a.currency };
  }

  /**
   * Subtract two money values (must be same currency)
   */
  export function subtract(a: Money, b: Money): Money {
    if (a.currency !== b.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return { amount: a.amount - b.amount, currency: a.currency };
  }

  /**
   * Multiply money by a factor
   */
  export function multiply(money: Money, factor: number): Money {
    return { amount: money.amount * factor, currency: money.currency };
  }

  /**
   * Check if two money values are equal
   */
  export function equals(a: Money, b: Money): boolean {
    return a.amount === b.amount && a.currency === b.currency;
  }

  /**
   * Compare two money values (must be same currency)
   */
  export function compare(a: Money, b: Money): -1 | 0 | 1 {
    if (a.currency !== b.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    if (a.amount < b.amount) return -1;
    if (a.amount > b.amount) return 1;
    return 0;
  }
}

// ═══════════════════════════════════════════════════════════════
// PHONE NUMBER VALUE OBJECT
// ═══════════════════════════════════════════════════════════════

/**
 * PhoneNumber value object
 * Represents a phone number with country code
 */
export interface PhoneNumber {
  countryCode: string; // e.g., '+994'
  number: string; // National number without country code
  isVerified: boolean;
}

export namespace PhoneNumber {
  /**
   * Create a PhoneNumber value object
   */
  export function create(
    countryCode: string,
    number: string,
    isVerified: boolean = false
  ): PhoneNumber {
    // Remove any non-digit characters from number
    const cleanNumber = number.replace(/\D/g, '');
    
    // Ensure country code starts with +
    const cleanCountryCode = countryCode.startsWith('+') 
      ? countryCode 
      : `+${countryCode}`;

    return {
      countryCode: cleanCountryCode,
      number: cleanNumber,
      isVerified,
    };
  }

  /**
   * Format phone number for display
   */
  export function format(phone: PhoneNumber): string {
    return `${phone.countryCode} ${phone.number}`;
  }

  /**
   * Get full international format
   */
  export function toInternational(phone: PhoneNumber): string {
    return `${phone.countryCode}${phone.number}`;
  }

  /**
   * Parse phone number from string
   */
  export function parse(phoneString: string): PhoneNumber {
    // Simple parsing - can be enhanced with libphonenumber if needed
    const cleaned = phoneString.replace(/\D/g, '');
    
    if (cleaned.startsWith('994')) {
      return create('+994', cleaned.substring(3));
    }
    
    if (cleaned.startsWith('1')) {
      return create('+1', cleaned.substring(1));
    }

    // Default to Azerbaijan
    return create('+994', cleaned);
  }

  /**
   * Validate phone number format
   */
  export function isValid(phone: PhoneNumber): boolean {
    // Basic validation
    return (
      phone.countryCode.startsWith('+') &&
      phone.number.length >= 7 &&
      phone.number.length <= 15 &&
      /^\d+$/.test(phone.number)
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// LOCATION VALUE OBJECT
// ═══════════════════════════════════════════════════════════════

/**
 * Location value object
 * Represents geographic location with coordinates
 */
export interface Location {
  latitude: number;
  longitude: number;
  address?: string | null;
  city?: string | null;
  country?: string | null;
}

export namespace Location {
  /**
   * Create a Location value object
   */
  export function create(
    latitude: number,
    longitude: number,
    address?: string,
    city?: string,
    country?: string
  ): Location {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be between -90 and 90');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be between -180 and 180');
    }

    return {
      latitude,
      longitude,
      address: address || null,
      city: city || null,
      country: country || null,
    };
  }

  /**
   * Calculate distance between two locations (Haversine formula)
   * Returns distance in kilometers
   */
  export function distance(from: Location, to: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(to.latitude - from.latitude);
    const dLon = toRad(to.longitude - from.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(from.latitude)) *
        Math.cos(toRad(to.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Format location for display
   */
  export function format(location: Location): string {
    const parts = [
      location.address,
      location.city,
      location.country,
    ].filter(Boolean);

    return parts.length > 0
      ? parts.join(', ')
      : `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  /**
   * Convert degrees to radians
   */
  function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Check if location is within bounds
   */
  export function isWithinBounds(
    location: Location,
    bounds: { north: number; south: number; east: number; west: number }
  ): boolean {
    return (
      location.latitude <= bounds.north &&
      location.latitude >= bounds.south &&
      location.longitude <= bounds.east &&
      location.longitude >= bounds.west
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// PAGINATION HELPERS
// ═══════════════════════════════════════════════════════════════

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export namespace Pagination {
  /**
   * Create pagination metadata
   */
  export function create(
    page: number,
    pageSize: number,
    total: number
  ): Pagination {
    const totalPages = Math.ceil(total / pageSize);
    
    return {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  /**
   * Calculate offset for database queries
   */
  export function getOffset(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }

  /**
   * Validate pagination parameters
   */
  export function validate(page: number, pageSize: number): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (page < 1) {
      errors.push('Page must be greater than 0');
    }

    if (pageSize < 1) {
      errors.push('Page size must be greater than 0');
    }

    if (pageSize > 100) {
      errors.push('Page size cannot exceed 100');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

