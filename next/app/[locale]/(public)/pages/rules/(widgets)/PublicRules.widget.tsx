"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import { ConsoleLogger } from '@/lib/logging/Console.logger';

interface PageData {
    cover?: string;
    title?: string;
    content?: string;
}

export function PublicRulesWidget() {
    const [rules, setRules] = useState<PageData>({});

    useEffect(() => {
        async function fetchRules() {
            try {
                const response = await apiCall({
                    method: 'GET',
                    url: '/api/docs/rules',
                    params: {},
                    body: {}
                });

                if (response.status !== 200) {
                    ConsoleLogger.error('Error fetching rules page:', response.data?.error);
                    return;
                }

                setRules(response.data?.content?.data || response.data?.content || {});
            } catch (error) {
                ConsoleLogger.error('Error fetching rules page:', error);
            }
        }

        fetchRules();
    }, []);

    return (
        <section className='w-full flex flex-wrap justify-center'>
            <div className='container max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8'>
                <div className="w-full flex flex-wrap justify-center text-white shadow-md rounded-md">
                    {rules.cover && (
                        <div className='relative w-full p-20'>
                            <Image
                                src={rules.cover}
                                alt={rules.title || 'Rules title'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <article className='w-full text-black p-5 prose-sm' dangerouslySetInnerHTML={{ __html: rules.content || '' }}>
                    </article>
                </div>
            </div>
        </section>
    );
}
