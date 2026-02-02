import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { categories, actionLogs, eq } from '@/db';
import { requireIntParam } from '@/lib/utils/paramsHelper';

export const PUT = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  if (!authData || !authData.account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }
  const categoryId = requireIntParam(resolvedParams.categoryId, 'Category ID');

  // Get authenticated account ID
  const accountId = authData.account.id;

  try {
    // Parse request body - only extract fields that are provided
    const body = await req.json();
    const { title, description, parent_id, newParentId, type, is_active, icon } = body;

    // Handle parent_id or newParentId (newParentId takes precedence for parent changes)
    const parentIdToUpdate = newParentId !== undefined ? newParentId : parent_id;

    // Check if any fields are provided for update
    if (!title && !description && parentIdToUpdate === undefined && type === undefined && is_active === undefined && icon === undefined) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Transaction: update category and log action
    const category = await db.transaction(async (tx: DbTransaction) => {
      // Build update object with only provided fields
      const updateData: any = {};

      if (title !== undefined) {
        updateData.title = title;
        // Slug is generated on-the-fly, not stored in DB
      }

      if (description !== undefined) {
        updateData.description = description;
      }

      if (parentIdToUpdate !== undefined) {
        updateData.parentId = parentIdToUpdate === null ? null : parentIdToUpdate;
      }

      if (type !== undefined) {
        updateData.type = type;
      }

      if (is_active !== undefined) {
        updateData.isActive = is_active;
      }

      if (icon !== undefined) {
        updateData.icon = icon;
      }

      // Always update the timestamp
      updateData.updatedAt = new Date();

      // Execute the update query
      const [updatedCategory] = await tx
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, categoryId))
        .returning();

      if (!updatedCategory) {
        throw new Error('Category not found');
      }

      // Log the action
      let actionType = 'update';
      if (newParentId !== undefined) {
        actionType = 'update_parent';
      } else if (icon !== undefined) {
        actionType = 'update_icon';
      }

      // Log the action
      return updatedCategory;
    });

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Category not found') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
})

// For handling requests to update just the parent_id
export const PATCH = withApiHandler(async (req: NextRequest, { authData, params , db }: ApiHandlerContext) => {
  if (!authData || !authData.account) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.categoryId) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }
  const categoryId = requireIntParam(resolvedParams.categoryId, 'Category ID');
  // Get authenticated account ID
  const accountId = authData.account.id;

  try {
    // Parse request body
    const body = await req.json();
    const { newParentId } = body;

    if (newParentId === undefined) {
      return NextResponse.json({ error: 'newParentId is required' }, { status: 400 });
    }

    // Transaction: update category and log action
    const category = await db.transaction(async (tx: DbTransaction) => {
      // Update the category
      const [updatedCategory] = await tx
        .update(categories)
        .set({
          parentId: newParentId === null ? null : newParentId,
          updatedAt: new Date()
        })
        .where(eq(categories.id, categoryId))
        .returning();

      if (!updatedCategory) {
        throw new Error('Category not found');
      }

      // Log the action
      return updatedCategory;
    });

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Category not found') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to update category parent' }, { status: 500 });
  }
})
