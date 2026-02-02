import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { NextRequest } from 'next/server';
import type { ApiHandlerContext, DbTransaction } from '@/types';
import { NextResponse } from 'next/server';
import { cards, stores, actionLogs, eq, db } from '@/db';
import {  ValidationService, Rules, Sanitizers  } from '@/lib/services/ValidationService';

// ═══════════════════════════════════════════════════════════════
// CARD CREATION VALIDATION SCHEMA
// ═══════════════════════════════════════════════════════════════
const createCardSchema = {
  newTitle: {
    rules: [
      Rules.required('title'),
      Rules.string('title'),
      Rules.minLength('title', 3),
      Rules.maxLength('title', 200)
    ],
    sanitizers: [Sanitizers.trim, Sanitizers.stripHtml]
  },
  newBody: {
    rules: [Rules.maxLength('body', 10000)],
    sanitizers: [Sanitizers.trim]
  },
  newPrice: {
    rules: [Rules.positiveNumber('price')],
    sanitizers: [Sanitizers.toFloat, Sanitizers.defaultTo(null)]
  },
  newLocation: {
    rules: [Rules.string('location'), Rules.maxLength('location', 200)],
    sanitizers: [Sanitizers.trim, Sanitizers.stripHtml, Sanitizers.defaultTo(null)]
  },
  newCategoryIds: {
    rules: [Rules.array('categoryIds')],
    sanitizers: [Sanitizers.defaultTo([])]
  },
  newOptions: {
    rules: [Rules.array('filterOptions')],
    sanitizers: [Sanitizers.defaultTo([])]
  },
  mode: {
    rules: [Rules.oneOf('mode', ['personal', 'store'])],
    sanitizers: [Sanitizers.defaultTo('personal')]
  },
  storeId: {
    rules: [],
    sanitizers: [Sanitizers.toInt, Sanitizers.defaultTo(null)]
  }
};

export const POST = withApiHandler(async (req: NextRequest, { authData, db, log }: ApiHandlerContext) => {
  try {
    if (!authData || !authData.account) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const accountId = authData.account.id;
    const body = await req.json();

    // Validate and sanitize input
    interface SanitizedCardData {
      newTitle: string;
      newBody: string | undefined;
      newPrice: number | null;
      newLocation: string | null;
      newCategoryIds: unknown[];
      newOptions: unknown[];
      mode: 'personal' | 'store';
      storeId: number | null;
    }

    const validation = ValidationService.validate(body, createCardSchema as any) as {
      isValid: boolean;
      errors: Array<{ field: string; message: string }>;
      sanitized: SanitizedCardData;
    };

    if (!validation.isValid) {
      log?.warn('Card creation validation failed', {
        errorCount: validation.errors.length
      });
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((err) => {
        errorMap[err.field] = err.message;
      });

      return NextResponse.json({
        error: 'Validation failed',
        errors: errorMap
      }, { status: 400 });
    }

    const {
      newTitle,
      newBody,
      newPrice,
      newLocation,
      newCategoryIds,
      newOptions,
      mode,
      storeId
    } = validation.sanitized;

    // Extract media fields (these bypass validation schema)
    const { new_images, new_video, cover, storagePrefix } = body;

    // Use PostgreSQL transaction (slug generated on-the-fly, not stored)
    const result = await db.transaction(async (tx: DbTransaction) => {
      const cardData: any = {
        title: newTitle as string,
        isApproved: false,
        accountId
      };

      // Only add fields if they're defined and not null
      if (newBody) cardData.body = newBody;
      if (newPrice !== null) cardData.price = newPrice;
      if (newLocation) cardData.location = newLocation;

      // Add store_id if mode is "store" and storeId exists
      const sanitizedStoreId = storeId as number | null;
      if (mode === 'store' && sanitizedStoreId) {
        // Verify user has access to this store
        const [storeAccess] = await tx
          .select({ id: stores.id })
          .from(stores)
          .where(eq(stores.id, sanitizedStoreId));

        if (!storeAccess) {
          throw new Error('STORE_ACCESS_DENIED');
        }

        cardData.storeId = sanitizedStoreId;
      }

      if (new_images) cardData.images = new_images;
      if (new_video) cardData.video = new_video;
      if (cover) cardData.cover = cover;
      if (storagePrefix) cardData.storagePrefix = storagePrefix;

      // Add categories and options as JSON
      const categoryIds = newCategoryIds as any;
      if (categoryIds?.length > 0) {
        cardData.categories = categoryIds;
      }

      const options = newOptions as any;
      if (options?.length > 0) {
        cardData.filtersOptions = options;
      }

      const [card] = await tx.insert(cards).values(cardData).returning();

      // Log the action
      return { card };
    });

    log?.info('Card created successfully', {
      cardId: result.card.id
    });

    return NextResponse.json({
      card: result.card,
      message: 'Card submitted for approval'
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorMessage === 'STORE_ACCESS_DENIED') {
      return NextResponse.json({
        error: 'You do not have access to this store'
      }, { status: 403 });
    }

    log?.error('Card creation error', error as Error);
    return NextResponse.json({
      error: 'Failed to create card'
    }, { status: 500 });
  }
})