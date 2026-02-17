import { cache } from 'react';
import { PublicSingleBlogWidget } from '@/app/[locale]/(public)/blogs/(widgets)/PublicSingleBlogWidget';
import { fetch as apiCallForSsrHelper } from '@/lib/helpers/apiCallForSsrHelper';
import { notFound } from 'next/navigation';

import { ConsoleLogger } from '@/lib/logging/ConsoleLogger';
interface BlogPageParams {
  slug: string;
  locale: string;
}

const getBlogData = cache(async (slug: string) => {
  const regex = /-(\d+)$/;
  const match = slug.match(regex);

  if (!match || !match[1]) {
    ConsoleLogger.error('Invalid blog slug format:', slug);
    return null;
  }

  const id = parseInt(match[1]);

  try {
    const response = await apiCallForSsrHelper({
      url: `/api/blogs/${id}`,
    });

    return response.data.blog;
  } catch (error) {
    const err = error as Error;
    ConsoleLogger.error('Error fetching blog:', err.message);
    return null;
  }
});

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<BlogPageParams> }) {
  const { slug } = await params;

  const blog = await getBlogData(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: blog.title?.content || 'Blog Post',
    description: blog.meta_description?.content || blog.title?.content || 'Read our blog post',
    openGraph: {
      title: blog.title?.content || 'Blog Post',
      description: blog.meta_description?.content || blog.title?.content || 'Read our blog post',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title?.content || 'Blog Post',
      description: blog.meta_description?.content || blog.title?.content || 'Read our blog post',
    }
  };
}

const PublicBlogPage = async ({ params }: { params: Promise<BlogPageParams> }) => {
  const { slug, locale } = await params;

  if (!locale) {
    notFound();
  }

  ConsoleLogger.log("SLUG", slug);
  ConsoleLogger.log("LOCALE", locale);

  const blog = await getBlogData(slug);

  if (!blog) {
    notFound();
  }

  return <PublicSingleBlogWidget blog={blog} />;
};

export default PublicBlogPage;
