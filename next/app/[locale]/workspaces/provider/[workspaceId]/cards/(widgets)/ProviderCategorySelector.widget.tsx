
"use client";

import {
  useState,
  useEffect,
  ReactElement
} from 'react';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import { GlobalSelectWidget }
  from '@/app/[locale]/(global)/(widgets)/GlobalSelect.widget';
import type { Category } from '@tiktak/shared/types/domain/Category.types';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { lt } from '@/lib/utils/Localized.util';
// API response type for provider category selection (extends domain Category.Tree)
type ProviderCategorySelectorApiResponse = Category.Tree;

interface ProviderCategorySelectorWidgetProps {
  onCategoryChange: (path: string[]) => void;
  initialPath?: string[];
}

export function ProviderCategorySelectorWidget({
  onCategoryChange,
  initialPath = []
}: ProviderCategorySelectorWidgetProps) {
  const { t } = loadClientSideCoLocatedTranslations('ProviderCategorySelectorWidget');
  const [categoriesHierarchy, setCategoriesHierarchy] = useState<ProviderCategorySelectorApiResponse[]>([]);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  // Set initial path when component mounts or initialPath changes
  useEffect(() => {
    if (initialPath && Array.isArray(initialPath) && initialPath.length > 0) {
      setSelectedPath(initialPath);
    }
  }, [initialPath]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await apiCall({
          method: 'GET',
          url: '/api/categories',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch categories');
        }

        const categories = await response.data.categories;
        ConsoleLogger.log('categories', categories);

        const buildHierarchy = (arr: ProviderCategorySelectorApiResponse[], parentId: string | null = null): ProviderCategorySelectorApiResponse[] => arr
          .filter(item => item.parentId === parentId)
          .map(item => ({
            ...item,
            children: buildHierarchy(arr, item.id),
          }));

        setCategoriesHierarchy(buildHierarchy(categories));
      } catch (error) {
        ConsoleLogger.error('Error fetching categories:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    // Communicate the selected category path to the parent component
    onCategoryChange(selectedPath);
  }, [selectedPath, onCategoryChange]);

  const handleCategoryChange = (categoryId: string, level: number) => {
    const newPath: string[] = [...selectedPath.slice(0, level), categoryId];
    setSelectedPath(newPath);
  };

  const renderCategorySelect = (categories: ProviderCategorySelectorApiResponse[], level = 0): ReactElement | null => {
    if (!categories || categories.length === 0) return null;

    const selectedId = selectedPath[level];

    return (
      <>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mt-2 mb-2">{t("category")}</label>
          <GlobalSelectWidget
            key={level}
            value={selectedId ? selectedId.toString() : ''}
            onChange={(value: string) => handleCategoryChange(value, level)}
            options={[
              { value: '', label: t("select_category") },
              ...categories.map((category: ProviderCategorySelectorApiResponse) => ({
                value: category.id.toString(),
                label: lt(category.title)
              }))
            ]}
          />
        </div>
        {selectedId && categories.find((cat: ProviderCategorySelectorApiResponse) => cat.id === selectedId)?.children &&
          renderCategorySelect(categories.find((cat: ProviderCategorySelectorApiResponse) => cat.id === selectedId)!.children!, level + 1)}
      </>
    );
  };

  return (
    <>{renderCategorySelect(categoriesHierarchy)}</>
  );
};

