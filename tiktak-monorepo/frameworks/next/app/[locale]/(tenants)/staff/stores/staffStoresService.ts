'use client';

import { apiFetchHelper } from '@/lib/helpers/apiCallForSpaHelper';
import type { Store, StoreApplication } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
type StoreType = Store.PrivateAccess;

/**
 * Staff Stores Service
 * Provides client-side functions for managing stores in the staff interface
 */

interface GetStoresOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  searchType?: 'title' | 'slug' | 'address' | 'phone' | 'all';
  sort?: string;
  order?: 'asc' | 'desc';
}

interface GetStoresResult {
  stores: StoreType[];
  total: number;
  page: number;
  pageSize: number;
  error: string | null;
}

interface GetStoreByIdResult {
  store: StoreType | null;
  error: string | null;
}

interface GetStoresSortedOptions {
  sortBy?: 'id' | 'created_at' | 'title' | 'is_approved' | 'is_active' | 'is_blocked';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

interface GetStoreApplicationsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

interface GetStoreApplicationsResult {
  applications: StoreApplication[];
  total: number;
  page: number;
  pageSize: number;
  error: string | null;
}

interface ApproveStoreApplicationResult {
  application: StoreApplication | null;
  store: StoreType | null;
  error: string | null;
}

interface RejectStoreApplicationResult {
  application: StoreApplication | null;
  error: string | null;
}

/**
 * Fetch stores with search, pagination and filters
 */
export async function getStores(options: GetStoresOptions = {}): Promise<GetStoresResult> {
  try {
    const {
      page = 1,
      pageSize = 10,
      search,
      searchType = 'title',
      sort = 'created_at',
      order = 'desc'
    } = options;

    const params: Record<string, string | number | boolean> = {
      page,
      pageSize,
      sort,
      order
    };

    // Add search parameters if provided
    if (search && search.trim()) {
      params.search = search.trim();
      params.searchType = searchType;
    }

    const response = await apiFetchHelper({
      method: 'GET',
      url: '/api/staff/stores',
      params,
      body: {}
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch stores');
    }

    return {
      stores: response.data.stores || [],
      total: response.data.total || 0,
      page: response.data.page || page,
      pageSize: response.data.pageSize || pageSize,
      error: null
    };
  } catch (error) {
    ConsoleLogger.error('Error fetching stores:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stores';
    return {
      stores: [],
      total: 0,
      page: 1,
      pageSize: 10,
      error: errorMessage
    };
  }
}

/**
 * Fetch a specific store by ID
 */
export async function getStoreById(storeId: number | string): Promise<GetStoreByIdResult> {
  try {
    const storeIdStr = typeof storeId === 'string' ? storeId : storeId.toString();
    if (!storeId || (typeof storeId === 'string' && isNaN(parseInt(storeId)))) {
      throw new Error('Valid store ID is required');
    }

    const response = await apiFetchHelper({
      method: 'GET',
      url: `/api/staff/stores/${storeIdStr}`,
      params: {},
      body: {}
    });

    if (response.status === 404) {
      throw new Error('Store not found');
    }

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch store');
    }

    return {
      store: response.data,
      error: null
    };
  } catch (error) {
    ConsoleLogger.error('Error fetching store by ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store';
    return {
      store: null,
      error: errorMessage
    };
  }
}

/**
 * Search stores by title
 */
export async function searchStoresByTitle(title: string, page = 1, pageSize = 10): Promise<GetStoresResult> {
  try {
    if (!title || title.trim() === '') {
      throw new Error('Store title is required for search');
    }

    return await getStores({
      page,
      pageSize,
      search: title.trim(),
      searchType: 'title'
    });
  } catch (error) {
    ConsoleLogger.error('Error searching stores by title:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search stores by title';
    return {
      stores: [],
      total: 0,
      page: 1,
      pageSize: 10,
      error: errorMessage
    };
  }
}

/**
 * Search stores by slug
 */
export async function searchStoresBySlug(slug: string, page = 1, pageSize = 10): Promise<GetStoresResult> {
  try {
    if (!slug || slug.trim() === '') {
      throw new Error('Store slug is required for search');
    }

    return await getStores({
      page,
      pageSize,
      search: slug.trim(),
      searchType: 'slug'
    });
  } catch (error) {
    ConsoleLogger.error('Error searching stores by slug:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search stores by slug';
    return {
      stores: [],
      total: 0,
      page: 1,
      pageSize: 10,
      error: errorMessage
    };
  }
}

/**
 * Search stores by address
 */
export async function searchStoresByAddress(address: string, page = 1, pageSize = 10): Promise<GetStoresResult> {
  try {
    if (!address || address.trim() === '') {
      throw new Error('Store address is required for search');
    }

    return await getStores({
      page,
      pageSize,
      search: address.trim(),
      searchType: 'address'
    });
  } catch (error) {
    ConsoleLogger.error('Error searching stores by address:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search stores by address';
    return {
      stores: [],
      total: 0,
      page: 1,
      pageSize: 10,
      error: errorMessage
    };
  }
}

/**
 * Search stores by phone number
 */
export async function searchStoresByPhone(phone: string, page = 1, pageSize = 10): Promise<GetStoresResult> {
  try {
    if (!phone || phone.trim() === '') {
      throw new Error('Store phone number is required for search');
    }

    return await getStores({
      page,
      pageSize,
      search: phone.trim(),
      searchType: 'phone'
    });
  } catch (error) {
    ConsoleLogger.error('Error searching stores by phone:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search stores by phone';
    return {
      stores: [],
      total: 0,
      page: 1,
      pageSize: 10,
      error: errorMessage
    };
  }
}

/**
 * Search stores across all fields
 */
export async function searchStoresGlobal(searchText: string, page = 1, pageSize = 10): Promise<GetStoresResult> {
  try {
    if (!searchText || searchText.trim() === '') {
      throw new Error('Search text is required');
    }

    return await getStores({
      page,
      pageSize,
      search: searchText.trim(),
      searchType: 'all'
    });
  } catch (error) {
    ConsoleLogger.error('Error searching stores globally:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search stores';
    return {
      stores: [],
      total: 0,
      page: 1,
      pageSize: 10,
      error: errorMessage
    };
  }
}

/**
 * Get stores with sorting options
 */
export async function getStoresSorted(options: GetStoresSortedOptions = {}): Promise<GetStoresResult> {
  try {
    const {
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      pageSize = 10
    } = options;

    const allowedSortColumns = ['id', 'created_at', 'title', 'is_approved', 'is_active', 'is_blocked'];
    
    if (!allowedSortColumns.includes(sortBy)) {
      throw new Error(`Invalid sort column. Allowed columns: ${allowedSortColumns.join(', ')}`);
    }

    const allowedSortOrders = ['asc', 'desc'];
    if (!allowedSortOrders.includes(sortOrder.toLowerCase())) {
      throw new Error('Invalid sort order. Use "asc" or "desc"');
    }

    return await getStores({
      page,
      pageSize,
      sort: sortBy,
      order: sortOrder.toLowerCase() as 'asc' | 'desc'
    });
  } catch (error) {
    ConsoleLogger.error('Error fetching sorted stores:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sorted stores';
    return {
      stores: [],
      total: 0,
      page: 1,
      pageSize: 10,
      error: errorMessage
    };
  }
}

// Placeholder functions commented out to avoid linter errors
// Uncomment and implement when endpoints are ready

/*
export async function createStore(_storeData: unknown) {
  throw new Error('Create store functionality not yet implemented');
}

export async function updateStore(_storeId: number, _storeData: unknown) {
  throw new Error('Update store functionality not yet implemented');
}

export async function deleteStore(_storeId: number) {
  throw new Error('Delete store functionality not yet implemented');
}

export async function approveStore(_storeId: number) {
  throw new Error('Approve store functionality not yet implemented');
}

export async function toggleStoreBlock(_storeId: number, _blocked = true) {
  throw new Error('Block/Unblock store functionality not yet implemented');
}
*/

/**
 * Fetch store applications with search and pagination
 */
export async function getStoreApplications(options: GetStoreApplicationsOptions = {}): Promise<GetStoreApplicationsResult> {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = ''
    } = options;

    const params: Record<string, string | number | boolean> = {
      page,
      pageSize
    };

    // Add search parameter if provided
    if (search && search.trim()) {
      params.search = search.trim();
    }

    const response = await apiFetchHelper({
      method: 'GET',
      url: '/api/staff/stores/applications',
      params,
      body: {}
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch store applications');
    }

    return {
      applications: response.data.applications || [],
      total: response.data.total || 0,
      page: response.data.page || page,
      pageSize: response.data.pageSize || pageSize,
      error: null
    };
  } catch (error) {
    ConsoleLogger.error('Error fetching store applications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch store applications';
    return {
      applications: [],
      total: 0,
      page: 1,
      pageSize: 10,
      error: errorMessage
    };
  }
}

/**
 * Approve a store application
 */
export async function approveStoreApplication(applicationId: number | string): Promise<ApproveStoreApplicationResult> {
  try {
    const appId = typeof applicationId === 'string' ? applicationId : String(applicationId);
    if (!applicationId || (typeof applicationId === 'string' && isNaN(parseInt(applicationId)))) {
      throw new Error('Valid application ID is required');
    }

    const response = await apiFetchHelper({
      method: 'PUT',
      url: `/api/staff/stores/applications/update/${appId}`,
      params: {},
      body: { approved: true }
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to approve store application');
    }

    return {
      application: response.data.data.application,
      store: response.data.data.store,
      error: null
    };
  } catch (error) {
    ConsoleLogger.error('Error approving store application:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to approve store application';
    return {
      application: null,
      store: null,
      error: errorMessage
    };
  }
}

/**
 * Reject a store application
 */
export async function rejectStoreApplication(applicationId: number | string, reason: string): Promise<RejectStoreApplicationResult> {
  try {
    const appId = typeof applicationId === 'string' ? applicationId : String(applicationId);
    if (!applicationId || (typeof applicationId === 'string' && isNaN(parseInt(applicationId)))) {
      throw new Error('Valid application ID is required');
    }

    if (!reason || reason.trim() === '') {
      throw new Error('Rejection reason is required');
    }

    const response = await apiFetchHelper({
      method: 'PUT',
      url: `/api/staff/stores/applications/update/${appId}`,
      params: {},
      body: { 
        approved: false, 
        reason: reason.trim() 
      }
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to reject store application');
    }

    return {
      application: response.data.data.application,
      error: null
    };
  } catch (error) {
    ConsoleLogger.error('Error rejecting store application:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to reject store application';
    return {
      application: null,
      error: errorMessage
    };
  }
}
