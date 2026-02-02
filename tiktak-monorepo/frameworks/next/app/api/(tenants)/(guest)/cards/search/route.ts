import OpenSearch, { OPENSEARCH_INDEX } from '@/lib/clients/openSearchClient';
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/auth/AccessValidatorForApis';
import type { ApiRouteHandler, ApiHandlerContext } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
const indexName = OPENSEARCH_INDEX;

interface FilterRange {
  min?: number;
  max?: number;
}

export const GET: ApiRouteHandler = withApiHandler(async (request: NextRequest, {}: ApiHandlerContext) => {
  ConsoleLogger.log('🔍 API /api/cards/search called with URL:', request.url);

  // Extract mode parameter (default: 'simple')
  const mode = request.nextUrl.searchParams.get('mode') || 'simple';

  // Use the get method to retrieve values from searchParams
  const pagination = request.nextUrl.searchParams.get('pagination');
  const categoryIds = request.nextUrl.searchParams.get('categoryIds');
  const userId = request.nextUrl.searchParams.get('userId');
  const tagIds = request.nextUrl.searchParams.get('tagIds');
  const searchText = request.nextUrl.searchParams.get('searchText');
  const fromRate = request.nextUrl.searchParams.get('fromRate');
  const toRate = request.nextUrl.searchParams.get('toRate');
  const storeId = request.nextUrl.searchParams.get('storeId');

  // Extract map-specific parameters (for both map and simple modes with bounding box)
  let mapParams = null;
  const zoom = request.nextUrl.searchParams.get('zoom');
  const northEast = request.nextUrl.searchParams.get('northEast');
  const southWest = request.nextUrl.searchParams.get('southWest');
  const precision = request.nextUrl.searchParams.get('precision');

  if (northEast && southWest) {
    const [neLat, neLng] = northEast.split(',').map(parseFloat);
    const [swLat, swLng] = southWest.split(',').map(parseFloat);

    mapParams = {
      zoom: zoom ? parseInt(zoom) : null,
      boundingBox: {
        northEast: { lat: neLat, lng: neLng },
        southWest: { lat: swLat, lng: swLng }
      },
      precision: precision ? parseInt(precision) : (zoom ? Math.floor(parseInt(zoom) / 3) : null)
    };
  }

  // Get additional filter parameters
  const priceMin = request.nextUrl.searchParams.get('priceMin');
  const priceMax = request.nextUrl.searchParams.get('priceMax');

  // Get all other filter parameters (dynamic filters and multi-select filters)
  const allParams = Array.from(request.nextUrl.searchParams.entries());
  const dynamicFilterIds: Record<string, FilterRange> = {};
  const multiSelectFilterIds: Record<string, number[]> = {};

  allParams.forEach(([key, value]) => {
    // Handle min/max filters for dynamic filters
    if (key.endsWith('_min')) {
      const filterName = key.replace('_min', '');
      if (!dynamicFilterIds[filterName]) dynamicFilterIds[filterName] = {};
      dynamicFilterIds[filterName].min = parseFloat(value);
    } else if (key.endsWith('_max')) {
      const filterName = key.replace('_max', '');
      if (!dynamicFilterIds[filterName]) dynamicFilterIds[filterName] = {};
      dynamicFilterIds[filterName].max = parseFloat(value);
    }
    // Handle multi-select filters
    else if (key.endsWith('_options')) {
      const filterName = key.replace('_options', '');
      multiSelectFilterIds[filterName] = value.split(',').map(id => parseInt(id));
    }
  });

  ConsoleLogger.log('dynamicFilterIds', dynamicFilterIds);
  ConsoleLogger.log('multiSelectFilterIds', multiSelectFilterIds);

  type QueryClause = Record<string, unknown>;

  let query3 = {
    bool: {
      must: [] as QueryClause[],
      filter: [] as QueryClause[],
      should: [] as QueryClause[]
    }
  };

  // Add required conditions to must array
  query3.bool.must.push({ term: { is_active: true } });

  if (categoryIds && categoryIds != 'NaN') {
    // Handle comma-separated category IDs
    const categoryIdsArray = categoryIds.includes(',')
      ? categoryIds.split(',').map(id => parseInt(id))
      : [parseInt(categoryIds)];

    // Use AND logic - cards must belong to ALL selected categories
    categoryIdsArray.forEach(categoryId => {
      query3.bool.must.push({
        terms: { categories: [categoryId] }
      });
    });
  }

  if (userId) {
    query3.bool.must.push({ term: { user_id: parseInt(userId) } });
  }
  if (tagIds) {
    query3.bool.must.push({ terms: { tag_ids: tagIds.split(',') } });
  }
  if (storeId) {
    query3.bool.must.push({ term: { store_id: parseInt(storeId) } });
  }
  if (searchText) {
    // Text search should be required when provided, not optional
    query3.bool.must.push({ match: { title: { query: searchText, fuzziness: 'AUTO' } } });
  }
  // Handle price range filters
  if (priceMin || priceMax) {
    const priceRange: Record<string, number> = {};
    if (priceMin) priceRange.gte = parseFloat(priceMin);
    if (priceMax) priceRange.lte = parseFloat(priceMax);
    query3.bool.must.push({ range: { price: priceRange } });
  }

  if (fromRate) {
    query3.bool.must.push({ range: { reviews_score: { gte: fromRate } } });
  }
  if (toRate) {
    query3.bool.must.push({ range: { reviews_score: { lte: toRate } } });
  }

  // Handle geo bounding box filter (for both map and simple modes)
  if (mapParams && mapParams.boundingBox) {
    ConsoleLogger.log('🗺️ Applying geo bounding box filter:', {
      mode,
      boundingBox: mapParams.boundingBox
    });
    query3.bool.must.push({
      geo_bounding_box: {
        location: {
          top_left: {
            lat: mapParams.boundingBox.northEast.lat,
            lon: mapParams.boundingBox.southWest.lng
          },
          bottom_right: {
            lat: mapParams.boundingBox.southWest.lat,
            lon: mapParams.boundingBox.northEast.lng
          }
        }
      }
    });
  }

  // Handle dynamic filters - query nested filters_options array
  Object.entries(dynamicFilterIds).forEach(([filterId, range]) => {
    const rangeFilter: Record<string, number> = {};
    if (range.min !== undefined && typeof range.min === 'number') {
      rangeFilter.gte = range.min;
    }
    if (range.max !== undefined && typeof range.max === 'number') {
      rangeFilter.lte = range.max;
    }

    if (Object.keys(rangeFilter).length > 0) {
      query3.bool.must.push({
        nested: {
          path: 'filters_options',
          query: {
            bool: {
              must: [
                { term: { 'filters_options.category_filter_id': parseInt(filterId) } },
                { range: { 'filters_options.dynamic_value': rangeFilter } }
              ]
            }
          }
        }
      });
    }
  });

  // Handle multi-select filters - query nested filters_options array for selected option IDs
  Object.entries(multiSelectFilterIds).forEach(([filterId, filterOptionIds]) => {
    if (filterOptionIds.length > 0) {
      query3.bool.must.push({
        nested: {
          path: 'filters_options',
          query: {
            bool: {
              must: [
                { term: { 'filters_options.category_filter_id': parseInt(filterId) } },
                { terms: { 'filters_options.category_filter_option_id': filterOptionIds } }
              ]
            }
          }
        }
      });
    }
  });

  // Remove minimum_should_match logic since we're putting everything in must
  // if (query3.bool.should.length > 0 && !hasFilters) {
  //   query3.bool.minimum_should_match = 1;
  // }

  // Build search body
  let searchBody;

  if (mode === 'map' && mapParams) {
    // Map mode: Return geo-aggregated buckets instead of individual cards
    const precision = Math.floor((mapParams.zoom ?? 10) / 2);

    searchBody = {
      query: query3,
      size: 0, // Don't return individual documents
      aggs: {
        geo_hash: {
          geohash_grid: {
            field: 'location',
            precision: precision
          },
          aggs: {
            centroids: {
              geo_centroid: {
                field: 'location'
              }
            }
          }
        }
      }
    };
  } else {
    // Normal mode: Return individual cards
    const adjustedPagination = pagination ? parseInt(pagination) : 12;

    searchBody = {
      query: query3,
      from: 0,
      size: adjustedPagination,
      sort: [
        { created_at: { order: 'desc' as const } }
      ]
    };
  }

  ConsoleLogger.log('🔍 OpenSearch query:', JSON.stringify(searchBody, null, 2));

  try {
    const cardsResponse = await OpenSearch.search({
      index: indexName,
      body: searchBody
    });

    let responseData;

    if (mode === 'map' && mapParams && mapParams.zoom) {
      // Map mode: Return geo-aggregated buckets
      const buckets = (cardsResponse.body.aggregations?.geo_hash as any)?.buckets || [];
      const total = buckets.reduce((sum: number, bucket: any) => sum + bucket.doc_count, 0);

      ConsoleLogger.log('cardsResponse', cardsResponse);
      responseData = {
        operation: 'success',
        mode: 'map',
        buckets: buckets,
        total: total
      };
    } else {
      // Simple mode: Return individual cards
      const cards = cardsResponse.body.hits.hits;
      const total = typeof cardsResponse.body.hits.total === 'number'
        ? cardsResponse.body.hits.total
        : cardsResponse.body.hits.total?.value || 0;

      ConsoleLogger.log('📋 Simple mode - returning cards:', {
        count: cards.length,
        total,
        cardIds: cards.map(c => c._id)
      });

      responseData = {
        operation: 'success',
        mode: 'simple',
        cards: cards,
        total: total
      };
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return NextResponse.json({ message: 'Search failed', error }, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
