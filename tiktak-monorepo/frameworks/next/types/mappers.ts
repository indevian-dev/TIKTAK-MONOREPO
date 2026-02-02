/**
 * Mappers - Central Export
 * Re-exports all resource mappers and provides utility functions
 */

// ═══════════════════════════════════════════════════════════════
// STORE MAPPERS
// ═══════════════════════════════════════════════════════════════

export {
  mapStoreToPublic,
  mapStoreToFull,
  mapStoreToPrivate,
  mapStoresToPublic,
  mapStoresToFull,
} from './resources/store/storeMapper';

// Aliases for compatibility
export { mapStoreToPrivate as mapStoreToProvider } from './resources/store/storeMapper';
export { mapStoreToPrivate as mapStoreToAdmin } from './resources/store/storeMapper';

// ═══════════════════════════════════════════════════════════════
// CARD MAPPERS
// ═══════════════════════════════════════════════════════════════

export {
  mapCardToPublic,
  mapCardToFull,
  mapCardToPrivate,
  mapCardsToPublic,
  mapCardsToFull,
} from './resources/card/cardMapper';

// Aliases for compatibility
export { mapCardToPrivate as mapCardToProvider } from './resources/card/cardMapper';
export { mapCardToPrivate as mapCardToAdmin } from './resources/card/cardMapper';

// ═══════════════════════════════════════════════════════════════
// ACCOUNT MAPPERS
// ═══════════════════════════════════════════════════════════════

export {
  mapAccountToPublic,
  mapAccountToFull,
  mapAccountToPrivate,
  mapAccountRoleToRole,
  mapAccountsToPublic,
  mapAccountsToFull,
} from './resources/account/accountMapper';

// Aliases for compatibility
export { mapAccountToPrivate as mapAccountToSelf } from './resources/account/accountMapper';
export { mapAccountToPrivate as mapAccountToAdmin } from './resources/account/accountMapper';

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Convert Date to ISO string, handling null/undefined
 */
export function dateToIsoString(date?: Date | string | null): string | undefined {
  if (!date) return undefined;
  if (typeof date === 'string') return date;
  return date.toISOString();
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transform all keys in an object from snake_case to camelCase
 */
export function transformKeys<T extends Record<string, any>>(
  obj: T
): Record<string, any> {
  const transformed: Record<string, any> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamel(key);
      const value = obj[key];
      
      // Recursively transform nested objects
      if (value && typeof value === 'object' && !Array.isArray(value) && !((value as any) instanceof Date)) {
        transformed[camelKey] = transformKeys(value);
      } else {
        transformed[camelKey] = value;
      }
    }
  }
  
  return transformed;
}

/**
 * Pick specific fields from an object
 */
export function pickFields<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fields: K[]
): Pick<T, K> {
  const picked: any = {};
  for (const field of fields) {
    if (field in obj) {
      picked[field] = obj[field];
    }
  }
  return picked;
}

/**
 * Omit specific fields from an object
 */
export function omitFields<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fields: K[]
): Omit<T, K> {
  const omitted: any = { ...obj };
  for (const field of fields) {
    delete omitted[field];
  }
  return omitted;
}

/**
 * Map array of items using a mapper function
 */
export function mapArray<TInput, TOutput>(
  items: TInput[],
  mapper: (item: TInput, index: number) => TOutput
): TOutput[] {
  return items.map(mapper);
}

/**
 * Map array of items using an async mapper function
 */
export async function mapArrayAsync<TInput, TOutput>(
  items: TInput[],
  mapper: (item: TInput, index: number) => Promise<TOutput>
): Promise<TOutput[]> {
  return Promise.all(items.map(mapper));
}

