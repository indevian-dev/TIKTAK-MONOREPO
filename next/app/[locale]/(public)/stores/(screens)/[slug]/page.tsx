import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

// pages/Cards/[id].js
import PublicStoreDetailsWidget
  from '@/app/[locale]/(public)/stores/(widgets)/PublicStoreDetailsWidget';
import { fetch as apiCallForSsrHelper } from '@/lib/helpers/apiCallForSsrHelper';
import { notFound }
  from 'next/navigation';
import { cache }
  from 'react';

// Cached data fetching function
const getStoreData = cache(async (id: number) => {
  try {
    const response = await apiCallForSsrHelper({
      url: `/api/stores/${id}`,
    });

    if (response.status !== 200) {
      ConsoleLogger.log(response);
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

  // Split the string and parse the last segment as an integer
  const regex = /(\d+)$/;
  const match = slug.match(regex);
  const id = match ? parseInt(match[0]) : null;

  if (!id) {
    return {
      title: 'Store Not Found',
      description: 'The requested store could not be found.'
    };
  }

  const store = await getStoreData(id as number);

  if (!store) {
    return {
      title: 'Store Not Found',
      description: 'The requested store could not be found.'
    };
  }

  return {
    title: store.title,
    description: store.description,
    openGraph: {
      title: store.title,
      description: store.description,
      type: 'website',
      url: `${Bun.env.NEXT_PUBLIC_SITE_URL}/stores/${slug}`,
    },
  };
}

const PublicStoreDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  // Split the string and parse the last segment as an integer
  const regex = /(\d+)$/;
  const match = slug.match(regex);
  const id = match ? parseInt(match[0]) : null;

  if (!id) {
    notFound();
  }

  const store = await getStoreData(id as number);

  if (!store) {
    notFound();
  }

  return <PublicStoreDetailsWidget store={store} />;
};

export default PublicStoreDetailsPage;
