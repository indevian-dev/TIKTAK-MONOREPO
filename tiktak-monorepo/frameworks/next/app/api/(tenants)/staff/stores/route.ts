import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { stores, ilike, or, desc, asc } from '@/db';
import { count } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import type { PaginatedApiHandler, Store, ApiRouteHandler, ApiHandlerContext } from '@/types';
import {
  extractPaginationParams,
  createPaginationMeta,
  paginatedResponse,
} from '@/types';
import { mapStoreProviderToPrivate } from '@/types/resources/provider/store/storeMapper';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params, db }: ApiHandlerContext) => {
  try {
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const { page, pageSize } = extractPaginationParams(searchParams);
    const search = searchParams.get('search') || '';
    const searchType = searchParams.get('searchType') || 'title';

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Define allowed columns for sorting
    const allowedSortColumns = ['id', 'created_at', 'title', 'is_approved', 'is_active', 'is_blocked'];
    const sortParam = searchParams.get('sort') || 'created_at';
    const sort = allowedSortColumns.includes(sortParam) ? sortParam : 'created_at';

    // Validate order
    const order = searchParams.get('order') === 'asc' ? 'ASC' : 'DESC';

    // Build where condition based on search
    let whereCondition = undefined;
    const searchValue = `%${search}%`;

    if (search && searchType) {
      if (searchType === 'title') {
        whereCondition = ilike(stores.title, searchValue);
      } else if (searchType === 'address') {
        whereCondition = ilike(stores.address, searchValue);
      } else if (searchType === 'phone') {
        whereCondition = ilike(stores.phone, searchValue);
      } else {
        // Default search on all fields (slug removed)
        whereCondition = or(
          ilike(stores.title, searchValue),
          ilike(stores.address, searchValue),
          ilike(stores.phone, searchValue)
        );
      }
    }

    // Get stores with pagination
    const orderByColumn = sort === 'created_at' ? stores.createdAt :
                         sort === 'id' ? stores.id :
                         sort === 'title' ? stores.title :
                         sort === 'is_approved' ? stores.isApproved :
                         sort === 'is_active' ? stores.isActive :
                         sort === 'is_blocked' ? stores.isBlocked :
                         stores.createdAt;

    const storesResult = await db
      .select()
      .from(stores)
      .where(whereCondition)
      .orderBy(order === 'ASC' ? asc(orderByColumn) : desc(orderByColumn))
      .limit(pageSize)
      .offset(offset);

    // Get total count
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(stores)
      .where(whereCondition);

    // Map database stores to domain Store.PrivateAccess type
    const mappedStores = storesResult.map((row) => mapStoreProviderToPrivate(row, false));

    // Create pagination metadata
    const pagination = createPaginationMeta(page, pageSize, total);

    return paginatedResponse(mappedStores, pagination);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: errorMessage || 'Failed to fetch stores'
    }, { status: 500 });
  }
});