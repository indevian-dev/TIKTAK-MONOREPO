'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalCategoryContext } from '@/app/[locale]/(global)/(context)/GlobalCategoryContext';
import { Category } from '../PublicCategoriesService';

interface PublicHeaderCategoriesMenuWidgetProps {
    onMenuClose?: () => void;
}

export function PublicHeaderCategoriesMenuWidget({ onMenuClose }: PublicHeaderCategoriesMenuWidgetProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const router = useRouter();
    const { categoriesHierarchy, loading, error } = useGlobalCategoryContext();

    const findCategoryById = (categories: Category[], id: number): Category | null => {
        return categories.reduce((acc: Category | null, category: Category) => {
            if (acc) return acc;
            if (category.id === id) return category;
            if (category.children) return findCategoryById(category.children, id);
            return null;
        }, null);
    };

    const handleCategoryClick = (categoryId: number, slug: string | undefined) => {
        const selectedCategory = findCategoryById(categoriesHierarchy, categoryId);

        // If the selected category has no children, navigate to its single page and close menu
        if (selectedCategory && (!selectedCategory.children || selectedCategory.children.length === 0)) {
            const categorySlug = slug || `category-${categoryId}`;
            router.push(`/categories/${categorySlug}-${categoryId}`);
            // Close the menu after navigating to leaf category
            if (onMenuClose) {
                onMenuClose();
            }
        } else {
            setSelectedCategoryId(categoryId);
        }
    };

    const getSelectedCategory = () => {
        if (!selectedCategoryId) return null;
        return findCategoryById(categoriesHierarchy, selectedCategoryId);
    };

    const selectedCategory = getSelectedCategory();

    // Handle loading state
    if (loading) {
        return (
            <section className='relative m-auto max-w-7xl grid gap-3 grid-cols-1 lg:grid-cols-3 justify-center px-4'>
                <div className="text-center col-span-1 lg:col-span-3 p-4">
                    <div className="animate-pulse text-gray-500">Loading categories...</div>
                </div>
            </section>
        );
    }

    // Handle error state
    if (error) {
        return (
            <section className='relative m-auto max-w-7xl grid gap-3 grid-cols-1 lg:grid-cols-3 justify-center px-4'>
                <div className="text-center col-span-1 lg:col-span-3 p-4">
                    <div className="text-red-500">Error loading categories: {error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className='relative m-auto max-w-7xl grid gap-3 grid-cols-1 lg:grid-cols-3  justify-center px-4'>
            {!selectedCategory && categoriesHierarchy.map((category: Category) => (
                <div
                    key={category.id}
                    className={`w-full cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-200`}
                    onClick={() => handleCategoryClick(category.id, category.slug)}
                >
                    <h2 className={`text-lg font-bold p-2 line-clamp-1 text-dark`}>{category.title}</h2>
                </div>
            ))}

            {selectedCategory && (
                <div className='w-full col-span-1 lg:col-span-3'>
                    <div className='w-full my-5 cursor-pointer flex gap-4 items-center col-span-1 lg:col-span-3 hover:bg-gray-100 rounded-md transition-colors duration-200 p-2' onClick={() => setSelectedCategoryId(selectedCategory.parentId)}>
                        <span className='bg-brandPrimaryDarkBg text-white p-2 rounded-primary whitespace-nowrap'>← Back</span>
                        <h2 className='w-full text-lg font-bold'>{selectedCategory.title}</h2>
                    </div>
                    <div className='grid gap-4 grid-cols-1 lg:grid-cols-3 col-span-1 lg:col-span-3'>
                        {selectedCategory.children && selectedCategory.children.map((childCategory: Category) => (
                            <div
                                key={childCategory.id}
                                className='p-2 rounded-primary cursor-pointer w-full hover:bg-gray-100 transition-colors duration-200'
                                onClick={() => handleCategoryClick(childCategory.id, childCategory.slug)}
                            >
                                <h3 className='text-lg font-bold'>{childCategory.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
