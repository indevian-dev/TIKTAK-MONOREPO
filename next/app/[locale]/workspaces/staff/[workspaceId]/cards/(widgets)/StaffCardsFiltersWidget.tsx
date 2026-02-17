"use client";

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import {
  useState,
  useEffect,
  useRef
} from 'react';
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';
import { GlobalSelectWidget }
  from '@/app/[locale]/(global)/(widgets)/GlobalSelectWidget';

interface FiltersType {
  cardId: string;
  title: string;
  storeName: string;
  categoryId: string;
  isApproved: string;
  isActive: string;
}

interface CategoryType {
  id: number;
  title: string;
}

interface StaffCardsFiltersWidgetProps {
  onFiltersChange: (filters: FiltersType) => void;
}

export function StaffCardsFiltersWidget({ onFiltersChange }: StaffCardsFiltersWidgetProps) {
  const [filters, setFilters] = useState<FiltersType>({
    cardId: '',
    title: '',
    storeName: '',
    categoryId: '',
    isApproved: '',
    isActive: ''
  });
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiCallForSpaHelper({
        method: 'GET',
        url: '/api/staff/categories',
        params: {},
        body: {}
      });

      if (response.status === 200) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      ConsoleLogger.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key: keyof FiltersType, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Debounce the filter changes to avoid too many API calls
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = setTimeout(() => {
      onFiltersChange(newFilters);
    }, 300);
  };

  const clearFilters = () => {
    const clearedFilters = {
      cardId: '',
      title: '',
      storeName: '',
      categoryId: '',
      isApproved: '',
      isActive: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Transform categories data for SelectComponent
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(category => ({
      value: String(category.id),
      label: category.title
    }))
  ];

  // Approval status options
  const approvalStatusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'true', label: 'Approved' },
    { value: 'false', label: 'Pending' }
  ];

  // Active status options
  const activeStatusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' }
  ];

  return (
    <div className="bg-brandPrimaryLightBg p-4 rounded shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm bg-brandPrimaryDarkBg text-white hover:bg-brandPrimary/80 font-bold py-2 px-3 rounded-full"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card ID Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Card ID
          </label>
          <input
            type="number"
            value={filters.cardId}
            onChange={(e) => handleFilterChange('cardId', e.target.value)}
            placeholder="Search by Card ID"
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand text-sm"
          />
        </div>

        {/* Title Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            placeholder="Search by Title"
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand text-sm"
          />
        </div>

        {/* Store Name Filter - Changed to input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Store Name
          </label>
          <input
            type="text"
            value={filters.storeName}
            onChange={(e) => handleFilterChange('storeName', e.target.value)}
            placeholder="Search by Store Name"
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand focus:border-brand text-sm"
          />
        </div>

        {/* Category Filter - Using SelectComponent */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <GlobalSelectWidget
            options={categoryOptions}
            value={filters.categoryId}
            onChange={(value) => handleFilterChange('categoryId', value)}
            placeholder="All Categories"
          />
        </div>

        {/* Approval Status Filter - Using SelectComponent */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Approval Status
          </label>
          <GlobalSelectWidget
            options={approvalStatusOptions}
            value={filters.isApproved}
            onChange={(value) => handleFilterChange('isApproved', value)}
            placeholder="All Statuses"
          />
        </div>

        {/* Active Status Filter - Using SelectComponent */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Active Status
          </label>
          <GlobalSelectWidget
            options={activeStatusOptions}
            value={filters.isActive}
            onChange={(value) => handleFilterChange('isActive', value)}
            placeholder="All Statuses"
          />
        </div>
      </div>
    </div>
  );
}
