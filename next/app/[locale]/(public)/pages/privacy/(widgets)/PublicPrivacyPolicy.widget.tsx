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
    meta_description?: string;
}

export function PublicPrivacyPolicyWidget() {
    const [privacy, setPrivacy] = useState<PageData>({});
    const locale = useLocale();

    useEffect(() => {
        async function fetchPrivacy() {
            try {
                const response = await apiCall({
                    method: 'GET',
                    url: '/api/docs/privacy',
                    params: {},
                    body: {}
                });

                if (response.status !== 200) {
                    ConsoleLogger.error('Error fetching privacy policy:', response.data?.error);
                    return;
                }

                setPrivacy(response.data?.content?.data || response.data?.content || {});
            } catch (error) {
                ConsoleLogger.error('Error fetching privacy policy:', error);
            }
        }

        fetchPrivacy();
    }, [locale]);

    return (
        <section className='w-full flex flex-wrap justify-center'>
            <div className='container max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8'>
                <div className="w-full flex flex-wrap justify-center text-white shadow-md rounded-md">
                    {privacy.cover && (
                        <div className='relative w-full p-20'>
                            <Image
                                src={privacy.cover}
                                alt={privacy.title || 'Privacy Policy'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <article className='w-full text-black p-5 prose-sm' dangerouslySetInnerHTML={{ __html: privacy.content || '' }}>
                    </article>
                </div>
            </div>
        </section>
    );
}
