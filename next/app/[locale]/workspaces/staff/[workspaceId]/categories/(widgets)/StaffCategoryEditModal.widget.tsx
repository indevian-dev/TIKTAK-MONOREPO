"use client";

import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent
} from 'react';
import { StaffCategoryIconUploadWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/categories/(widgets)/StaffCategoryIconUpload.widget';
import { StaffCategoryFiltersEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/categories/(widgets)/StaffCategoryFiltersEdit.widget';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import type { Category } from '@tiktak/shared/types/domain/Category.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';

// API response type for staff category editing (extends domain Category.PrivateAccess)
interface StaffCategoryEditApiResponse extends Category.PrivateAccess {
  icon?: string;
  price?: number;
  [key: string]: any;
}

interface StaffCategoryEditModalWidgetProps {
  categoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StaffCategoryEditModalWidget({ categoryId, isOpen, onClose }: StaffCategoryEditModalWidgetProps) {
  const [category, setCategory] = useState<StaffCategoryEditApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;

      setLoading(true);

      try {
        const response = await apiCall({ method: 'GET', url: '/api/staff/categories/' + categoryId, params: {}, body: {} });

        if (response.status === 200) {
          setCategory(response.data.category);
        }

      } catch (error) {
        ConsoleLogger.error('Error fetching category:', error);
      }
      setLoading(false);
    };

    fetchCategory();
  }, [categoryId]);

  /** Handle JSONB title/description changes */
  const handleLocalizedChange = (field: 'title' | 'description', locale: string, value: string) => {
    setCategory(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: { ...(prev[field] as any || {}), [locale]: value }
      };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedCategory = { ...category };

    const response = await apiCall({ method: 'PUT', url: '/api/staff/categories/update', params: {}, body: { categoryId, updatedCategory } });

    if (response.status === 200) {
      onClose();
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  const title = (category?.title || {}) as { az?: string; ru?: string; en?: string };
  const description = (category?.description || {}) as { az?: string; ru?: string; en?: string };

  return (
    <div className="fixed w-full inset-0 top-0 bg-slate-950 bg-opacity-90 z-50 flex justify-center items-start p-16 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded w-full mx-4 lg:w-2/3 shadow-xl">
        {loading ? (
          <p className='my-20 py-20'>Loading...</p>
        ) : (
          <div>
            {/* ═══ Title (JSONB) ═══ */}
            <div>
              <label htmlFor="title_az" className="block text-sm font-medium text-gray-700">Title (AZ)</label>
              <input
                type="text"
                id="title_az"
                value={title.az || ''}
                onChange={(e) => handleLocalizedChange('title', 'az', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="title_ru" className="block text-sm font-medium text-gray-700">Title (RU)</label>
              <input
                type="text"
                id="title_ru"
                value={title.ru || ''}
                onChange={(e) => handleLocalizedChange('title', 'ru', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="title_en" className="block text-sm font-medium text-gray-700">Title (EN)</label>
              <input
                type="text"
                id="title_en"
                value={title.en || ''}
                onChange={(e) => handleLocalizedChange('title', 'en', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* ═══ Description (JSONB) ═══ */}
            <div>
              <label htmlFor="desc_az" className="block text-sm font-medium text-gray-700">Description (AZ)</label>
              <textarea
                id="desc_az"
                value={description.az || ''}
                onChange={(e) => handleLocalizedChange('description', 'az', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="desc_ru" className="block text-sm font-medium text-gray-700">Description (RU)</label>
              <textarea
                id="desc_ru"
                value={description.ru || ''}
                onChange={(e) => handleLocalizedChange('description', 'ru', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="desc_en" className="block text-sm font-medium text-gray-700">Description (EN)</label>
              <textarea
                id="desc_en"
                value={description.en || ''}
                onChange={(e) => handleLocalizedChange('description', 'en', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {category && <StaffCategoryIconUploadWidget category={category} setType={setCategory as any} />}

            {categoryId && <StaffCategoryFiltersEditWidget categoryId={categoryId} />}
            <div className="flex justify-end mt-4 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-black hover:bg-gray-200"
              >
                Cancel
              </button>
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
