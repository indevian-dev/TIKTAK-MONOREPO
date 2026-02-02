"use client";

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';

import {
    useState,
    useEffect
} from 'react';
import { useLocale }
    from 'next-intl';
import Image
    from 'next/image';
import { apiFetchHelper }
    from '@/lib/helpers/apiCallForSpaHelper';
import { toast }
    from 'react-toastify';

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
                const response = await apiFetchHelper({
                    method: 'GET',
                    url: '/api/staff/pages',
                    body: {},
                    params: {
                        type: 'FAQ'
                    }
                });

                if (response.status !== 200) {
                    toast.error(response.data.error);
                    return;
                }
                setFaq(response.data.page);
            } catch (error) {
                toast.error('Error fetching faq');
                ConsoleLogger.error(error);
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
                                alt={faq.title || 'Rules title'}
                                layout='fill'
                                objectFit='cover'
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
