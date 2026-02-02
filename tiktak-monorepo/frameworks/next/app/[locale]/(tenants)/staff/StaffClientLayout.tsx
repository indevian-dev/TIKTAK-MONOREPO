'use client'

import { useState }
  from 'react';
import { StaffMenuWidget }
  from '@/app/[locale]/(tenants)/staff/(layout)/header/(widgets)/StaffMenuWidget';
import { StaffHeaderWidget }
  from '@/app/[locale]/(tenants)/staff/(layout)/header/(widgets)/StaffHeaderWidget';
import type { AuthData }
  from '@/types';

/**
 * Staff Layout
 * Auth is handled by individual pages using withPageAuth
 */
export function StaffClientLayout({ 
  children,
  authData
}: { 
  children: React.ReactNode;
  authData?: AuthData | null;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Extract permissions from account object
  const permissions = (authData?.account as any)?.permissions;
  const widgetAuthData = permissions && Array.isArray(permissions)
    ? { permissions: permissions as string[] }
    : undefined;

  return (
    <>
      <StaffHeaderWidget 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
        authData={widgetAuthData}
      />
      <main className="max-w-7xl mx-auto px-4 text-black grid grid-cols-5 justify-start items-start gap-4 mb-4 mt-4">
        <nav className="col-span-5 md:col-span-1 rounded relative">
          <StaffMenuWidget 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen}
            authData={widgetAuthData}
          />
        </nav>
        <div className="col-span-5 md:col-span-4 rounded">
          {children}
        </div>
      </main>
    </>
  );
}
