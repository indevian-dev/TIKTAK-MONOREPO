import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// ZOD VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════
//
// Usage in API routes:
//   const parsed = await validateBody(req, LoginSchema);
//   if (!parsed.success) return parsed.errorResponse;
//   const { email, password } = parsed.data; // fully typed
//
// ═══════════════════════════════════════════════════════════════

type ValidationSuccess<T> = { success: true; data: T };
type ValidationFailure = { success: false; errorResponse: NextResponse };
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

type ObjectValidationSuccess<T> = { success: true; data: T };
type ObjectValidationFailure = { success: false; errors: z.ZodIssue[] };
type ObjectValidationResult<T> = ObjectValidationSuccess<T> | ObjectValidationFailure;

/**
 * Parses and validates a JSON request body against a Zod schema.
 * Returns a typed `data` object on success, or a NextResponse 400 on failure.
 * Validation errors are returned in the `ErrorApiResponse.validationErrors` format.
 */
export async function validateBody<T>(
    req: NextRequest,
    schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> {
    let raw: unknown;

    try {
        raw = await req.json();
    } catch {
        return {
            success: false,
            errorResponse: NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_JSON',
                        message: 'Request body must be valid JSON',
                    },
                },
                { status: 400 }
            ),
        };
    }

    const result = schema.safeParse(raw);

    if (!result.success) {
        const validationErrors = result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));

        return {
            success: false,
            errorResponse: NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Request body validation failed',
                        validationErrors,
                    },
                },
                { status: 400 }
            ),
        };
    }

    return { success: true, data: result.data };
}

/**
 * Validates a plain object (already parsed) against a Zod schema.
 * Useful for validating query params or pre-parsed data.
 * Returns `errors` as raw ZodIssues (no HTTP response) for flexible handling.
 */
export function validateObject<T>(
    data: unknown,
    schema: z.ZodSchema<T>
): ObjectValidationResult<T> {
    const result = schema.safeParse(data);

    if (!result.success) {
        return { success: false, errors: result.error.issues };
    }

    return { success: true, data: result.data };
}

/**
 * Validates URL search params against a Zod schema.
 * Converts the URLSearchParams to a plain object first.
 */
export function validateSearchParams<T>(
    searchParams: URLSearchParams,
    schema: z.ZodSchema<T>
): ObjectValidationResult<T> {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return validateObject(params, schema);
}
