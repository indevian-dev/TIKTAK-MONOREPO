"use client";

import { useState, useEffect } from 'react';
import Editor from '@/app/[locale]/workspaces/staff/[workspaceId]/ui/editor';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { toast } from 'react-toastify';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
const LOCALES = [
    { code: 'en', label: 'English' },
    { code: 'az', label: 'Azərbaycan' },
    { code: 'ru', label: 'Русский' }
] as const;

type LocaleCode = 'en' | 'az' | 'ru';

interface PageContent {
    content: string;
}

interface StaffPageEditWidgetProps {
    pageType: string;
    title: string;
}

export function StaffPageEditWidget({ pageType, title }: StaffPageEditWidgetProps) {
    const [pages, setPages] = useState<Record<LocaleCode, PageContent>>({
        en: { content: '' },
        az: { content: '' },
        ru: { content: '' }
    });
    const [showAllEditors, setShowAllEditors] = useState(false);
    const [selectedLocale, setSelectedLocale] = useState<LocaleCode>('en');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPagesContent = async () => {
            try {
                // Fetch pages for all locales
                const response = await apiCall({
                    method: 'GET',
                    url: '/api/staff/pages',
                    body: {},
                    params: {
                        type: pageType,
                    }
                });
                if (response.status !== 200) {
                    toast.error((response as any).error || 'Failed to load pages');
                    return;
                }

                // Transform API response to match expected structure
                const pageData = response.data.page;

                setPages({
                    en: { content: pageData.content_en || '' },
                    az: { content: pageData.content_az || '' },
                    ru: { content: pageData.content_ru || '' }
                });
            } catch (error) {
                toast.error('Error loading pages');
                ConsoleLogger.error(error);
            }
        };
        fetchPagesContent();
    }, [pageType]);

    const handleContentChange = async (locale: LocaleCode, content: string) => {
        setPages(prev => ({
            ...prev,
            [locale]: { content }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await apiCall({
                method: 'PUT',
                url: '/api/staff/pages/update',
                body: {
                    type: pageType,
                    content_en: pages.en?.content || '',
                    content_az: pages.az?.content || '',
                    content_ru: pages.ru?.content || ''
                }
            });

            if (response.status === 200) {
                toast.success('Page content updated successfully!');
            } else {
                toast.error((response as any).error || 'Failed to update page content');
            }
        } catch (error) {
            ConsoleLogger.error('Error saving page:', error);
            toast.error('Error saving page content');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between my-4 px-4">
                <h1 className="text-3xl font-bold">
                    {title}
                </h1>

                {/* Toggle Switch */}
                <div className="flex items-center gap-4">
                    {!showAllEditors && (
                        <select
                            value={selectedLocale}
                            onChange={(e) => setSelectedLocale(e.target.value as LocaleCode)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {LOCALES.map(locale => (
                                <option key={locale.code} value={locale.code}>
                                    {locale.label}
                                </option>
                            ))}
                        </select>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">
                            Show all editors
                        </span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={showAllEditors}
                                onChange={(e) => setShowAllEditors(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 transition-colors"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </div>
                    </label>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                <span>Save All</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Editors */}
            <div className="px-4">
                {showAllEditors ? (
                    // Show all editors
                    <div className="space-y-8">
                        {LOCALES.map(locale => (
                            <div key={locale.code} className="border border-gray-200 rounded-lg p-4">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {locale.code.toUpperCase()}
                                    </span>
                                    {locale.label}
                                </h2>
                                <Editor
                                    key={`editor-${locale.code}-${pages[locale.code] ? 'loaded' : 'loading'}`}
                                    initialContent={pages[locale.code]?.content || ''}
                                    onChange={(content: string) => handleContentChange(locale.code, content)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    // Show single editor
                    <div className="border border-gray-200 rounded-lg p-4">
                        <Editor
                            key={`editor-${selectedLocale}-${pages[selectedLocale] ? 'loaded' : 'loading'}`}
                            initialContent={pages[selectedLocale]?.content || ''}
                            onChange={(content: string) => handleContentChange(selectedLocale, content)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
