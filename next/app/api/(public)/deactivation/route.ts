import { unifiedApiHandler } from '@/lib/middleware/Interceptor.Api.middleware';
import type { NextRequest } from 'next/server';
import {
    createdResponse,
    serverErrorResponse,
} from '@/lib/middleware/Response.Api.middleware';
import { deactivationRequests } from '@/lib/database/schema';
import { DeactivationRequestSchema } from '@tiktak/shared/types/domain/Support.schemas';
import { validateBody } from '@/lib/utils/Zod.validate.util';

// POST /api/deactivation (public — no auth required)
export const POST = unifiedApiHandler(async (request: NextRequest, { db, log }) => {
    const parsed = await validateBody(request, DeactivationRequestSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { name, email, phone, comment } = parsed.data;

    try {
        const [inserted] = await db
            .insert(deactivationRequests)
            .values({ name, email, phone, comment: comment || null })
            .returning({ id: deactivationRequests.id });

        log.info('Deactivation request created', { id: inserted.id, email });

        return createdResponse(
            { id: inserted.id },
            'Your deactivation request has been submitted. We will process it within 5 business days.'
        );
    } catch (error) {
        log.error('Failed to insert deactivation request', error as Error);
        return serverErrorResponse('Failed to submit request. Please try again.');
    }
});
