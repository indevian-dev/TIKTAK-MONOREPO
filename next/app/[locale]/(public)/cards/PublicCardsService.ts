'use client';

import { ConsoleLogger } from '@/lib/logging/Console.logger';

import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';

/**
 * Cards Public Service
 * Provides client-side functions for fetching card data from the API
 */

interface CardFilters {
  workspaceId?: string;
  categoryId?: string | number | string[] | number[];
  categoryIds?: string;
  categories?: string[];
  userId?: number;
  searchText?: string;
  tagIds?: string;
  fromRate?: number;
  toRate?: number;
  priceMin?: number;
  priceMax?: number;
  pagination?: number;
  includeFacets?: boolean;
  mode?: 'simple' | 'map';
  zoom?: number;
  boundingBox?: {
    northEast: { lat: number; lng: number };
    southWest: { lat: number; lng: number };
  };
  precision?: number;
  [key: string]: unknown;
}

interface CardData {
  id: number;
  title: string;
  [key: string]: unknown;
}

interface BucketData {
  key: string;
  doc_count: number;
  [key: string]: unknown;
}

interface FacetData {
  [key: string]: unknown;
}

interface SearchResponse {
  cards?: CardData[];
  buckets?: BucketData[];
  total?: number;
  facets?: FacetData;
  mode?: 'simple' | 'map';
  error?: string | null;
}

/**
 * Fetch cards with search filters
 * @param {Object} filters - Search filters
 * @param {string} filters.workspaceId - Workspace ID to filter by
 * @param {number|Array<number>} filters.categoryId - Single category ID or array of category IDs to filter by
 * @param {Array<number>} filters.categories - Array of category IDs from CardsFiltersWidget
 * @param {number} filters.userId - User ID to filter by
 * @param {string} filters.searchText - Text to search for
 * @param {string} filters.tagIds - Comma-separated tag IDs
 * @param {number} filters.fromRate - Minimum rating
 * @param {number} filters.toRate - Maximum rating
 * @param {number} filters.pagination - Number of items per page (default: 12)
 * @param {boolean} filters.includeFacets - Whether to include category facets (default: false)
 * @param {string} filters.mode - Search mode: 'simple' or 'map' (default: 'simple')
 * @param {number} filters.zoom - Map zoom level (map mode only)
 * @param {Object} filters.boundingBox - Bounding box for map mode: { northEast: { lat, lng }, southWest: { lat, lng } }
 * @param {number} filters.precision - Precision level for map mode **/

export async function searchCards(filters: CardFilters = {}): Promise<SearchResponse> {
  try {
    const params: Record<string, string | number | boolean> = {};

    // Add filters to params if they exist
    if (filters.workspaceId) params.workspaceId = filters.workspaceId;

    // Handle categories filter (array from CardsFiltersWidget) vs single categoryId
    if (filters.categories && filters.categories.length > 0) {
      // Use categories from filter widget (comma-separated string)
      params.categoryIds = filters.categories.join(',');
    } else if (filters.categoryId) {
      // Handle string, number, or array of either
      params.categoryIds = Array.isArray(filters.categoryId)
        ? filters.categoryId.join(',')
        : String(filters.categoryId);
    }

    if (filters.userId) params.userId = filters.userId;
    if (filters.searchText) params.searchText = filters.searchText;
    if (filters.tagIds) params.tagIds = filters.tagIds;
    if (filters.fromRate) params.fromRate = filters.fromRate;
    if (filters.toRate) params.toRate = filters.toRate;
    if (filters.priceMin) params.priceMin = filters.priceMin;
    if (filters.priceMax) params.priceMax = filters.priceMax;
    if (filters.pagination) params.pagination = filters.pagination;
    if (filters.includeFacets) params.includeFacets = filters.includeFacets;

    // Map mode parameters
    if (filters.mode) params.mode = filters.mode;
    if (filters.zoom !== undefined) params.zoom = filters.zoom;
    if (filters.precision !== undefined) params.precision = filters.precision;
    if (filters.boundingBox) {
      if (filters.boundingBox.northEast) {
        params.northEast = `${filters.boundingBox.northEast.lat},${filters.boundingBox.northEast.lng}`;
      }
      if (filters.boundingBox.southWest) {
        params.southWest = `${filters.boundingBox.southWest.lat},${filters.boundingBox.southWest.lng}`;
      }
    }

    // Pass through dynamic filter parameters (ending with _min/_max or _options)
    Object.keys(filters).forEach(key => {
      if (key.endsWith('_min') || key.endsWith('_max') || key.endsWith('_options')) {
        const value = filters[key];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          params[key] = value;
        }
      }
    });

    ConsoleLogger.log('🔍 API request to /api/cards/search with params:', params);

    const response = await apiCall({
      method: 'GET',
      url: '/api/cards/search',
      params,
      body: {}
    });

    ConsoleLogger.log('🔍 API response status:', response.status, 'data:', response.data);

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch cards');
    }

    // Handle different response formats based on mode
    if (response.data.mode === 'map') {
      // Map mode: Return buckets aggregation
      return {
        buckets: response.data.buckets || [],
        total: response.data.total || 0,
        mode: 'map',
        error: null
      };
    } else {
      // Simple mode: Return individual cards
      const rawCards = response.data.cards || [];
      const processedCards = rawCards.map((hit: unknown) => {
        // If the card already has _source, extract it; otherwise use the card as-is
        if (hit && typeof hit === 'object' && '_source' in hit) {
          const hitObj = hit as { _source: Record<string, unknown>; _id?: string; _score?: number };
          return {
            ...hitObj._source,
            _id: hitObj._id,
            _score: hitObj._score
          } as unknown as CardData;
        }
        return hit as CardData;
      });

      return {
        cards: processedCards,
        total: response.data.total || 0,
        facets: response.data.facets || undefined,
        mode: 'simple',
        error: null
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed';
    ConsoleLogger.error('Error searching cards:', error);
    return {
      cards: [],
      total: 0,
      facets: undefined,
      error: errorMessage || 'Failed to fetch cards'
    };
  }
}

