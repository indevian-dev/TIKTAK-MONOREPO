'use client';

import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';
import { generateSlug } from '@/lib/utils/formatting/slugify';


import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
/**
 * Categories Public Service
 * Provides client-side functions for fetching category data from the API
 * 
 * Parent/Child Logic:
 * - parentId === null → This is a PARENT/ROOT category
 * - parentId !== null → This is a CHILD/SUBCATEGORY
 * 
 * Slug Generation:
 * - Slugs are generated on-the-fly from titles, not stored in DB
 */

export interface Category {
  id: number;
  title: string;
  slug?: string;  // Generated on-the-fly, not from DB
  icon?: string;
  parentId: number | null;  // null = parent category, number = child category
  isActive?: boolean;
  type?: string;
  titleRu?: string;
  titleEn?: string;
  description?: string;
  children?: Category[];
  [key: string]: unknown;
}

/**
 * Add slug to category (generated from title)
 */
function addSlugToCategory(category: Category): Category {
  return {
    ...category,
    slug: generateSlug(category.title)
  };
}

/**
 * Add slugs to array of categories
 */
function addSlugsToCategories(categories: Category[]): Category[] {
  return categories.map(addSlugToCategory);
}

interface CategoriesResponse {
  categories: Category[];
  hierarchy?: Category[];
  error?: string | null;
}

interface CategoryResponse {
  category: Category | null;
  error?: string | null;
}

export interface CategoryFilter {
  id: number | string;
  title: string;
  type: 'DYNAMIC' | 'STATIC';
  category_filter_options?: Array<{ id: number; title: string }>;
  [key: string]: unknown;
}

interface CategoryFiltersResponse {
  filters: CategoryFilter[];
  error?: string | null;
}

/**
 * Fetch all categories or categories filtered by parent_id
 * @param {number|null} parentId - Optional parent_id to filter categories
 * @returns {Promise<{categories: Array, error?: string}>}
 */
