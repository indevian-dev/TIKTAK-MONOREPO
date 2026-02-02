import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import { NextResponse } from 'next/server';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types';

// Import the necessary utilities
import OpenSearch, { OPENSEARCH_INDEX, OPENSEARCH_MAPPINGS } from '@/lib/clients/openSearchClient';
import { syncCard, deleteCardFromOpenSearch } from '@/lib/utils/syncCardToOpenSearchUtility';
import { cardsPublished, actionLogs } from '@/db/schema';
import { desc } from 'drizzle-orm';
import type { CardRow } from '@/types/resources/card/cardDb';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// Define the mappings for the OpenSearch index
const mappings = OPENSEARCH_MAPPINGS;

// Ensure that the OpenSearch index exists, create it if it doesn't (but don't delete if exists)
async function ensureIndexExists(indexName: string, mappings: any) {
    const { body: exists } = await OpenSearch.indices.exists({ index: indexName });
    if (!exists) {
        await OpenSearch.indices.create({
            index: indexName,
            body: { mappings },
        });
        ConsoleLogger.log(`Created new index: ${indexName}`);
    } else {
        ConsoleLogger.log(`Index ${indexName} already exists, keeping existing data`);
    }
}

// Get all document IDs currently in OpenSearch
async function getOpenSearchDocumentIds(indexName: string): Promise<number[]> {
    try {
        const response = await OpenSearch.search({
            index: indexName,
            body: {
                query: { match_all: {} },
                _source: false,
                size: 10000, // Adjust based on your needs
            }
        });

        return response.body.hits.hits.map((hit: any) => parseInt(hit._id));
    } catch (error) {
        return [];
    }
}

// Delete obsolete documents from OpenSearch
async function deleteObsoleteDocuments(obsoleteIds: number[], indexName: string) {
    ConsoleLogger.log(`Deleting ${obsoleteIds.length} obsolete documents...`);
    let deleteSuccessCount = 0;
    let deleteFailureCount = 0;

    for (const docId of obsoleteIds) {
        try {
            const success = await deleteCardFromOpenSearch(docId, indexName);
            if (success) {
                deleteSuccessCount++;
            } else {
                deleteFailureCount++;
                }
        } catch (error) {
            deleteFailureCount++;
            }
    }

    return { deleteSuccessCount, deleteFailureCount };
}

// Fetch card IDs from Database using Drizzle
async function fetchCardIdsFromDatabase(db: any) {
    try {
        const cards = await db
            .select({ id: cardsPublished.id })
            .from(cardsPublished)
            .orderBy(desc(cardsPublished.id))
            .limit(200);

        return cards.map((card: CardRow) => card.id);
    } catch (error) {
        return [];
    }
}

// Sync all cards using the syncCard utility
async function syncAllCards(cardIds: number[], indexName: string) {
    ConsoleLogger.log(`Syncing ${cardIds.length} cards to index: ${indexName}...`);
    let successCount = 0;
    let failureCount = 0;

    for (const cardId of cardIds) {
        try {
            const success = await syncCard(cardId, null, indexName);
            if (success) {
                successCount++;
            } else {
                failureCount++;
                }
        } catch (error) {
            failureCount++;
            }
    }

    return { successCount, failureCount };
}

// Log the sync action - now handled by wrapper
async function logSyncAction(db: any, accountId: number | null) {
    // Action logging now handled automatically by withApiHandler
    // This function can be removed or used for additional logging if needed
    return;
}

// Define the API route handler
export const GET: ApiRouteHandler = withApiHandler(async (req, { db }: ApiHandlerContext) => {
  // Validate API Request (Auth, Permissions, 2FA, Suspension)
  // Auth handled by withApiHandler - authData available in context
  ConsoleLogger.log('API route invoked');

    const secret = req.nextUrl.searchParams.get('secret');
    if (secret !== '123123') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get index name from URL parameters, fallback to default if not provided
    const indexName = req.nextUrl.searchParams.get('indexName') || OPENSEARCH_INDEX;

    if (!indexName) {
        return NextResponse.json({
            error: 'Index name is required. Please provide indexName parameter.'
        }, { status: 400 });
    }

    // Get account ID from cookies if available
    const { value: xAcc } = req.cookies?.get('x-acc') || {};
    const authAccId = xAcc ? parseInt(xAcc) : null;

    try {
        ConsoleLogger.log(`Starting sync process for index: ${indexName}...`);

        // Ensure index exists with proper mappings (but don't delete if exists)
        await ensureIndexExists(indexName, mappings);

        // Get all current document IDs from OpenSearch
        const openSearchDocIds = await getOpenSearchDocumentIds(indexName);
        ConsoleLogger.log(`Found ${openSearchDocIds.length} existing documents in OpenSearch`);

        // Get all card IDs from Database
        const databaseCardIds = await fetchCardIdsFromDatabase(db);
        ConsoleLogger.log(`Found ${databaseCardIds.length} cards in database`);

        // Find obsolete documents (exist in OpenSearch but not in Database)
        const obsoleteDocIds = openSearchDocIds.filter(docId => !databaseCardIds.includes(docId));
        ConsoleLogger.log(`Found ${obsoleteDocIds.length} obsolete documents to delete`);

        // Delete obsolete documents
        let deleteStats = { deleteSuccessCount: 0, deleteFailureCount: 0 };
        if (obsoleteDocIds.length > 0) {
            deleteStats = await deleteObsoleteDocuments(obsoleteDocIds, indexName);
        }

        // Sync all current cards from Database
        const { successCount, failureCount } = await syncAllCards(databaseCardIds, indexName);

        // Log the sync action
        if (authAccId) {
            await logSyncAction(db, authAccId);
        }

        ConsoleLogger.log(`Sync completed for index: ${indexName}`);
        ConsoleLogger.log(`Cards synced - Success: ${successCount}, Failed: ${failureCount}`);
        ConsoleLogger.log(`Documents deleted - Success: ${deleteStats.deleteSuccessCount}, Failed: ${deleteStats.deleteFailureCount}`);

        // Respond to the client
        return NextResponse.json({
            message: 'Sync process completed',
            indexName,
            stats: {
                total_cards: databaseCardIds.length,
                cards_synced_success: successCount,
                cards_synced_failed: failureCount,
                obsolete_documents_found: obsoleteDocIds.length,
                documents_deleted_success: deleteStats.deleteSuccessCount,
                documents_deleted_failed: deleteStats.deleteFailureCount
            }
        }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Internal Server Error',
            details: errorMessage
        }, { status: 500 });
    }
})
