/**
 * @deprecated STUB — staff_apis removed. Migrate to route definitions in lib/routes.
 * This file exists only to prevent build errors.
 */

interface StaffApiEndpoint {
  permission?: string;
  method?: string | string[];
  [key: string]: unknown;
}

/**
 * Staff API endpoint definitions
 * @deprecated Migrate to route config in lib/routes/
 */
export const staffApis: Record<string, StaffApiEndpoint> = {};

/**
 * Build URL from template with params
 * @deprecated Use route helpers from lib/routes instead
 */
export function buildUrl(template: string, params: Record<string, string | number> = {}): string {
  let url = template;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(':' + key, String(value));
  }
  return url;
}
