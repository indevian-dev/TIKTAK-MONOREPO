import Head from 'next/head';
import { PublicBlogsListWidget }
  from '@/app/[locale]/(public)/blogs/(widgets)/PublicBlogsList.widget';

const PublicBlogsListPage = () => {
  return (
    <>
      <Head>
        <title>Blogs - Latest Articles</title>
        <meta name="description" content="Read our latest blog posts and articles" />
      </Head>
      <PublicBlogsListWidget />
    </>
  );
};

export default PublicBlogsListPage;
