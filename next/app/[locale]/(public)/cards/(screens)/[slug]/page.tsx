import { cache } from 'react';
import PublicSingleCardWidget from '@/app/[locale]/(public)/cards/(widgets)/PublicSingleCardWidget';
import { fetch as apiCallForSsrHelper } from '@/lib/helpers/apiCallForSsrHelper';
import { notFound } from 'next/navigation';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
interface CardPageParams {
  slug: string;
  locale: string;
}

const getCardData = cache(async (slug: string) => {
  const regex = /-(\d+)$/;
  const match = slug.match(regex);

  if (!match || !match[1]) {
    ConsoleLogger.error('Invalid card slug format:', slug);
    return null;
  }

  const id = parseInt(match[1]);
  const RLKEY = Bun.env.CLOUDFLARE_RATE_LIMIT_TOKEN;

  try {
    const response = await apiCallForSsrHelper({
      url: `/api/cards/${id}`,
      headers: RLKEY ? { 'x-rl-key': RLKEY } : undefined
    });

    return response.data.card;
  } catch (error) {
    const err = error as Error;
    ConsoleLogger.error('Error fetching card:', err.message);
    return null;
  }
});

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<CardPageParams> }) {
  const { slug } = await params;

  const card = await getCardData(slug);

  if (!card) {
    return {
      title: 'Card Not Found',
      description: 'The requested card could not be found.'
    };
  }

  return {
    title: card.title,
    description: card.description,
    openGraph: {
      title: card.title,
      description: card.description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: card.title,
      description: card.description,
    }
  };
}

const PublicCardPage = async ({ params }: { params: Promise<CardPageParams> }) => {
  const { slug, locale } = await params;

  if (!locale) {
    notFound();
  }

  ConsoleLogger.log("SLUG", slug);
  ConsoleLogger.log("LOCALE", locale);

  const card = await getCardData(slug);

  if (!card) {
    notFound();
  }

  return <PublicSingleCardWidget card={card} />;
};

export default PublicCardPage;
