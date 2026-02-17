'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { PublicBreadCrumbsTile } from '@/app/[locale]/(public)/(tiles)/PublicBreadCrumbsTile';
import { PublicAddCardToFavoritesWidget } from '@/app/[locale]/(public)/cards/(widgets)/PublicAddCardToFavoritesWidget';
import { PublicMessageButtonTile } from '@/app/[locale]/(public)/cards/(tiles)/PublicMessageButtonTile';
import { PublicSingleMarkerMapWidget } from '@/app/[locale]/(public)/(widgets)/PublicSingleMarkerMapWidget';

// Import the Location type from the map widget to avoid conflicts
type MapLocation = { lat: number; lng: number };
import { Link } from '@/i18n/routing';
import { PublicCardGalleryWidget } from '@/app/[locale]/(public)/cards/(widgets)/PublicCardGalleryWidget';
import { PublicRelatedCardsWidget } from '@/app/[locale]/(public)/cards/(widgets)/PublicRelatedCardsWidget';
import { useGlobalCategoryContext } from '@/app/[locale]/(global)/(context)/GlobalCategoryContext';
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';
import { GlobalVideoPlayerWidget } from '@/app/[locale]/(global)/(widgets)/GlobalVideoPlayerWidget';
import { usePublicHeaderNavContext } from '@/app/[locale]/(public)/(context)/PublicHeaderNavContext';
import type { Category } from '@/app/[locale]/(public)/categories/PublicCategoriesService';
import { generateSlug } from '@/lib/utils/formatting/slugify';

interface OptionGroup {
  id: number;
  title: string;
  options?: Array<{ id: number; title: string }>;
}

interface CardOption {
  type: 'STATIC' | 'DYNAMIC';
  option_id?: number;
  option_group_id?: number;
  dynamic_value?: string;
}

import type { Card } from '@/types';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response type for public single card (extends domain Card.PublicAccess with joined data)
interface PublicSingleCardApiResponse extends Omit<Card.PublicAccess, 'images'> {
  body?: string; // API uses body instead of description
  account_id?: number; // API uses snake_case
  store_id?: number; // API uses snake_case
  images?: string[]; // Processed images array
  cover?: string; // Cover image filename
  storage_prefix?: string; // Storage prefix for media
  categories?: number[]; // Category IDs array
  options?: CardOption[]; // Card options
  stores?: { id: number; title: string; logo?: string; phone?: string } | null; // Joined store data
  accounts?: { name?: string; phone?: string } | null; // Joined account data
}

interface PublicSingleCardWidgetProps {
  card: PublicSingleCardApiResponse;
}

