"use client";

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { fetchPage } from '@/lib/integrations/Cms.Sanity.read';
import { ConsoleLogger } from '@/lib/logging/Console.logger';

interface PageData {
    cover?: string;
    title?: string;
    content?: string;
}

export function PublicPricingWidget() {
    const [pricing, setPricing] = useState<PageData>({});
    const locale = useLocale();

    useEffect(() => {
        fetchPage('PRICING', locale)
            .then(data => { if (data) setPricing(data); })
            .catch(err => ConsoleLogger.error('Error fetching pricing page:', err));
    }, [locale]);

    return (
        <div className='w-full flex flex-wrap justify-center'>
            <div className='container max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8'>
                <div className="w-full flex flex-wrap justify-center shadow-md rounded-md">
                    <article className='w-full text-black dark:text-white p-5 prose-sm' dangerouslySetInnerHTML={{ __html: pricing.content || '' }}>
                    </article>
                </div>
            </div>
        </div>
    );
}
