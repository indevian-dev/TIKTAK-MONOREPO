"use client";

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { ConsoleLogger } from '@/lib/logging/Console.logger';

interface PageData {
    cover?: string;
    title?: string;
    content?: string;
}

export function PublicFaqWidget() {
    const [faq, setFaq] = useState<PageData>({});
    const locale = useLocale();

    useEffect(() => {
        async function fetchFaq() {
            try {
                const response = await apiCall({
                    method: 'GET',
                    url: '/api/docs/faq',
                    params: {},
                    body: {}
                });

                if (response.status !== 200) {
                    ConsoleLogger.error('Error fetching FAQ page:', response.data?.error);
                    return;
                }

                setFaq(response.data?.content?.data || response.data?.content || {});
            } catch (error) {
                ConsoleLogger.error('Error fetching FAQ page:', error);
            }
        }

        fetchFaq();
    }, [locale]);

    return (
        <section className='w-full flex flex-wrap justify-center'>
            <div className='container max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8'>
                <div className="w-full flex flex-wrap justify-center text-white shadow-md rounded-md">
                    {faq.cover && (
                        <div className='relative w-full p-20'>
                            <Image
                                src={faq.cover}
                                alt={faq.title || 'FAQ title'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <article className='w-full text-black p-5 prose-sm' dangerouslySetInnerHTML={{ __html: faq.content || '' }}>
                    </article>
                </div>
            </div>
        </section>
    );
}