export async function getCategories(parentId: number | null = null): Promise<CategoriesResponse> {
  try {
    const params: { parent_id?: number } = {};
    if (parentId !== null) {
      params.parent_id = parentId;
    }

    const response = await apiCallForSpaHelper({
      method: 'GET',
      url: '/api/categories',
      params,
      body: {}
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch categories');
    }

    const categories = addSlugsToCategories(response.data?.categories || []);

    return {
      categories,
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
    ConsoleLogger.error('Error fetching categories:', errorMessage);
    return {
      categories: [],
      error: errorMessage
    };
  }
}

/**
 * Fetch a single category by ID
 * @param {number} categoryId - The category ID
 * @returns {Promise<{category: Object|null, error?: string}>}
 */
export async function getCategoryById(categoryId: number): Promise<CategoryResponse> {
  try {
    if (!categoryId) {
      throw new Error('Category ID is required');
    }

    const response = await apiCallForSpaHelper({
      method: 'GET',
      url: `/api/categories/${categoryId}`,
      params: {},
      body: {}
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch category');
    }

    const category = response.data.category ? addSlugToCategory(response.data.category) : null;

    return {
      category,
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category';
    ConsoleLogger.error('Error fetching category by ID:', errorMessage);
    return {
      category: null,
      error: errorMessage
    };
  }
}

/**
 * Fetch parent categories (categories with parent_id = null)
 * @returns {Promise<{categories: Array, error?: string}>}
 */
export async function getParentCategories(): Promise<CategoriesResponse> {
  try {
    const response = await apiCallForSpaHelper({
      method: 'GET',
      url: '/api/categories',
      params: { parent_id: 'null' },
      body: {}
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch parent categories');
    }

    const categories = addSlugsToCategories(response.data.categories || []);

    return {
      categories,
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch parent categories';
    ConsoleLogger.error('Error fetching parent categories:', errorMessage);
    return {
      categories: [],
      error: errorMessage
    };
  }
}

/**
 * Fetch subcategories for a specific parent category
 * @param {number} parentId - The parent category ID
 * @returns {Promise<{categories: Array, error?: string}>}
 */
export async function getSubCategories(parentId: number): Promise<CategoriesResponse> {
  try {
    if (!parentId) {
      throw new Error('Parent ID is required');
    }

    const response = await apiCallForSpaHelper({
      method: 'GET',
      url: '/api/categories',
      params: { parent_id: parentId },
      body: {}
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch subcategories');
    }

    const categories = addSlugsToCategories(response.data?.categories || []);

    return {
      categories,
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subcategories';
    ConsoleLogger.error('Error fetching subcategories:', errorMessage);
    return {
      categories: [],
      error: errorMessage
    };
  }
}

/**
 * Build hierarchical category structure from flat array
 * 
 * Logic:
 * - Filter categories where parentId === null (root/parent categories)
 * - Recursively build children for each category
 * - Categories with parentId === null are at the root level
 * - Categories with parentId === <number> are nested under that parent
 * 
 * @param {Array} categories - Flat array of categories
 * @param {number|null} parentId - Starting parent ID (null for root level)
 * @returns {Array} Hierarchical category array
 */
export function buildCategoryHierarchy(categories: Category[], parentId: number | null = null): Category[] {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories
    .filter(category => category.parentId === parentId)
    .map(category => ({
      ...category,
      children: buildCategoryHierarchy(categories, category.id)
    }))
    .sort((a, b) => {
      // Sort by title, handling null/undefined values
      const titleA = a.title || '';
      const titleB = b.title || '';
      return titleA.localeCompare(titleB);
    });
}

/**
 * Fetch all categories and organize them into a hierarchy
 * @returns {Promise<{hierarchy: Array, categories: Array, error?: string}>}
 */
export async function getCategoriesHierarchy(): Promise<CategoriesResponse> {
  try {
    const response = await apiCallForSpaHelper({
      method: 'GET',
      url: '/api/categories',
      params: {},
      body: {}
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch categories hierarchy');
    }

    // Add slugs to all categories
    const categoriesWithSlugs = addSlugsToCategories(response.data?.categories || []);
    
    // Debug logging
    ConsoleLogger.log(('📊 Categories fetched:'), categoriesWithSlugs.length);
    const parentCount = categoriesWithSlugs.filter((cat: Category) => cat.parentId === null).length;
    const childCount = categoriesWithSlugs.filter((cat: Category) => cat.parentId !== null).length;
    ConsoleLogger.log(('👨‍👩‍👧 Parent categories:'), parentCount);
    ConsoleLogger.log(('👶 Child categories:'), childCount);
    
    const hierarchy = buildCategoryHierarchy(categoriesWithSlugs);
    
    ConsoleLogger.log(('🌳 Hierarchy built with'), hierarchy.length, 'root categories');

    return {
      hierarchy,
      categories: categoriesWithSlugs,
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories hierarchy';
    ConsoleLogger.error('Error fetching categories hierarchy:', errorMessage);
    return {
      hierarchy: [],
      categories: [],
      error: errorMessage
    };
  }
}

/**
 * Filter categories by active status
 * @param {Array} categories - Array of categories
 * @param {boolean} activeOnly - Whether to return only active categories
 * @returns {Array} Filtered categories
 */
export function filterActiveCategories(categories: Category[], activeOnly = true): Category[] {
  if (!Array.isArray(categories)) {
    return [];
  }

  if (!activeOnly) {
    return categories;
  }

  return categories.filter(category => category.isActive === true);
}

/**
 * Get category path/breadcrumb from root to specified category
 * @param {Array} categories - Flat array of all categories
 * @param {number} categoryId - Target category ID
 * @returns {Array} Array of categories from root to target
 */
export function getCategoryPath(categories: Category[], categoryId: number): Category[] {
  if (!Array.isArray(categories) || !categoryId) {
    return [];
  }

  const path: Category[] = [];
  let currentCategory: Category | undefined = categories.find(cat => cat.id === categoryId);

  while (currentCategory) {
    path.unshift(currentCategory);
    const parentId = currentCategory.parentId;
    currentCategory = parentId
      ? categories.find(cat => cat.id === parentId)
      : undefined;
  }

  return path;
}

/**
 * Search categories by title (supports multiple languages)
 * @param {Array} categories - Array of categories to search
 * @param {string} searchTerm - Search term
 * @param {string} locale - Current locale (en, ru, az)
 * @returns {Array} Filtered categories matching search term
 */
export function searchCategories(categories: Category[], searchTerm: string, locale = 'en'): Category[] {
  if (!Array.isArray(categories) || !searchTerm || searchTerm.trim() === '') {
    return categories;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return categories.filter(category => {
    // Check default title
    if (category.title && category.title.toLowerCase().includes(term)) {
      return true;
    }
    
    // Check localized title for Russian
    if (locale === 'ru' && category.titleRu && category.titleRu.toLowerCase().includes(term)) {
      return true;
    }
    
    // Check localized title for English
    if (locale === 'en' && category.titleEn && category.titleEn.toLowerCase().includes(term)) {
      return true;
    }
    
    // Check description
    if (category.description && category.description.toLowerCase().includes(term)) {
      return true;
    }
    
    return false;
  });
}

/**
 * Get categories by type
 * @param {Array} categories - Array of categories
 * @param {string} type - Category type to filter by
 * @returns {Array} Categories of specified type
 */
export function getCategoriesByType(categories: Category[], type: string): Category[] {
  if (!Array.isArray(categories) || !type) {
    return [];
  }

  return categories.filter(category => category.type === type);
}

/**
 * Get category filters for specified category IDs
 * @param {Array|number} categoryIds - Category ID or array of category IDs
 * @returns {Promise<{filters: Array, error?: string}>}
 */
export async function getCategoryFilters(categoryIds: number | number[]): Promise<CategoryFiltersResponse> {
  try {
    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
    
    if (ids.length === 0) {
      return { filters: [], error: null };
    }

    const response = await apiCallForSpaHelper({
      method: 'GET',
      url: '/api/categories/filters',
      params: { category_id: ids.join(',') },
      body: {}
    });

    if (response.status !== 200) {
      throw new Error(response.data?.error || 'Failed to fetch category filters');
    }

    return {
      filters: response.data?.filters || [],
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category filters';
    ConsoleLogger.error('Error fetching category filters:', errorMessage);
    return {
      filters: [],
      error: errorMessage
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS - Parent/Child Logic
// ═══════════════════════════════════════════════════════════════

/**
 * Check if a category is a parent/root category
 * @param {Category} category - Category object
 * @returns {boolean} true if category is a parent (parentId === null)
 */
export function isParentCategory(category: Category): boolean {
  return category.parentId === null;
}

/**
 * Check if a category is a child/subcategory
 * @param {Category} category - Category object
 * @returns {boolean} true if category is a child (parentId !== null)
 */
export function isChildCategory(category: Category): boolean {
  return category.parentId !== null;
}

/**
 * Check if a category has children/subcategories
 * @param {Category} category - Category object
 * @returns {boolean} true if category has children
 */
export function hasChildren(category: Category): boolean {
  return Array.isArray(category.children) && category.children.length > 0;
}
