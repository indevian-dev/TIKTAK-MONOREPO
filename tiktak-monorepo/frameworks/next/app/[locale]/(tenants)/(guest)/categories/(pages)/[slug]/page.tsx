import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

// pages/types/[slug].js

import { PublicSingleCategoryWidget }
  from '@/app/[locale]/(tenants)/(guest)/categories/(widgets)/PublicSingleCategoryWidget';
import supabase
  from '@/lib/clients/supabaseServiceRoleClient';

interface CategoryPageParams {
  slug: string;
  locale: string;
}

// Helper function to fetch category data
const getCategoryData = async (id: number) => {
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
};

// Helper function to extract ID from slug
const extractIdFromSlug = (slug: string): number | null => {
  const regex = /(\d+)$/;
  const match = slug.match(regex);
  return match ? parseInt(match[0]) : null;
};

export async function generateMetadata({ params }: { params: Promise<CategoryPageParams> }) {
  const { slug, locale } = await params;

  if (!locale) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }

  const id = extractIdFromSlug(slug);

  if (!id) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }

  const category = await getCategoryData(id);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }

  return {
    title: category.title
      || 'Category',
    description: category.description
      || `Browse items in ${category.title
      || 'this category'}`,
    openGraph: {
      title: category.title
        || 'Category',
      description: category.description
        || `Browse items in ${category.title || 'this category'}`,
      type: 'website',
      locale: locale,
      url: `${Bun.env.NEXT_PUBLIC_SITE_URL}/${locale}/categories/${slug}`,
      ...(category.image && { images: [{ url: category.image }] })
    },
  };
}

const PublicSingleCategoryPage = async ({ params }: { params: Promise<CategoryPageParams> }) => {
  const { slug } = await params;

  const id = extractIdFromSlug(slug);

  if (!id) {
    return <div>Invalid category URL</div>;
  }

  const category = await getCategoryData(id);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <PublicSingleCategoryWidget category={category} />
  );
}

export default PublicSingleCategoryPage;

