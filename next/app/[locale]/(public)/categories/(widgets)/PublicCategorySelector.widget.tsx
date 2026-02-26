// components/CategorySelector.jsx
"use client";

import { useState, useEffect } from 'react';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { loadClientSideCoLocatedTranslations } from '@/i18n/i18nClientSide';
import { GlobalSelectWidget } from '@/app/[locale]/(global)/(widgets)/GlobalSelect.widget';
import { Category } from '@/app/[locale]/(public)/categories/PublicCategoriesService';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { lt } from '@/lib/utils/Localized.util';
interface PublicCategorySelectorWidgetProps {
  onCategoryChange: (path: string[]) => void;
}

export function PublicCategorySelectorWidget({ onCategoryChange }: PublicCategorySelectorWidgetProps) {
  const { t } = loadClientSideCoLocatedTranslations('PublicCategorySelectorWidget');
  const [categoriesHierarchy, setCategoriesHierarchy] = useState<Category[]>([]);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await apiCall({
          method: 'GET',
          url: '/api/categories'
        });

        if (response.status !== 200) {
          ConsoleLogger.log(response.status);
          throw new Error('Failed to fetch categories' + ' ' + response.data?.error);
        }

        const categories = response.data.categories;
        ConsoleLogger.log(categories);

        const buildHierarchy = (arr: Category[], parentId: string | null = null): Category[] => arr
          .filter((item: Category) => item.parentId === parentId)
          .map((item: Category) => ({
            ...item,
            children: buildHierarchy(arr, item.id),
          }));

        const hierarchy = buildHierarchy(categories);
        setCategoriesHierarchy(hierarchy);

      } catch (error) {
        const err = error as Error;
        ConsoleLogger.error('Error fetching categories:', err.message);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    // Communicate the selected category path to the parent component
    onCategoryChange(selectedPath);
  }, [selectedPath, onCategoryChange]);

  const handleCategoryChange = (categoryId: string | number, level: number) => {
    // Clear all child selections when a parent category changes
    const newPath = selectedPath.slice(0, level);
    newPath[level] = String(categoryId);
    setSelectedPath(newPath);
  };

  const renderCategorySelect = (categories: Category[], level = 0): React.ReactNode => {
    if (!categories || categories.length === 0) return null;

    const selectedId = selectedPath[level];
    const selectedCategory = categories.find((cat: Category) => cat.id === selectedId);

    return (
      <>
        <div className="mb-4 text-md">
          <label className="block text-gray-900 font-bold mt-2 mb-2">{t("category")}</label>
          <GlobalSelectWidget
            options={categories.map(category => ({ label: lt(category.title) || '', value: String(category.id) }))}
            onChange={(value) => handleCategoryChange(value, level)}
            value={selectedId !== undefined ? String(selectedId) : ''}
          />
        </div>
        {selectedCategory?.children && selectedCategory.children.length > 0 &&
          renderCategorySelect(selectedCategory.children, level + 1)}
      </>
    );
  };

  return (
    <>{renderCategorySelect(categoriesHierarchy)}</>
  );
};
