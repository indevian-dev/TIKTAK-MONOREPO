"use client";

import {
  useState,
  useEffect
} from 'react';
import Image
  from 'next/image';
import { toast }
  from 'react-toastify';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { useRouter }
  from 'next/navigation';

import type { Card } from '@tiktak/shared/types/domain/Card.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { PaginationPrimitive } from '@/app/primitives/Pagination.primitive';
// API response type for provider favorite cards (extends domain Card.PrivateAccess with favorite-specific fields)
interface ProviderFavoriteCardApiResponse extends Omit<Card.PrivateAccess, 'images' | 'slug'> {
  favorite_id: number; // Favorite relationship ID
  favorited_at: string; // When card was favorited
  slug?: string; // URL slug for the card
  storage_prefix: string; // Storage prefix for images
  images?: string[]; // Processed images array
}

interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function ProviderFavoriteCardsListWidget() {
  const [favorites, setFavorites] = useState<ProviderFavoriteCardApiResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const limit = 20;

  useEffect(() => {
    fetchFavorites();
  }, [page]);

  const fetchFavorites = async () => {
    setLoading(true);

    try {
      const response = await apiCall({
        method: 'GET',
        url: `/api/provider/favorites?page=${page}&limit=${limit}`,
        params: {},
        body: {}
      });

      if (response.status === 200) {
        setFavorites(response.data.favorites);
        setPagination(response.data.pagination);
      } else {
        ConsoleLogger.error('Error fetching favorites:', response.data?.error);
        toast.error(response.data?.error || 'Failed to load favorites');
      }
    } catch (error) {
      ConsoleLogger.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (cardId: string) => {
    if (!confirm('Are you sure you want to remove this card from your favorites?')) {
      return;
    }

    try {
      const response = await apiCall({
        method: 'DELETE',
        url: `/api/provider/favorites/delete/${cardId}`,
        params: {},
        body: {}
      });

      if (response.status === 200) {
        // Refresh the favorites list
        fetchFavorites();
        toast.success(response.data?.message || 'Card removed from favorites');
      } else {
        ConsoleLogger.error('Error removing favorite:', response.data?.error);
        toast.error(response.data?.error || 'Failed to remove favorite');
      }
    } catch (error) {
      ConsoleLogger.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  const handleViewCard = (cardId: string) => {
    router.push(`/cards/${cardId}`);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">Manage your favorite cards</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          <span className="ml-3 text-lg text-gray-600">Loading favorites...</span>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">Start exploring and add some cards to your favorites!</p>
          <button
            onClick={() => router.push('/')}
            className="bg-app-bright-purple hover:bg-red-600 text-white px-6 py-3 rounded-primary font-semibold transition-colors"
          >
            Browse Cards
          </button>
        </div>
      ) : (
        <>
          <div className="w-full bg-white text-sm grid grid-cols-12 gap-4 mb-8">
            {favorites.map((favorite) => (
              <div key={favorite.favorite_id} className="grid col-span-6 md:col-span-4 lg:col-span-3 w-full relative rounded bg-white">
                {/* Store Badge */}
                {(favorite.workspaceId) ? (
                  <span className='bg-app-bright-purple/10 text-gray-900 px-2 py-1 rounded absolute top-2 left-2 z-2 font-bold'>
                    Store
                  </span>
                ) : ('')}

                {/* Card Image */}
                <div className="relative row-span-6 col-span-12 w-full justify-center items-start px-6 aspect-square">
                  {favorite.images && favorite.images.length > 0 ? (
                    <Image
                      src={`${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${favorite.storage_prefix}/${favorite.images[0]}`}
                      alt={favorite.title || 'Card image'}
                      fill
                      className="rounded w-full"
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <Image
                      src={`${Bun.env.NEXT_PUBLIC_S3_PREFIX}/pg.webp`}
                      alt="Placeholder"
                      fill
                      className="rounded w-full"
                      style={{ objectFit: 'cover' }}
                    />
                  )}

                  {/* Favorite Date */}
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    Added {new Date(favorite.favorited_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Card Content */}
                <div className="grid font-bold row-span-4 grid-rows-7 bottom-0 left-0 py-3 md:py-5 px-2 md:px-3 lg:px-4 col-span-12 justify-start items text-gray-900 rounded-b-primary">
                  <p className='text-md lg:text-lg flex items-center font-black text-app-bright-purple self-start row-span-2'>
                    {favorite.price && favorite.price}
                    <span className="pl-1 text-xs font-light text-app-bright-purple/50">AZN</span>
                  </p>
                  <p className='text-sm lg:text-md line-clamp-2 self-start row-span-3'>{favorite.title || "No Title"}</p>
                  <p className='w-full text-sm font-light self-end row-span-2'>{new Date(favorite.favorited_at).toLocaleDateString()}</p>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-1 z-2">
                  <button
                    onClick={() => handleViewCard(favorite.id)}
                    className="bg-app-bright-purple hover:bg-red-600 text-white py-1 px-2 rounded text-xs font-semibold transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="bg-danger hover:bg-red-600 text-white py-1 px-2 rounded text-xs font-semibold transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <PaginationPrimitive
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}