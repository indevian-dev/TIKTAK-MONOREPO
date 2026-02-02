// pages/catalog/index.js
import Head
  from 'next/head';
import { PublicCardsWithFiltersWidget }
  from '@/app/[locale]/(tenants)/(guest)/cards/(widgets)/PublicCardsWithFiltersWidget';
import { PublicSearchProvider }
  from '@/app/[locale]/(tenants)/(guest)/(context)/PublicSearchContext';

const PublicCatalogPage = () => {
  return (
    <>
      <Head>
        <title>Catalog - Browse All Cards</title>
      </Head>
      <PublicSearchProvider initialProps={{
        includeFacets: true,
        pagination: 50,
        useAdvancedFilters: true
      }}>
        <PublicCardsWithFiltersWidget />
      </PublicSearchProvider>
    </>
  );
};

export default PublicCatalogPage;