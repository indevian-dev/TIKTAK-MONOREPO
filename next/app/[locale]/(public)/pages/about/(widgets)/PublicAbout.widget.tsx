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

export function PublicAboutWidget() {
    const [about, setAbout] = useState<PageData>({});
    const locale = useLocale();

    useEffect(() => {
        async function fetchAbout() {
            try {
                const response = await apiCall({
                    method: 'GET',
                    url: '/api/docs/about',
                    params: {},
                    body: {}
                });

                if (response.status !== 200) {
                    ConsoleLogger.error('Error fetching about page:', response.data?.error);
                    return;
                }

                setAbout(response.data?.content?.data || response.data?.content || {});
            } catch (error) {
                ConsoleLogger.error('Error fetching about page:', error);
            }
        }

        fetchAbout();
    }, [locale]);

    return (
        <section className='w-full flex flex-wrap justify-center'>
            <div className='container max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8'>
                <div className="w-full flex flex-wrap justify-center text-white shadow-md rounded-md">
                    {about.cover && (
                        <div className='relative w-full p-20'>
                            <Image
                                src={about.cover}
                                alt={about.title || 'About title'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <article className='w-full text-black p-5 prose-sm' dangerouslySetInnerHTML={{ __html: about.content || '' }}>
                    </article>
                </div>
            </div>
        </section>
    );
}
