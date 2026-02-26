import { fetch as apiCallForSsrHelper } from '@/lib/utils/Http.FetchApiSSR.util';
import { cache }
  from 'react';
import { PublicStoreCatalogueWidget } from '@/app/[locale]/(public)/stores/(widgets)/PublicStoreCatalogue.widget';
import { notFound } from 'next/navigation';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
// Cached data fetching function - prevents duplicate fetches
const getStoreData = cache(async (id: number) => {
  try {
    const response = await apiCallForSsrHelper({
      url: `/api/stores/${id}`,
    });
    if (response.status !== 200) {
      return null;
    }
    return response.data.store;
  } catch (error) {
    ConsoleLogger.error('Error fetching store:', error);
    return null;
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const regex = /(\d+)$/;
  const match = slug.match(regex);
  const id = match ? parseInt(match[0]) : null;
  const store = await getStoreData(id as number);
  if (!store) {
    return {
      title: 'Store Not Found',
      description: 'The requested store could not be found.'
    };
  }
  return {
    title: (store?.title || 'Store') + ' - Catalogue',
  };
}

const StoreCataloguePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const regex = /(\d+)$/;
  const match = slug.match(regex);
  const id = match ? parseInt(match[0]) : null;
  const store = await getStoreData(id as number);
  if (!store) {
    notFound();
  }
  return <PublicStoreCatalogueWidget store={store} />;
}

export default StoreCataloguePage;
