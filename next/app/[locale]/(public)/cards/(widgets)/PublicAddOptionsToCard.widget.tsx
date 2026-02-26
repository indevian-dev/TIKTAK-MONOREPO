'use client';

import { ConsoleLogger } from '@/lib/logging/Console.logger';

import {
  useState,
  useEffect
} from 'react';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { lt } from '@/lib/utils/Localized.util';

interface Category {
  id: string;
  title: string;
  parent_id: string | null;
  children?: Category[];
  filters?: Filter[];
}

interface Filter {
  id: string;
  title: string;
  type: 'STATIC' | 'DYNAMIC';
  options?: FilterOption[];
}

interface FilterOption {
  id: string;
  title: string;
  value: string;
}

interface PublicAddOptionsToCardWidgetProps {
  onCategoriesChange?: (categories: string[]) => void;
  onFiltersChange?: (filters: Filter[]) => void;
  onOptionsChange?: (options: Record<string, FilterOption[]>) => void;
}

const PublicAddOptionsToCardWidget = ({
  onCategoriesChange: _onCategoriesChange,
  onFiltersChange: _onFiltersChange,
  onOptionsChange: _onOptionsChange
}: PublicAddOptionsToCardWidgetProps) => {
  const [categoriesHierarchy, setCategoriesHierarchy] = useState<Category[]>([]);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterOptions, setFilterOptions] = useState<Record<string, FilterOption[]>>({});

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await apiCall({
          method: 'GET',
          url: '/api/categories',
        });
        if (response.status !== 200) throw new Error('Failed to fetch categories');
        const categories = response.data.categories;
        const buildHierarchy = (arr: Category[], parentId: string | null = null): Category[] => {
          return arr
            .filter(item => item.parent_id === parentId)
            .map(item => ({
              ...item,
              children: buildHierarchy(arr, item.id),
            }));
        };

        setCategoriesHierarchy(buildHierarchy(categories));
      } catch (error) {
        const err = error as Error;
        ConsoleLogger.error('Error fetching categories:', err.message);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const currentSelection = selectedPath[selectedPath.length - 1];
    if (!currentSelection) return;

    const currentCategory = findCategoryById(categoriesHierarchy, currentSelection);
    if (currentCategory && currentCategory.filters) {
      setFilters(currentCategory.filters);
      updateFilterOptions(currentCategory.filters);
    } else {
      setFilters([]);
      setFilterOptions({});
    }
  }, [selectedPath, categoriesHierarchy]);

  const findCategoryById = (categories: Category[], id: string): Category | null => {
    for (const category of categories) {
      if (category.id === id) return category;
      const found = findCategoryById(category.children || [], id);
      if (found) return found;
    }
    return null;
  };

  const updateFilterOptions = (filtersToUpdate: Filter[]) => {
    const options: Record<string, FilterOption[]> = {};
    filtersToUpdate.forEach(filter => {
      options[filter.id] = filter.options || [];
    });
    setFilterOptions(options);
  };

  const renderFilterInput = (filter: Filter) => {
    const options = filterOptions[filter.id] || [];
    switch (filter.type) {
      case 'STATIC':
        return (
          <select className="block w-full mt-1 border border-gray-600 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 text-lg">
            {options.map(option => (
              <option key={option.id} value={option.value}>{option.title}</option>
            ))}
          </select>
        );
      case 'DYNAMIC':
        return (
          <input type="number" className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        );
      default:
        return null;
    }
  };

  const handleCategoryChange = (categoryId: string, level: number) => {
    const newPath = [...selectedPath.slice(0, level), categoryId];
    setSelectedPath(newPath);
  };

  const renderCategorySelect = (categories: Category[], level = 0): React.ReactNode => {
    // If there are no categories to render, exit early
    if (!categories || categories.length === 0) {
      return null;
    }

    const selectedId = selectedPath[level];
    const selectedCategory = selectedId ? findCategoryById(categoriesHierarchy, selectedId) : null;

    // Only proceed to render the next level select if the current selected category has children
    return (
      <>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mt-2">Category</label>
          <select
            key={level}
            onChange={e => handleCategoryChange(e.target.value, level)}
            value={selectedId || ''}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 text-lg"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{lt(category.title)}</option>
            ))}
          </select>
        </div>
        {selectedCategory && selectedCategory.children && renderCategorySelect(selectedCategory.children, level + 1)}
      </>
    );
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mt-2">Category</label>
        {renderCategorySelect(categoriesHierarchy)}
      </div>

      {filters.length > 0 && (
        <div>
          {filters.map((filter, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mt-2">{filter.title}</label>
              {renderFilterInput(filter)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicAddOptionsToCardWidget;
