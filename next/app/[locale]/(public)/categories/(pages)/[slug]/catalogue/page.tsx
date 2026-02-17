import supabase from '@/lib/clients/supabaseServiceRoleClient';
import { cache } from 'react';
import { PublicCategoriesCatalogueWidgets } from '@/app/[locale]/(public)/categories/(widgets)/PublicCategoriesCatalogueWidgets';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
interface CategoryPageParams {
    slug: string;
    locale: string;
}

const getCategoryData = cache(async (id: number | null) => {
    try {
        const { data: category, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            ConsoleLogger.error('Error fetching category:', error);
            return null;
        }
        return category;
    } catch (error) {
        ConsoleLogger.error('Error fetching category:', error);
        return null;
    }
});

export async function generateMetadata({ params }: { params: Promise<CategoryPageParams> }) {
    const { slug } = await params;
    const regex = /(\d+)$/;
    const match = slug.match(regex);
    const id = match ? parseInt(match[0], 10) : null;
    const category = await getCategoryData(id);
    return {
        title: (category?.title || 'Category') + ' - Catalogue',
    };
}

const CategoryCataloguePage = async ({ params }: { params: Promise<CategoryPageParams> }) => {
    const { slug } = await params;
    const regex = /(\d+)$/;
    const match = slug.match(regex);
    const id = match ? parseInt(match[0], 10) : null;
    const category = await getCategoryData(id);
    return <PublicCategoriesCatalogueWidgets category={category} />;
}

export default CategoryCataloguePage;