/**
 * Fetch cards by workspace ID
 * @param {string} workspaceId - The workspace ID
 * @param {number} pagination - Number of items to fetch (default: 12)
 * @returns {Promise<{cards: Array, total: number, error?: string}>}
 */
export async function getCardsByWorkspaceId(workspaceId: string, pagination = 12) {
  try {
    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }

    return await searchCards({
      workspaceId: workspaceId,
      pagination: pagination
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed';
    ConsoleLogger.error('Error fetching cards by workspace ID:', error);
    return {
      cards: [],
      total: 0,
      error: errorMessage || 'Failed to fetch cards by workspace ID'
    };
  }
}

/**
 * Fetch cards by category ID
 * @param {number} categoryId - The category ID
 * @param {number} pagination - Number of items to fetch (default: 12)
 * @returns {Promise<{cards: Array, total: number, error?: string}>}
 */
export async function getCardsByCategoryId(categoryId: number, pagination = 12) {
  try {
    if (!categoryId) {
      throw new Error('Category ID is required');
    }

    return await searchCards({
      categoryId: categoryId,
      pagination: pagination
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed';
    ConsoleLogger.error('Error fetching cards by category ID:', error);
    return {
      cards: [],
      total: 0,
      error: errorMessage || 'Failed to fetch cards by category ID'
    };
  }
}

/**
 * Fetch cards by user ID
 * @param {number} userId - The user ID
 * @param {number} pagination - Number of items to fetch (default: 12)
 * @returns {Promise<{cards: Array, total: number, error?: string}>}
 */
export async function getCardsByUserId(userId: number, pagination = 12) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return await searchCards({
      userId: userId,
      pagination: pagination
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed';
    ConsoleLogger.error('Error fetching cards by user ID:', error);
    return {
      cards: [],
      total: 0,
      error: errorMessage || 'Failed to fetch cards by user ID'
    };
  }
}

/**
 * Search cards by text
 * @param {string} searchText - Text to search for
 * @param {number} pagination - Number of items to fetch (default: 12)
 * @returns {Promise<{cards: Array, total: number, error?: string}>}
 */
export async function searchCardsByText(searchText: string, pagination = 12) {
  try {
    if (!searchText || searchText.trim() === '') {
      throw new Error('Search text is required');
    }

    return await searchCards({
      searchText: searchText.trim(),
      pagination: pagination
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed';
    ConsoleLogger.error('Error searching cards by text:', error);
    return {
      cards: [],
      total: 0,
      error: errorMessage || 'Failed to search cards by text'
    };
  }
}

/**
 * Get cards with price range filter
 * @param {number} fromRate - Minimum price
 * @param {number} toRate - Maximum price
 * @param {number} pagination - Number of items to fetch (default: 12)
 * @returns {Promise<{cards: Array, total: number, error?: string}>}
 */
export async function getCardsByPriceRange(fromRate: number | null, toRate: number | null, pagination = 12) {
  try {
    if (fromRate === null && toRate === null) {
      throw new Error('At least one price range value is required');
    }

    const filters: CardFilters = { pagination };
    if (fromRate !== null) filters.fromRate = fromRate;
    if (toRate !== null) filters.toRate = toRate;

    return await searchCards(filters);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed';
    ConsoleLogger.error('Error fetching cards by price range:', error);
    return {
      cards: [],
      total: 0,
      error: errorMessage || 'Failed to fetch cards by price range'
    };
  }
}

/**
 * Get cards by multiple filters
 * @param {Object} filters - Multiple filter options
 * @param {string} filters.workspaceId - Workspace ID
 * @param {number} filters.categoryId - Category ID
 * @param {string} filters.searchText - Search text
 * @param {number} filters.fromRate - Min price
 * @param {number} filters.toRate - Max price
 * @param {string} filters.tagIds - Comma-separated tag IDs
 * @param {number} pagination - Number of items to fetch (default: 12)
 * @returns {Promise<{cards: Array, total: number, error?: string}>}
 */
export async function getCardsWithFilters(filters: CardFilters, pagination = 12): Promise<SearchResponse> {
  try {
    return await searchCards({
      ...filters,
      pagination
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Operation failed';
    ConsoleLogger.error('Error fetching cards with filters:', error);
    return {
      cards: [],
      total: 0,
      mode: 'simple',
      error: errorMessage || 'Failed to fetch cards with filters'
    };
  }
}
