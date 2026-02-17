"use client";

import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent
} from 'react';
import { StaffCategoryIconUploadWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/categories/(widgets)/StaffCategoryIconUploadWidget';
import { StaffCategoryFiltersEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/categories/(widgets)/StaffCategoryFiltersEditWidget';
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';
import type { Category } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response type for staff category editing (extends domain Category.PrivateAccess)
interface StaffCategoryEditApiResponse extends Category.PrivateAccess {
  title: string; // API uses title instead of name
  title_ru?: string; // Localized title
  title_en?: string; // Localized title
  description?: string; // Category description
  description_en?: string; // Localized description
  description_ru?: string; // Localized description
  icon?: string; // Category icon
  price?: number; // Category price (if applicable)
  [key: string]: any; // Allow other properties
}

interface StaffCategoryEditModalWidgetProps {
    categoryId: number | null;
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
        const response = await apiCallForSpaHelper({ method: 'GET', url: '/api/staff/categories/' + categoryId, params: {}, body: {} });

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategory(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Slug is generated on-the-fly, not stored in DB
    const updatedCategory = {
      ...category
    };

    const response = await apiCallForSpaHelper({ method: 'PUT', url: '/api/staff/categories/update', params: {}, body: { categoryId, updatedCategory } });

    if (response.status === 200) {
      onClose();
    }

    setLoading(false);
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (

    <div className="fixed w-full inset-0 top-0 bg-slate-950 bg-opacity-90 z-50 flex justify-center items-start p-16 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded w-full mx-4 lg:w-2/3 shadow-xl">
        {loading ? (
          <p className='my-20 py-20'>Loading...</p>
        ) : (
          <div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={category?.title || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required // Ensure the title is required
              />
            </div>
            <div>
              <label htmlFor="title_ru" className="block text-sm font-medium text-gray-700">Title Ru</label>
              <input
                type="text"
                name="title_ru"
                id="title_ru"
                value={category?.title_ru || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="title_en" className="block text-sm font-medium text-gray-700">Title En</label>
              <input
                type="text"
                name="title_en"
                id="title_en"
                value={category?.title_en || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                id="description"
                value={category?.description || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="description_ru" className="block text-sm font-medium text-gray-700">Description Ru</label>
              <textarea
                name="description_ru"
                id="description_ru"
                value={category?.description_ru || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">Description En</label>
              <textarea
                name="description_en"
                id="description_en"
                value={category?.description_en || ''}
                onChange={handleChange}
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
