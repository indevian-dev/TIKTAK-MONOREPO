import { cache } from 'react';
import { PublicSingleCategoryWidget }
  from '@/app/[locale]/(public)/categories/(widgets)/PublicSingleCategory.widget';
import { fetch as apiCallForSsrHelper } from '@/lib/utils/Http.FetchApiSSR.util';
import { notFound } from 'next/navigation';

import { ConsoleLogger } from '@/lib/logging/Console.logger';

interface CategoryPageParams {
  slug: string;
  locale: string;
}

// Helper function to extract ID from slug (e.g. "some-category-name-123" → "123")
const extractIdFromSlug = (slug: string): string | null => {
  const lastHyphen = slug.lastIndexOf('-');
  if (lastHyphen === -1 || lastHyphen === slug.length - 1) return null;
  return slug.substring(lastHyphen + 1);
};

const getCategoryData = cache(async (id: string) => {
  try {
    const response = await apiCallForSsrHelper({
      url: `/api/categories/${id}`,
    });

    // SSR fetch returns raw axios response
    // API response envelope: { success, data: { category } }
    const envelope = response.data;
    return envelope?.data?.category || envelope?.category || null;
  } catch (error) {
    const err = error as Error;
    ConsoleLogger.error('Error fetching category:', err.message);
    return null;
  }
});

// Helper to extract localized title string
const getLocalizedTitle = (title: any, fallback = 'Category'): string => {
  if (!title) return fallback;
  if (typeof title === 'string') return title;
  return title.az || title.en || title.ru || fallback;
};

export async function generateMetadata({ params }: { params: Promise<CategoryPageParams> }) {
  const { slug, locale } = await params;

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

  const title = getLocalizedTitle(category.title);
  const description = getLocalizedTitle(category.description, `Browse items in ${title}`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/categories/${slug}`,
      ...(category.icon && { images: [{ url: category.icon }] })
    },
  };
}

const PublicSingleCategoryPage = async ({ params }: { params: Promise<CategoryPageParams> }) => {
  const { slug, locale } = await params;

  if (!locale) {
    notFound();
  }

  const id = extractIdFromSlug(slug);

  if (!id) {
    notFound();
  }

  const category = await getCategoryData(id);

  if (!category) {
    notFound();
  }

  return (
    <PublicSingleCategoryWidget category={category} />
  );
}

export default PublicSingleCategoryPage;
