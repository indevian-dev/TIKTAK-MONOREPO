"use client";

import {
    useEffect,
    useState
} from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { apiCall } from '@/lib/utils/Http.FetchApiSPA.util';
import Image from 'next/image';

import { ConsoleLogger } from '@/lib/logging/Console.logger';
// API response type for public blogs list data
interface PublicBlogsListApiResponse {
    id: number;
    slug: string;
    cover?: string;
    title?: { content: string };
    [key: string]: unknown;
}

export function PublicBlogsListWidget() {
    const [blogsList, setBlogsList] = useState<PublicBlogsListApiResponse[]>([]);
    const locale = useLocale();

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await apiCall({
                    url: '/api/blogs',
                    method: 'GET',
                });

                if (response.status === 200) {
                    setBlogsList(response.data.blogs);
                }

            } catch (error) {
                ConsoleLogger.log(error);
            }
        }

        fetchBlogs();
    }, [locale]);

    return (
        <section className="bg-white text-sm text-black grid grid-cols-12 py-20 justify-start items">
            {blogsList.map((blog) => (
                <Link href={'/blogs/' + blog.slug + '-' + blog.id} className='p-5 col-span-6 w-full'>
                    <div key={blog.id} className="  w-full w-full:md  grid grid-cols-12">
                        <div className="relative flex col-span-12 flex-col w-full p-20 justify-center items-start px-6 tracking-wide">
                            <Image className='rounded-2xl' style={{ objectFit: 'cover' }} src={blog?.cover ? `${Bun.env.NEXT_PUBLIC_BLOG_COVER_URL_PREFIX + '/' + blog?.id + '/' + blog.cover}` : '/pg.webp'} fill alt={blog?.title?.content ? blog.title?.content : 'Blog title'} />
                        </div>
                        <div className="flex col-span-12 flex-col w-full justify-center items-start py-6 tracking-wide">
                            <p>{blog.title?.content}</p>
                        </div>
                    </div>
                </Link>

            ))}
        </section>
    )
}
