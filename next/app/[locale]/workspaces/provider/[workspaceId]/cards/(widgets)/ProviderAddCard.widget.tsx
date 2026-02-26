"use client";

import { ConsoleLogger } from '@/lib/logging/Console.logger';

import {
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react';
import { toast }
  from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProviderLocationPickerWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/ui/ProviderLocationPicker.widget';
import { ProviderCategorySelectorWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderCategorySelector.widget';
import { ProviderOptionsSelectorWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderOptionsSelector.widget';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import {
  useRouter,
  Link
} from '@/i18n/routing';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { ProviderImagesEditWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderImagesEdit.widget';
import { ProviderVideoEditWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderVideoEdit.widget';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface FilterOption {
  filter_id: string;
  type: string;
  filter_option_id: string | null;
  dynamic_value: string | number | null;
}

interface CategoryFilter {
  id: string;
  name?: string;
  title?: string;
  type: string;
  options?: unknown[];
  [key: string]: unknown;
}

export function ProviderAddCardWidget() {
  const { t } = loadClientSideCoLocatedTranslations('ProviderAddCardWidget');
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<FilterOption[]>([]);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [filters, setFilters] = useState<CategoryFilter[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [cardStoragePrefix, setCardStoragePrefix] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newVideo, setNewVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const translations = useMemo(() => ({
    title: t("title"),
    description: t("description"),
    price: t("price"),
    options: t("options"),
    accept: t("accept"),
    rules: t("rules"),
    openLocationPicker: t("open_location_picker"),
    save: t("save"),
    cardCreated: t("card_created"),
    basicRules: t("basic_rules"),
  }), [t]);

  const handleCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  }, []);

  useEffect(() => {
    const generatePrefix = () => {
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let prefix = '';
      for (let i = 0; i < 9; i++) {
        prefix += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      prefix += '-';
      prefix += Math.floor(Math.random() * 10);
      return prefix;
    };

    try {
      const prefix = generatePrefix();
      setCardStoragePrefix(prefix);
    } catch (error) {
      ConsoleLogger.error('Error generating storage prefix:', error);
      toast.error('Error generating prefix');
    }
  }, []);

  const categoryPathString = useMemo(() => selectedPath.join(','), [selectedPath]);

  useEffect(() => {
    if (!categoryPathString) {
      setFilters([]);
      return;
    }

    const fetchFiltersForCategory = async () => {
      try {
        const response = await apiCall({
          method: 'GET',
          url: `/api/categories/filters`,
          body: {},
          params: {
            category_id: categoryPathString
          },
        });

        if (response.status !== 200) {
          throw new Error((response as any).error || 'Failed to fetch filters');
        }

        const filtersData = response.data.filters;
        setFilters(filtersData);
      } catch (error) {
        ConsoleLogger.error('Error fetching filters:', error);
      }
    };

    fetchFiltersForCategory();
  }, [categoryPathString]);

  const handleCategoryChange = useCallback((path: string[]) => {
    setSelectedPath(path);
    ConsoleLogger.log("PATH:", path);
  }, []);

  useEffect(() => {
    if (selectedPath.length > 0) {
      setSelectedOptions([]);
    }
  }, [selectedPath.length]);

  const handleOptionsChange = useCallback((updatedOptions: FilterOption[]) => {
    setSelectedOptions(updatedOptions);
  }, []);

  const handleImagesChange = useCallback((imageData: string[] | { images: string[] }) => {
    // Handle both simple array and object structure
    if (Array.isArray(imageData)) {
      setNewImages(imageData);
    } else {
      setNewImages(imageData.images || []);
    }
  }, []);

  const handleVideoChange = useCallback((videoData: { video?: string | null }) => {
    setNewVideo(videoData.video || null);
    // setDeleteVideo removed - not defined in state
  }, []);

  const handleOpenPicker = useCallback(() => {
    setIsPickerOpen(true);
  }, []);

  const handleClosePicker = useCallback(() => {
    setIsPickerOpen(false);
  }, []);

  const handleLocationSelect = useCallback((location: LocationCoordinates) => {
    setSelectedLocation(location);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const priceFloat = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(priceFloat)) {
      alert("Please enter a valid price.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await apiCall({
        method: 'POST',
        url: '/api/provider/cards/create',
        body: {
          newTitle: title,
          newBody: body,
          newPrice: priceFloat,
          newLocation: selectedLocation,
          newCategoryIds: selectedPath,
          newOptions: selectedOptions,
          new_images: newImages,
          newCover: newImages[0] || null,
          new_video: newVideo,
          storagePrefix: cardStoragePrefix
        },
      });

      if (response.status !== 200) {
        ConsoleLogger.error('Error creating card:', (response as any).error);
        toast.error((response as any).error || 'Failed to create card');
        setIsProcessing(false);
        return;
      }

      toast.success(translations.cardCreated);
      // Navigate to edit page if needed
      // router.push(`/provider/cards/edit/${response.data.card.id}`);

      // Navigate to cards list page after successful creation
      router.push('/provider/cards');
    } catch (error) {
      ConsoleLogger.error('Error creating card:', error);
      toast.error('Failed to create card');
      setIsProcessing(false);
    }
  }, [title, body, price, selectedLocation, selectedPath, selectedOptions, newImages, newVideo, cardStoragePrefix, translations.cardCreated, router]);

  // Processing Tile Component
  const ProcessingTile = () => (
    <div className="w-full flex items-center justify-center min-h-[400px]">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Processing...</h3>
        <p className="text-gray-600 text-center">Creating your card, please wait</p>
      </div>
    </div>
  );

  return (
    <section className='max-w-7xl m-auto flex flex-wrap bg-white relative'>
      <div className='w-full lg:w-2/3 flex flex-wrap items-start justify-start p-4 relative'>
        {isProcessing ? (
          <ProcessingTile />
        ) : (
          <>
            <form onSubmit={handleSubmit} className="w-full mx-auto p-4 rounded">
              <ProviderCategorySelectorWidget onCategoryChange={handleCategoryChange} />
              <div className="mt-4 mb-2">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mt-4 mb-2">{translations.title}</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={translations.title}
                  className="border border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="body" className="block text-gray-700 text-sm font-bold mt-4 mb-2">{translations.description}</label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={translations.description}
                  className="border border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-gray-700 text-sm font-bold mt-4 mb-2">{translations.price}</label>
                <input
                  type="text"
                  id="price"
                  value={price.toString()}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder={translations.price}
                  className="border border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {filters.length > 0 && (
                <ProviderOptionsSelectorWidget
                  category_filters={filters}
                  filters={filters}
                  onOptionsChange={handleOptionsChange}
                />
              )}
              <div className="flex my-4 items-center">
                <input
                  id="termsCheckbox"
                  name="termsCheckbox"
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="h-6 w-6 text-app-bright-purple border border-gray-200-gray-300 rounded focus:ring-brand"
                />
                <label htmlFor="termsCheckbox" className="ml-2 block text-lg text-gray-900">
                  <span className='text-sm'>{translations.basicRules}</span>
                  {translations.accept}
                  <Link href="/docs/rules" className="text-app-bright-purple hover:text-app-bright-purple mx-5">
                    {translations.rules}
                  </Link>
                </label>
              </div>
            </form>
            <div className='w-full flex flex-wrap items-start justify-start p-4 relative'>
              <ProviderImagesEditWidget
                cardStoragePrefix={cardStoragePrefix}
                onImagesChange={handleImagesChange}
                existingImages={newImages}
              />
              <ProviderVideoEditWidget
                cardStoragePrefix={cardStoragePrefix}
                onVideoChange={handleVideoChange}
                existingVideo={newVideo}
              />
            </div>
            <button
              type="button"
              className='my-4 w-full bg-gray-900 hover:bg-app-bright-purple text-white border border-gray-200-slate-900 border-gray-200-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              onClick={handleOpenPicker}
            >
              {translations.openLocationPicker}
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isProcessing
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-app-bright-purple text-white hover:bg-opacity-90'
                }`}
              onClick={handleSubmit}
            >
              {isProcessing ? 'Processing...' : translations.save}
            </button>
          </>
        )}
        <ProviderLocationPickerWidget
          isOpen={isPickerOpen}
          onClose={handleClosePicker}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </section>
  );
}
