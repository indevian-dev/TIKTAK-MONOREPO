'use client'

import { useState }
  from 'react';
import { ProviderMenuWidget }
  from '@/app/[locale]/(tenants)/provider/nav/ProviderMenuWidget';
import { ProviderHeaderWidget }
  from '@/app/[locale]/(tenants)/provider/nav/ProviderHeaderWidget';

/**
 * Provider Layout
 * Auth is handled by individual pages using withPageAuth
 */
export function ProviderClientLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <ProviderHeaderWidget 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
      />
      <main className="max-w-7xl mx-auto text-black grid grid-cols-5 justify-start items-start gap-4 mb-4">
        <nav className="col-span-5 md:col-span-1 rounded relative">
          <ProviderMenuWidget 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen}
          />
        </nav>
        <div className="col-span-5 md:col-span-4 rounded">
          {children}
        </div>
      </main>
    </>
  );
}

