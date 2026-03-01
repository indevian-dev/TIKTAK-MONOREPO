import { cache } from 'react';
import { PublicSingleBlogWidget } from '@/app/[locale]/(public)/blogs/(widgets)/PublicSingleBlog.widget';
import { fetchBlogBySlug } from '@/lib/integrations/Cms.Sanity.read';

interface BlogPageParams {
  slug: string;
  locale: string;
}

const getBlogData = cache(async (slug: string) => {
  try {
    return await fetchBlogBySlug(slug);
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: { params: Promise<BlogPageParams> }) {
  const { slug } = await params;
  const blog = await getBlogData(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: blog.title || 'Blog Post',
    description: blog.title || 'Read our blog post',
    openGraph: {
      title: blog.title || 'Blog Post',
      description: blog.title || 'Read our blog post',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title || 'Blog Post',
      description: blog.title || 'Read our blog post',
    },
  };
}

const PublicBlogPage = async () => {
  return <PublicSingleBlogWidget />;
};

export default PublicBlogPage;

