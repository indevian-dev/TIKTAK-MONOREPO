'use client';

import { ReactNode } from 'react';
import { usePathname }
  from 'next/navigation';
import { PublicHeaderWidget }
  from '@/app/[locale]/(tenants)/(guest)/(layout)/header/(widgets)/PublicHeaderWidget';
import { PublicFooterWidget }
  from '@/app/[locale]/(tenants)/(guest)/(layout)/footer/(widgets)/PublicFooterWidget';
import { PublicSearchProvider }
  from '@/app/[locale]/(tenants)/(guest)/(context)/PublicSearchContext';
import { PublicHeaderNavProvider }
  from '@/app/[locale]/(tenants)/(guest)/(context)/PublicHeaderNavContext';

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMapPage = pathname?.includes('/map');

  return (
    <>
      <PublicHeaderNavProvider>
        <PublicSearchProvider initialProps={{
          includeFacets: true,
          pagination: 50,
          useAdvancedFilters: true,
          mode: isMapPage ? 'map' : 'simple'
        }}>
          <PublicHeaderWidget />
          <main className='text-dark'>
            {children}
          </main>
          <PublicFooterWidget />
        </PublicSearchProvider>
      </PublicHeaderNavProvider>
    </>
  )
}
