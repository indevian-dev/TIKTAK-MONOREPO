import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext } from '@/types';
import { users, accounts, ilike, or, desc, asc } from '@/db';
import { count } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import type { ApiRouteHandler } from '@/types';

export const GET: ApiRouteHandler = withApiHandler(async (request, { authData, params, db }: ApiHandlerContext) => {
  try {
    if (!authData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const searchType = searchParams.get('searchType') || 'user_name';

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Define allowed columns for sorting
    const allowedSortColumns = ['id', 'created_at', 'email', 'name', 'last_name'];
    const sortParam = searchParams.get('sort') || 'created_at';
    const sort = allowedSortColumns.includes(sortParam) ? sortParam : 'created_at';

    // Validate order
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    // Build where condition based on search
    let whereCondition = undefined;
    const searchValue = `%${search}%`;

    if (search && searchType) {
      if (searchType === 'email') {
        whereCondition = ilike(users.email, searchValue);
      } else if (searchType === 'user_name') {
        whereCondition = or(
          ilike(users.name, searchValue),
          ilike(users.lastName, searchValue)
        );
      } else {
        // Default search on all fields
        whereCondition = or(
          ilike(users.email, searchValue),
          ilike(users.name, searchValue),
          ilike(users.lastName, searchValue)
        );
      }
    }

    // Map sort column to actual column
    const orderByColumn = sort === 'created_at' ? users.createdAt :
                         sort === 'id' ? users.id :
                         sort === 'email' ? users.email :
                         sort === 'name' ? users.name :
                         sort === 'last_name' ? users.lastName :
                         users.createdAt;

    // Get users with pagination (simple query without joins for now)
    const usersResult = await db
      .select()
      .from(users)
      .where(whereCondition)
      .orderBy(order === 'asc' ? asc(orderByColumn) : desc(orderByColumn))
      .limit(pageSize)
      .offset(offset);

    // Get total count
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(users)
      .where(whereCondition);

    const result = {
      users: usersResult,
      total,
      page,
      pageSize
    };

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: errorMessage || 'Failed to fetch users'
    }, { status: 500 });
  }
})
