import Head
  from 'next/head';
import { PublicMapWidget }
  from '@/app/[locale]/(public)/map/(widgets)/PublicMap.widget';

const PublicMapPage = () => {
  return (
    <>
      <Head>
        <title>Interactive Map with Cards</title>
        <meta name="description" content="Explore cards on an interactive map with advanced filtering and search capabilities" />
      </Head>
      <PublicMapWidget />
    </>
  );
};

export default PublicMapPage;
