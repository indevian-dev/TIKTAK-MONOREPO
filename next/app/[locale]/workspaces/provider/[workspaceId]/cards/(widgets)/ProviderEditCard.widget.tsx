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
import { ProviderOptionsSelectorWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderOptionsSelector.widget';
import { loadClientSideCoLocatedTranslations }
  from '@/i18n/i18nClientSide';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { ProviderImagesEditWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderImagesEdit.widget';
import { ProviderVideoEditWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderVideoEdit.widget';
import { useRouter }
  from 'next/navigation';
import { useGlobalCategoryContext }
  from '@/app/[locale]/(global)/(context)/GlobalCategoryContext';


import { lt } from '@/lib/utils/Localized.util';

interface LocationData {
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
  [key: string]: unknown;
}

interface FormData {
  title: string;
  body: string;
  price: number;
  location: LocationData | null;
  options: FilterOption[];
  images: string[];
  isActive: boolean;
}

interface ProviderEditCardWidgetProps {
  cardId: string | number;
}

export default function ProviderEditCardWidget({ cardId }: ProviderEditCardWidgetProps) {
  const { t } = loadClientSideCoLocatedTranslations('ProviderEditCardWidget');
  const router = useRouter();
  const { categoriesHierarchy, loading: categoriesLoading } = useGlobalCategoryContext();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<FilterOption[]>([]);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [filters, setFilters] = useState<CategoryFilter[]>([]);
  const [cardStoragePrefix, setCardStoragePrefix] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [newVideo, setNewVideo] = useState<string | null>(null);
  const [deleteVideo, setDeleteVideo] = useState(false);

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalFormData, setOriginalFormData] = useState<FormData | null>(null);

  const translations = useMemo(() => ({
    title: t("title"),
    description: t("description"),
    price: t("price"),
    options: t("options"),
    accept: t("accept"),
    rules: t("rules"),
    openLocationPicker: t("open_location_picker"),
    save: t("save"),
    cardUpdated: t("card_updated"),
    loading: t("loading"),
    cancel: t("cancel"),
    status: t("status"),
    active: t("active"),
    inactive: t("inactive"),
    editCard: t("edit_card"),
    category: t("category"),
    unsavedChanges: t("unsaved_changes"),
    confirmLeave: t("confirm_leave"),
    stayOnPage: t("stay_on_page")
  }), [t]);

  // Check for unsaved changes
  const checkForUnsavedChanges = useCallback(() => {
    if (!originalFormData) return false;

    const currentData = {
      title: title.trim(),
      body: body.trim(),
      price: price,
      location: selectedLocation,
      options: selectedOptions,
      images: newImages,
      isActive
    };

    const hasChanges = (
      currentData.title !== originalFormData.title ||
      currentData.body !== originalFormData.body ||
      currentData.price !== originalFormData.price ||
      JSON.stringify(currentData.location) !== JSON.stringify(originalFormData.location) ||
      JSON.stringify(currentData.options) !== JSON.stringify(originalFormData.options) ||
      JSON.stringify(currentData.images) !== JSON.stringify(originalFormData.images) ||
      currentData.isActive !== originalFormData.isActive ||
      imagesToDelete.length > 0 ||
      deleteVideo
    );

    setHasUnsavedChanges(hasChanges);
    return hasChanges;
  }, [title, body, price, selectedLocation, selectedOptions, newImages, newVideo, isActive, imagesToDelete, deleteVideo, originalFormData]);

  // Check for changes whenever form data changes
  useEffect(() => {
    checkForUnsavedChanges();
  }, [checkForUnsavedChanges]);

  // Browser beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = translations.unsavedChanges;
        return translations.unsavedChanges;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, translations.unsavedChanges]);

  // Custom navigation handler with confirmation
  const handleNavigation = useCallback((callback: () => void) => {
    if (hasUnsavedChanges) {
      if (window.confirm(translations.unsavedChanges)) {
        setHasUnsavedChanges(false); // Reset to avoid double confirmation
        callback();
      }
    } else {
      callback();
    }
  }, [hasUnsavedChanges, translations.unsavedChanges]);

  // Function to find category by ID from the hierarchy
  const findCategoryById = useCallback((categories: any[], id: string | number): any => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    for (const category of categories) {
      if (category.id === numId) return category;
      if (category.children && category.children.length > 0) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Map category IDs to category names using context
  const getCategoryNames = useCallback((categoryIds: string[]) => {
    if (!categoryIds || categoryIds.length === 0 || categoriesHierarchy.length === 0) {
      return [];
    }

    return categoryIds
      .map((id: string) => {
        const category = findCategoryById(categoriesHierarchy, id);
        return category ? category.title : `Category ${id}`;
      })
      .filter(Boolean); // Remove any null/undefined results
  }, [categoriesHierarchy, findCategoryById]);

  // Update category names when categories or selected path changes
  useEffect(() => {
    if (!categoriesLoading && categoriesHierarchy.length > 0 && selectedPath.length > 0) {
      const names = getCategoryNames(selectedPath);
      setCategoryNames(names);
    }
  }, [selectedPath, categoriesHierarchy, categoriesLoading, getCategoryNames]);

  // Fetch card data on component mount
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        const response = await apiCall({
          method: 'GET',
          url: `/api/provider/cards/${cardId}`,
          body: {},
          params: {}
        });

        if (response.status !== 200) {
          throw new Error((response as any).error || 'Failed to fetch card data');
        }

        const card = response.data.card;
        const publishedData = response.data.published_data;
        ConsoleLogger.log('Fetched card data:', card);
        ConsoleLogger.log('Published data:', publishedData);

        // Set form data from the current card (not published)
        setTitle(card.title || '');
        setBody(card.body || '');
        setPrice(card.price || 0);
        setSelectedLocation(card.location || null);
        setSelectedOptions(card.options || []);
        setNewImages(card.images || []);
        setCoverImage(card.cover || null);
        setNewVideo(card.video || null);
        // Note: is_active is only in cards_published, so we check published_data
        setIsActive(publishedData?.is_active !== undefined ? publishedData.is_active : true);

        // Set card metadata
        setCardStoragePrefix(card.storage_prefix || '');
        setSelectedPath(card.categories || []);

        // Store original data for comparison
        const originalData = {
          title: card.title || '',
          body: card.body || '',
          price: card.price || 0,
          location: card.location || null,
          options: card.options || [],
          images: card.images || [],
          video: card.video || null,
          isActive: publishedData?.is_active !== undefined ? publishedData.is_active : true
        };
        setOriginalFormData(originalData);

      } catch (error) {
        ConsoleLogger.error('Error fetching card data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load card data';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (cardId) {
      fetchCardData();
    }
  }, [cardId]);

  // Fetch filters when category changes
  const categoryPathString = useMemo(() => selectedPath.join(','), [selectedPath]);

  useEffect(() => {
    if (!categoryPathString) {
      setFilters([]);
      return;
    }

    const fetchOptionsGroupForCategory = async () => {
      try {
        const response = await apiCall({
          method: 'GET',
          url: `/api/categories/options-groups`,
          body: {},
          params: {
            category_id: categoryPathString
          },
        });

        if (response.status !== 200) {
          throw new Error((response as any).error || 'Failed to fetch options group');
        }

        const filtersData = response.data.filters;
        setFilters(filtersData || []);
      } catch (error) {
        ConsoleLogger.error('Error fetching options group:', error);
        setFilters([]);
      }
    };

    fetchOptionsGroupForCategory();
  }, [categoryPathString]);

  const handleOptionsChange = useCallback((newOptions: FilterOption[]) => {
    setSelectedOptions(newOptions);
  }, []);

  const handleImagesChange = useCallback((imageData: { images: string[], deletedImages: string[] }) => {
    setNewImages(imageData.images);
    setImagesToDelete(imageData.deletedImages);
  }, []);

  const handleVideoChange = useCallback((videoData: { video?: string | null, deleteVideo?: boolean }) => {
    setNewVideo(videoData.video || null);
    setDeleteVideo(videoData.deleteVideo || false);
  }, []);

  const handleImagesPendingChanges = useCallback((_hasPendingChanges: boolean) => {
    // This will be handled by the main form change detection
  }, []);

  const handleLocationSelect = useCallback((location: LocationData) => {
    setSelectedLocation(location);
    setIsPickerOpen(false);
  }, []);

  const handleOpenPicker = useCallback(() => {
    setIsPickerOpen(true);
  }, []);

  const handleClosePicker = useCallback(() => {
    setIsPickerOpen(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const priceFloat = typeof price === 'number' ? price : parseFloat(String(price));
    if (isNaN(priceFloat)) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }

    try {
      const response = await apiCall({
        method: 'PUT',
        url: `/api/provider/cards/update/${cardId}`,
        body: {
          title: title.trim(),
          body: body.trim(),
          price: priceFloat,
          location: selectedLocation,
          options: selectedOptions,
          new_images: newImages,
          deleting_images: imagesToDelete, // Send deleted images list
          cover_image: coverImage,
          new_video: newVideo,
          delete_video: deleteVideo,
          is_active: isActive,
          storage_prefix: cardStoragePrefix
        },
      });

      if (response.status !== 200) {
        throw new Error((response as any).error || 'Failed to update card');
      }

      toast.success(translations.cardUpdated);

      // Reset unsaved changes
      setHasUnsavedChanges(false);
      setImagesToDelete([]);

      // Update original data
      const newOriginalData = {
        title: title.trim(),
        body: body.trim(),
        price: priceFloat,
        location: selectedLocation,
        options: selectedOptions,
        images: newImages,
        isActive
      };
      setOriginalFormData(newOriginalData);

      // Navigate to cards list page after successful update
      router.push('/provider/cards');

    } catch (error) {
      ConsoleLogger.error('Error updating card:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update card';
      toast.error(errorMessage);
    }
  }, [cardId, title, body, price, selectedLocation, selectedOptions, newImages, imagesToDelete, coverImage, isActive, cardStoragePrefix, translations.cardUpdated, router]);

  const handleCancel = useCallback(() => {
    handleNavigation(() => {
      router.push('/provider/cards');
    });
  }, [router, handleNavigation]);

  // Update the loading condition to include categories loading
  if (loading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">{translations.loading}</div>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen flex flex-wrap items-start justify-start p-4 bg-app-bright-purple/10">
      <div className='w-full lg:w-2/3 flex flex-wrap items-start justify-start p-4 relative'>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {translations.editCard}
            {hasUnsavedChanges && (
              <span className="ml-2 text-orange-600 text-sm">
                (Unsaved changes)
              </span>
            )}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{translations.status}:</span>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-2"
              />
              <span className={`font-semibold ${isActive ? 'text-emerald-500' : 'text-gray-500'}`}>
                {isActive ? translations.active : translations.inactive}
              </span>
            </label>
          </div>
        </div>

        <form className="w-full mx-auto p-4 rounded">
          {/* Category Display (Read-only) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{translations.category}</label>
            <div className="border border-gray-200 rounded w-full py-2 px-3 bg-gray-50 text-gray-700">
              {categoryNames.length > 0 ? (
                <span>{categoryNames.join(' → ')}</span>
              ) : (
                <span className="text-gray-500">No category assigned</span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">{translations.title}</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={translations.title}
              className="border border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">{translations.description}</label>
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
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              placeholder={translations.price}
              step="0.01"
              min="0"
              className="border border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {filters.length > 0 && (
            <div className='p-3 border border-gray-200 rounded-md mb-4'>
              <div className='mb-4'>
                <span className='text-lg font-bold'>{translations.options}</span>
                <ProviderOptionsSelectorWidget
                  category_filters={filters}
                  filters={filters}
                  onOptionsChange={handleOptionsChange}
                  initialOptions={selectedOptions}
                />
              </div>
            </div>
          )}
        </form>

        <div className='w-full flex flex-wrap items-start justify-start p-4 relative'>
          <ProviderImagesEditWidget
            cardStoragePrefix={cardStoragePrefix}
            onImagesChange={handleImagesChange}
            onPendingChanges={handleImagesPendingChanges}
            existingImages={newImages}
            cardId={cardId}
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

        <div className="flex space-x-4 w-full">
          <button
            type="submit"
            className="flex-1 bg-app-bright-purple hover:bg-app-bright-purple-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            {translations.save}
            {hasUnsavedChanges && (
              <span className="ml-2 text-xs opacity-75">●</span>
            )}
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCancel}
          >
            {translations.cancel}
          </button>
        </div>

        <ProviderLocationPickerWidget
          isOpen={isPickerOpen}
          onClose={handleClosePicker}
          onLocationSelect={handleLocationSelect}
        />
      </div>
    </section>
  );
} 