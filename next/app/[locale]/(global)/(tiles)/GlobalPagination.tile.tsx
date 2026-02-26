'use client';

import { loadClientSideCoLocatedTranslations }
    from '@/i18n/i18nClientSide';

interface GlobalPaginationTileProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function GlobalPaginationTile({ currentPage, totalPages, onPageChange }: GlobalPaginationTileProps) {
    const { t } = loadClientSideCoLocatedTranslations('GlobalPaginationTile');
    
    return (
        <div>
            <div>
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    {t('previous')}
                </button>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    {t('next')}
                </button>
            </div>
            <div>
                <span>{t('page_of', { current: currentPage, total: totalPages })}</span>
            </div>
        </div>
    );
}