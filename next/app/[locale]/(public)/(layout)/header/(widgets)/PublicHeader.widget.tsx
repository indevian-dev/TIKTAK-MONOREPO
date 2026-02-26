'use client'

import { ConsoleLogger } from '@/lib/logging/Console.logger';

import {
  useState,
  useEffect
} from 'react';
import { usePathname }
  from 'next/navigation';
import { PublicHeaderCategoriesMenuWidget }
  from '@/app/[locale]/(public)/categories/(widgets)/PublicHeaderCategoriesMenu.widget';
import { PublicAltHeaderWidget }
  from '@/app/[locale]/(public)/(layout)/header/(widgets)/PublicAltHeader.widget';
import { usePublicHeaderNavContext }
  from '@/app/[locale]/(public)/(context)/PublicHeaderNavContext';
import { PublicHeaderNavDefault }
  from '@/app/[locale]/(public)/(layout)/header/(widgets)/PublicHeaderNavDefault';
import { PublicHeaderNavCard }
  from '@/app/[locale]/(public)/(layout)/header/(widgets)/PublicHeaderNavCard';
import { PublicHeaderNavCategory }
  from '@/app/[locale]/(public)/(layout)/header/(widgets)/PublicHeaderNavCategory';
import { PublicHeaderNavStore }
  from '@/app/[locale]/(public)/(layout)/header/(widgets)/PublicHeaderNavStore';
import { Link }
  from '@/i18n/routing';
import Image
  from 'next/image';

export function PublicHeaderWidget() {
  const pathname = usePathname();
  const { pageType, navData } = usePublicHeaderNavContext();
  const [headerVisible, setHeaderVisible] = useState(false);
  const [catalogueVisible, setCatalogueVisible] = useState(false);

  // Check if we're on a page that has CardsWithFilters (categories, stores, catalog)

  const isCataloguePage = pathname.includes('/catalogue') ? true : false;

  const toggleCatalogue = () => {
    setHeaderVisible(false);
    setCatalogueVisible(!catalogueVisible);
  };

  useEffect(() => {
    // Disable/Enable main site scrolling when the menu is open/closed
    if (headerVisible || catalogueVisible) {
      document.body.style.overflow = 'disable';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [headerVisible, catalogueVisible]);

  // Render the appropriate nav based on pageType
  const renderNav = () => {
    switch (pageType) {
      case 'card':
        return <PublicHeaderNavCard navData={navData || {}} />;
      case 'category':
        return <PublicHeaderNavCategory navData={navData || {}} isCataloguePage={isCataloguePage} />;
      case 'store':
        return <PublicHeaderNavStore navData={navData || {}} isCataloguePage={isCataloguePage} />;
      default:
        return (
          <PublicHeaderNavDefault
            catalogueVisible={catalogueVisible}
            toggleCatalogue={toggleCatalogue}
          />
        );
    }
  };

  ConsoleLogger.log('isCataloguePage', isCataloguePage);
  ConsoleLogger.log('pageType', pageType);

  return (
    <>
      <header className="z-100 sticky top-0 bg-white w-full shadow-2xl shadow-dark/10">
        <PublicAltHeaderWidget />
        <nav className="z-4 text-gray-900 relative m-auto max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center justify-between w-full gap-2">
            <Link href="/" className=' flex items-center gap-2 bg-gray-900 sm:bg-transparent rounded p-2'>
              <div className="hidden sm:block">
                <Image src={"/logo.svg"} alt="Logo" width="140" height="60" />
              </div>
              <div className="block sm:hidden">
                <Image src={"/logominired.svg"} alt="Logo" width="35" height="35" />
              </div>
            </Link>
            <div className="flex justify-end items-center gap-2 sm:gap-3 lg:gap-4 w-full">
              {renderNav()}
            </div>
          </div>
          <div className={`overflow-y-scroll overflow-x-hidden transform ${catalogueVisible ? 'fixed' : 'hidden'} transition duration-500 ease-in-out right-0 left-0 text-gray-900 h-screen bg-white z-0`}>
            <ul className="pt-4 pb-40 text-gray-900">
              <li className={`text-left w-full`}>
                <PublicHeaderCategoriesMenuWidget
                  onMenuClose={toggleCatalogue}
                />
              </li>
            </ul>
          </div>
        </nav>
      </header >
    </>
  );
}
