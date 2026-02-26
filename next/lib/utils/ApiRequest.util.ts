/**
 * ═══════════════════════════════════════════════════════════════
 * API Request Helper — Frontend Fetch Wrapper
 * ═══════════════════════════════════════════════════════════════
 *
 * Auto-unwraps the standardized API envelope:
 *   ✅ { success: true, data: T }   → returns T
 *   ❌ { success: false, error: … } → throws ApiError
 *
 * Usage:
 *   const blogs = await apiRequest<Blog[]>('/api/blogs');
 *   const store = await apiRequest<Store>('/api/stores', { method: 'POST', body: ... });
 */

// ═══════════════════════════════════════════════════════════════
// ERROR CLASS
// ═══════════════════════════════════════════════════════════════

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly status: number
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ═══════════════════════════════════════════════════════════════
// MAIN HELPER
// ═══════════════════════════════════════════════════════════════

export async function apiRequest<T = unknown>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    const json = await response.json();

    // Handle standardized error envelope
    if (!response.ok || json.success === false) {
        throw new ApiError(
            json.error?.message || json.error || 'Request failed',
            json.error?.code || 'UNKNOWN',
            response.status
        );
    }

    // Unwrap: return data if envelope exists, otherwise raw json
    return (json.data ?? json) as T;
}

// ═══════════════════════════════════════════════════════════════
// SHORTHAND METHODS
// ═══════════════════════════════════════════════════════════════

export function apiGet<T = unknown>(url: string) {
    return apiRequest<T>(url);
}

export function apiPost<T = unknown>(url: string, body: unknown) {
    return apiRequest<T>(url, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

export function apiPut<T = unknown>(url: string, body: unknown) {
    return apiRequest<T>(url, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

export function apiPatch<T = unknown>(url: string, body: unknown) {
    return apiRequest<T>(url, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
}

export function apiDelete<T = unknown>(url: string) {
    return apiRequest<T>(url, { method: 'DELETE' });
}
