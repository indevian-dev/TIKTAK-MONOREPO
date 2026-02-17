"use client";

import {
  useState,
  useEffect
} from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { apiCallForSpaHelper } from '@/lib/helpers/apiCallForSpaHelper';
import Image from 'next/image';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
// API response type for public single blog data
interface PublicBlogApiResponse {
  id: number;
  cover?: string;
  title?: { content: string };
  content?: { content: string };
  [key: string]: unknown;
}

interface PublicSingleBlogWidgetProps {
  blog?: PublicBlogApiResponse;
}

export function PublicSingleBlogWidget({ blog: initialBlog }: PublicSingleBlogWidgetProps) {
  const [blog, setBlog] = useState<PublicBlogApiResponse | undefined>(initialBlog);
  const [content, setContent] = useState(initialBlog?.content?.content || "");
  const locale = useLocale();
  const params = useParams();

  // Extract blog ID from URL slug if no blog prop provided
  const slug = (params?.slug as string | undefined) || "";
  const parts = slug ? slug.split("-") : [];
  const blog_id = parts.length > 0 ? parseInt(parts[parts.length - 1] || "0", 10) : 0;

  useEffect(() => {
    // If no blog data was passed as prop, fetch it
    if (!initialBlog && blog_id && !isNaN(blog_id)) {
      async function fetchBlog() {
        try {
          const response = await apiCallForSpaHelper({
            url: `/api/blogs/${blog_id}`,
            method: 'GET',
          });

          if (response.status === 200) {
            setBlog(response.data.blog);
            setContent(response.data.blog.content?.content || "");
          }
        } catch (error) {
          const err = error as Error;
          ConsoleLogger.error('Error fetching blog:', err.message);
        }
      }
      fetchBlog();
    } else if (initialBlog) {
      setBlog(initialBlog);
      setContent(initialBlog.content?.content || "");
    }
  }, [locale, blog_id, initialBlog]);

  return (
    <section className='w-full flex flex-wrap justify-center'>
      <div className="w-1/2  flex flex-wrap justify-center max-w-3xl my-20 text-white shadow-md rounded-md">
        <div className=' relative w-full  p-20'>
          <Image className='' style={{ objectFit: 'cover' }} src={blog?.cover ? `${Bun.env.NEXT_PUBLIC_BLOG_COVER_URL_PREFIX + '/' + blog?.id + '/' + blog.cover}` : '/pg.webp'} fill alt={blog?.title?.content ? blog.title?.content : 'Blog title'} />
        </div>
        <h1 className="text-black w-full text-start  p-5 text-xl font-bold mb-4">{blog?.title?.content}</h1>

        <div className='w-full text-black p-5' dangerouslySetInnerHTML={{ __html: content }}>
        </div>
      </div>
    </section>


  );
}