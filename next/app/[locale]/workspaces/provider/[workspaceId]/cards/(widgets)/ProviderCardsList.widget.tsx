"use client";

import {
  useState,
  useEffect
} from 'react';
import { ProviderCardImagesGalleryWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderCardImagesGallery.widget';
import { toast }
  from 'react-toastify';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { useRouter }
  from 'next/navigation';
import type { Card } from '@tiktak/shared/types/domain/Card.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
// Alias the provider API shape for readability
type ProviderCardApiResponse = Card.ProviderApiShape;


export function ProviderCardsListWidget() {
  const [cards, setCards] = useState<ProviderCardApiResponse[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCards();
  }, [page]);

  const fetchCards = async () => {
    setLoading(true);

    const response = await apiCall({ method: 'GET', url: `/api/provider/cards?page=${page}`, params: {}, body: {} });

    if (response.status === 200) {
      setCards(response.data.cards);
    } else {
      ConsoleLogger.error('Error fetching cards:', (response as any).error);
    }
    setLoading(false);
  };

  const handleEdit = (cardId: string) => {
    router.push(`/provider/cards/edit/${cardId}`);
  };


  const handleDelete = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }

    const response = await apiCall({ method: 'DELETE', url: `/api/provider/cards/delete/${cardId}`, params: {}, body: {} });

    if (response.status === 200) {
      fetchCards(); // Refresh the list after deletion
      toast.success(response.data.message || 'Card deleted successfully');
    } else {
      ConsoleLogger.error('Error deleting card:', (response as any).error);
      toast.error((response as any).error || 'Failed to delete card');
    }
  };


  return (
    <div className="container mx-auto flex flex-wrap gap-3">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        cards.map((card) => (
          <div key={card.id} className="p-4 border rounded shadow-sm flex flex-col md:flex-row w-full bg-slate-100">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2 text-slate-900">{card.title}</h2>
              <p className="text-gray-600 mb-4">{card.body}</p>
              <div className="text-gray-500 text-sm">
                <div className='text-lg my-2 text-slate-900 font-bold'>Posted: {new Date(card.created_at).toLocaleDateString()}</div>
                <div className='text-lg my-2 text-slate-900 font-bold'>Price: ${card.price}</div>
                <div className='text-lg my-2 text-slate-900 font-bold'>
                  Location: {
                    card.location && typeof card.location === 'object'
                      ? `${card.location.latitude}, ${card.location.longitude}`
                      : (typeof card.location === 'string' ? card.location : 'Not specified')
                  }
                </div>
                <div className="mt-2 p-2 border border-gray-500 rounded-lg my-2">
                  <span>Status: </span>
                  {card.published_data ? (
                    <>
                      <span className="text-emerald-500 font-semibold">Published</span>
                      {card.published_data.is_active ?
                        <span className="text-emerald-500 ml-2 font-semibold">(Active)</span> :
                        <span className="text-gray-500 ml-2 font-semibold">(Inactive)</span>
                      }
                    </>
                  ) : (
                    <span className="text-gray-500 font-semibold">Not Published</span>
                  )}
                  {!card.is_approved && <span className="text-orange-500 ml-2 font-semibold">Pending Approval</span>}
                  {card.is_approved && !card.published_data && <span className="text-blue-500 ml-2 font-semibold">Approved (Not Yet Published)</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(card.id)}
                    className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    onClick={() => handleDelete(card.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {card.images && <ProviderCardImagesGalleryWidget images={card.images} id={card.id} />}
          </div>
        ))
      )}

      <div className="flex justify-center mt-6 w-full">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1 || loading}
          className="px-4 py-2 mr-2 border rounded text-slate-900 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={loading}
          className="px-4 py-2 border rounded text-slate-900 bg-sky-500 hover:bg-sky-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}

