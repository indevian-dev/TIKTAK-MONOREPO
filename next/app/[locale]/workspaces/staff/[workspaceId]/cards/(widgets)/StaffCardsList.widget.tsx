"use client";

import {
  useState,
  useEffect
} from 'react';
import { StaffCardsFiltersWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/cards/(widgets)/StaffCardsFilters.widget';
import { StaffCardListItemWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/cards/(widgets)/StaffCardListItem.widget';
import { toast }
  from 'react-toastify';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import type { Card } from '@tiktak/shared/types/domain/Card.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
// API response type for staff cards (extends domain Card.PrivateAccess with API-specific fields)
interface StaffCardApiResponse extends Omit<Card.PrivateAccess, 'store_id' | 'price'> {
  created_at: Date; // API uses snake_case
  store_id?: string | null; // API uses snake_case
  store_name?: string; // Joined data from store table
  is_approved: boolean;
  is_active: boolean;
  published_data?: any;
  has_pending_updates?: boolean;
  price?: number; // API returns price as a number
}

interface FiltersType {
  cardId: string;
  title: string;
  storeName: string;
  categoryId: string;
  isApproved: string;
  isActive: string;
}

interface StaffPagination {
  total: number;
  totalPages: number;
  pageSize: number;
}

export function StaffCardsListWidget() {
  const [cards, setCards] = useState<StaffCardApiResponse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FiltersType>({
    cardId: '',
    title: '',
    storeName: '',
    categoryId: '',
    isApproved: '',
    isActive: ''
  });
  const [pagination, setPagination] = useState<StaffPagination>({
    total: 0,
    totalPages: 0,
    pageSize: 20
  });

  useEffect(() => {
    fetchCards();
  }, [page, filters]);

  const fetchCards = async () => {
    setLoading(true);

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pagination.pageSize.toString()
    });

    // Add filter parameters
    Object.keys(filters).forEach(key => {
      const filterKey = key as keyof FiltersType;
      if (filters[filterKey] && filters[filterKey].trim() !== '') {
        params.append(key, filters[filterKey]);
      }
    });

    const response = await apiCall({
      method: 'GET',
      url: `/api/staff/cards?${params.toString()}`,
      params: {},
      body: {}
    });

    if (response.status === 200) {
      setCards(response.data.cards);
      setPagination({
        total: response.data.total,
        totalPages: response.data.totalPages,
        pageSize: response.data.pageSize
      });
    } else {
      ConsoleLogger.error('Error fetching cards:', response.data?.error || 'Unknown error');
      toast.error('Error fetching cards');
    }
    setLoading(false);
  };

  const handleFiltersChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="container mx-auto">
      {/* Filters Component */}
      <StaffCardsFiltersWidget onFiltersChange={handleFiltersChange} />

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-slate-600">
          {loading ? 'Loading...' : `Showing ${cards.length} of ${pagination.total} cards`}
        </p>
      </div>

      {/* Cards List */}
      <div className="flex flex-wrap gap-3">
        {loading ? (
          <p className="text-center w-full">Loading...</p>
        ) : cards.length === 0 ? (
          <p className="text-center w-full text-slate-500">No cards found matching your filters.</p>
        ) : (
          cards.map((card) => (
            <StaffCardListItemWidget
              key={card.id}
              card={card}
              onRefreshList={fetchCards}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1 || loading}
          className="px-4 py-2 mr-2 border rounded text-slate-900 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-slate-900">
          Page {page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= pagination.totalPages || loading}
          className="px-4 py-2 border rounded text-slate-900 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

