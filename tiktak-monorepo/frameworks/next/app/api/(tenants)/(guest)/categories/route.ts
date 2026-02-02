import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextRequest, NextResponse } from 'next/server';
import { eq, or, isNull } from '@/db';
import { categories } from '@/db/schema';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types';
import type { CategoryRow } from '@/types/resources/category/categoryDb';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
export const GET: ApiRouteHandler = withApiHandler(async (_request: NextRequest, { log , db }: ApiHandlerContext) => {
  try {
    // Get all categories where isActive is true
    const categoriesList = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.id);

    // Debug logging
    ConsoleLogger.log('📦 API: Categories fetched from DB:', categoriesList.length);
    const parents = categoriesList.filter((cat: CategoryRow) => cat.parentId === null);
    const children = categoriesList.filter((cat: CategoryRow) => cat.parentId !== null);
    ConsoleLogger.log('👨 API: Parent categories (parentId === null):', parents.length);
    ConsoleLogger.log('👶 API: Child categories (parentId !== null):', children.length);
    ConsoleLogger.log('📋 API: Parent category details:', parents.map((p: CategoryRow) => ({ id: p.id, title: p.title, parentId: p.parentId })));

    // Check for orphaned children (children whose parent doesn't exist)
    const parentIds = new Set(parents.map((p: CategoryRow) => p.id));
    const orphaned = children.filter((child: CategoryRow) => child.parentId && !parentIds.has(child.parentId));
    if (orphaned.length > 0) {
      ConsoleLogger.log('⚠️ API: Orphaned categories (parent doesn\'t exist):', orphaned.map((o: CategoryRow) => ({ id: o.id, title: o.title, parentId: o.parentId })));
    }

    return NextResponse.json({ categories: categoriesList });
  } catch (error) {
    log?.error('Error fetching categories', error as Error);
    return NextResponse.json({
      error: 'Failed to fetch categories'
    }, { status: 500 });
  }
});