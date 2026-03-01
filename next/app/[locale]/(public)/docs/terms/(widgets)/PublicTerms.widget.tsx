"use client";

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { fetchPage } from '@/lib/integrations/Cms.Sanity.read';
import { ConsoleLogger } from '@/lib/logging/Console.logger';
import { SectionPrimitive } from '@/app/primitives/Section.primitive';

interface PageData {
    cover?: string;
    title?: string;
    content?: string;
}

export function PublicTermsWidget() {
    const [terms, setTerms] = useState<PageData>({});
    const locale = useLocale();

    useEffect(() => {
        fetchPage('TERMS', locale)
            .then(data => { if (data) setTerms(data); })
            .catch(err => ConsoleLogger.error('Error fetching terms page:', err));
    }, [locale]);

    return (
        <SectionPrimitive variant='centered'>
            <div className='container max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8'>
                <div className="w-full flex flex-wrap justify-center shadow-md rounded-md">
                    <article className='w-full text-black dark:text-white p-5 prose-sm' dangerouslySetInnerHTML={{ __html: terms.content || '' }}>
                    </article>
                </div>
            </div>
        </SectionPrimitive>
    );
}