const PublicSingleCardWidget = ({ card }: PublicSingleCardWidgetProps) => {
  const { categoriesHierarchy } = useGlobalCategoryContext();
  const { setHeaderNav, resetHeaderNav } = usePublicHeaderNavContext();
  const [optionsGroups, setOptionsGroups] = useState<OptionGroup[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  ConsoleLogger.log(card);
  if (!card) {
    return <div>Loading...</div>;
  }

  // Set header nav for card page
  useEffect(() => {
    if (card) {
      // Find the first category to display in the header
      const primaryCategory = card.categories && card.categories.length > 0 && card.categories[0] !== undefined
        ? findCategoryById(categoriesHierarchy, card.categories[0])
        : null;

      setHeaderNav({
        pageType: 'card',
        navData: {
          title: card.title ?? undefined,
          category: primaryCategory
            ? { id: primaryCategory.id, title: primaryCategory.title }
            : null
        }
      });
    }
    return () => resetHeaderNav();
  }, [card, categoriesHierarchy, setHeaderNav, resetHeaderNav]);

  // Fetch options when card categories change
  useEffect(() => {
    if (card && card.categories && card.categories.length > 0) {
      fetchOptionsForCategories(card.categories);
    }
  }, [card]);

  const fetchOptionsForCategories = async (categoryIds: number[]) => {
    if (!categoryIds || categoryIds.length === 0) return;

    setLoadingOptions(true);
    try {
      const response = await apiCallForSpaHelper({
        method: 'GET',
        url: `/api/categories/options-groups?category_id=${categoryIds.join(',')}`,
        params: {},
        body: {}
      });

      if (response.status === 200) {
        setOptionsGroups(response.data.options_groups || []);
      } else {
        ConsoleLogger.error('Error fetching options:', response.data?.error);
        setOptionsGroups([]);
      }
    } catch (error) {
      ConsoleLogger.error('Error fetching options:', error);
      setOptionsGroups([]);
    }
    setLoadingOptions(false);
  };

  // Function to find category by ID from the hierarchy
  const findCategoryById = (categories: Category[], id: number): Category | null => {
    for (const category of categories) {
      if (category.id === id) return category;
      if (category.children && category.children.length > 0) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Map category IDs from card.categories to full category objects
  const mapCategoriesToObjects = (): Category[] => {
    if (!card.categories || !Array.isArray(card.categories) || categoriesHierarchy.length === 0) {
      return [];
    }

    return card.categories
      .map((categoryId: number) => findCategoryById(categoriesHierarchy, categoryId))
      .filter((category): category is Category => category !== null);
  };

  // Function to find option details by option ID
  const findOptionById = (optionId: number) => {
    for (const group of optionsGroups) {
      if (group.options) {
        const option = group.options.find(opt => opt.id === optionId);
        if (option) {
          return {
            option,
            group
          };
        }
      }
    }
    return null;
  };

  // Function to find option group by ID
  const findOptionGroupById = (groupId: number) => {
    return optionsGroups.find(group => group.id === groupId) || null;
  };

  // Function to render options
  const renderOptions = (cardOptions: CardOption[]) => {
    if (!cardOptions || cardOptions.length === 0) {
      return null; // Return null to hide the section
    }

    if (loadingOptions) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {cardOptions.map((cardOption: CardOption, index: number) => {
          // Handle both STATIC and DYNAMIC option types
          let optionDetails = null;
          let groupDetails = null;

          if (cardOption.type === 'STATIC' && cardOption.option_id) {
            optionDetails = findOptionById(cardOption.option_id);
          }

          if (cardOption.option_group_id) {
            groupDetails = findOptionGroupById(cardOption.option_group_id);
          }

          return (
            <div
              key={index}
              className="bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              {/* Option Group */}
              <div className="font-medium text-gray-800 mb-1">
                {optionDetails ? optionDetails.group.title :
                  groupDetails ? groupDetails.title :
                    `Group ID: ${cardOption.option_group_id || 'Unknown'}`}
              </div>

              {/* Option Value */}
              <div className="text-gray-600">
                {cardOption.type === 'DYNAMIC' ? (
                  <div className="flex items-center gap-2">
                    <span>{cardOption.dynamic_value || 'No value'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{optionDetails ? optionDetails.option.title :
                      `Option ID: ${cardOption.option_id}`}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const mappedCategories = mapCategoriesToObjects();

  return (
    <>
      <section className="container mx-auto p-4 max-w-screen-xl">
        <PublicBreadCrumbsTile
          categories={mappedCategories}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 items-start justify-start">
          <div className='w-full  flex flex-col items-start justify-start'>
            <h1 className='w-full font-bold text-gray-900 text-2xl my-4 order-2 md:order-1'>{card.title}</h1>

            <div className='w-full order-1 md:order-2'>
              <PublicCardGalleryWidget card={card} />
            </div>
            {/* Video Player - Show if card has video */}
            {card.video && card.storage_prefix && (
              <div className="mt-6 w-full">
                <GlobalVideoPlayerWidget
                  storagePrefix={card.storage_prefix}
                  videoFileName={card.video?.url || undefined}
                  controls={true}
                  muted={false}
                  poster={card.cover ? `${Bun.env.NEXT_PUBLIC_S3_PREFIX}/cards/${card.storage_prefix}/${card.cover}` : undefined}
                  className="w-full"
                />
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 md:pl-4">
            <div className='grid grid-cols-1'>
              {card.stores?.id ? (
                <div className=' text-black px-2 py-1  rounded-tl-lg rounded-br-lg mb-4'>
                  <div className='flex gap-4'>
                    <Link href={`/stores/${generateSlug(card.stores.title || 'store')}-${card.stores.id}`}>
                      <Image className='rounded-full object-cover aspect-square' width={50} height={50} src={card.stores.logo ? `https://tiktak.s3.tebi.io/stores/${card.stores.id}/${card.stores.logo}` : '/pg.webp'} alt={card.stores.title || 'Store'} />
                    </Link>
                    <div className='flex flex-wrap'>
                      <span className='w-full font-extrabold text-gray-900'>{card.stores.phone}</span>
                    </div>
                  </div>
                </div>
              ) : (<div className='text-black px-2 py-1  rounded-tl-lg rounded-br-lg'>
                <div>
                  <span className=''>{card.accounts?.name}</span>
                  <span className=''>{card.accounts?.phone}</span>
                </div>
              </div>)}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
              <PublicAddCardToFavoritesWidget cardId={card.id} className="relative" />
              <PublicMessageButtonTile
                cardId={card.id}
                cardTitle={card.title || ''}
                accountId={card.account_id}
                storeId={card.store_id}
              />
            </div>
            <h1 className="text-2xl font-bold">{card.title || 'No Title'}</h1>
            <p className="text-lg mt-2">{card.price ? `${card.price} AZN` : 'No Price'}</p>

            <div className="my-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <p>{card.body || 'No Description'}</p>
            </div>



            <PublicSingleMarkerMapWidget location={card.location as unknown as MapLocation | null} />
          </div>
        </div>
      </section>
      <section className="container mx-auto p-4 max-w-screen-xl">
        {card.options && card.options.length > 0 && renderOptions(card.options || [])}
      </section>
      <PublicRelatedCardsWidget categoryId={card.categories && card.categories.length > 0 ? (card.categories[0] || null) : null} />
    </>
  );
};

export default PublicSingleCardWidget;
