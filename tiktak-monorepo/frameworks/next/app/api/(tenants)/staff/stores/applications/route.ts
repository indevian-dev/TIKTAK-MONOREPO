import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextResponse } from 'next/server';
import { storesApplications, actionLogs, ilike, or, desc } from '@/db';
import { count } from 'drizzle-orm';
import type { StoreApplicationRow } from '@/types/resources/store/storeDb';
import type { ApiRouteHandler, PaginatedApiHandler, ApiHandlerContext } from '@/types';
import {
  extractPaginationParams,
  createPaginationMeta,
  paginatedResponse
} from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (req, { authData, params, db }: ApiHandlerContext) => {
  if (!authData || !authData.account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accountId = authData.account.id;

  const { searchParams } = new URL(req.url);
  const { page, pageSize } = extractPaginationParams(searchParams);
  const search = searchParams.get('search') || '';

  try {
    const offset = (page - 1) * pageSize;

    // Build search condition
    let whereCondition = undefined;
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereCondition = or(
        ilike(storesApplications.storeName, searchTerm),
        ilike(storesApplications.contactName, searchTerm),
        ilike(storesApplications.email, searchTerm),
        ilike(storesApplications.phone, searchTerm),
        ilike(storesApplications.voen, searchTerm)
      );
    }

    // Get applications with pagination
    const applications = await db
      .select()
      .from(storesApplications)
      .where(whereCondition)
      .orderBy(desc(storesApplications.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get total count for pagination
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(storesApplications)
      .where(whereCondition);

    // Log the action
    // Create pagination metadata
    const pagination = createPaginationMeta(page, pageSize, total);

    return paginatedResponse(applications, pagination);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: errorMessage || 'Failed to fetch store applications'
    }, { status: 500 });
  }
})