'use client';

import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';
import { BlockPrimitive } from '@/app/primitives/Block.primitive';

interface GlobalFavoritesLimitsModalWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    maxFavorites: number;
}

const GlobalFavoritesLimitsModalWidget = ({ isOpen, onClose, maxFavorites }: GlobalFavoritesLimitsModalWidgetProps) => {
    const { t } = loadClientSideCoLocatedTranslations('GlobalFavoritesLimitsModalWidget');

    if (!isOpen) return null;

    return (
        <BlockPrimitive variant="modal">
            <BlockPrimitive variant="default">
                <div className="flex items-center mb-4">
                    <div className="shrink-0">
                        <svg className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                            {t('favorites_limit_reached')}
                        </h3>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600">
                        {t('favorites_limit_message', { limit: maxFavorites })}
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        {t('close')}
                    </button>
                </div>
            </BlockPrimitive>
        </BlockPrimitive>
    );
};

export default GlobalFavoritesLimitsModalWidget;
