"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from 'react';

type PageType = 'default' | 'card' | 'category' | 'store';

export interface NavData {
  title?: string;
  breadcrumbs?: any[]; // Replace 'any' with specific breadcrumb type if available
  [key: string]: any;
}

interface HeaderNavState {
  pageType: PageType;
  navData: NavData | null;
}

interface PublicHeaderNavContextType {
  pageType: PageType;
  navData: NavData | null;
  setHeaderNav: (params: { pageType: PageType; navData?: NavData | null }) => void;
  resetHeaderNav: () => void;
}

const PublicHeaderNavContext = createContext<PublicHeaderNavContextType | null>(null);

/**
 * Header Navigation Context Provider
 * Allows pages to set custom navigation content in the header
 * 
 * pageType: 'default' | 'card' | 'category' | 'store'
 * navData: object with page-specific data (title, breadcrumbs, etc.)
 */
interface PublicHeaderNavProviderProps {
  children: ReactNode;
}

export function PublicHeaderNavProvider({ children }: PublicHeaderNavProviderProps) {
  const [headerNav, setHeaderNavState] = useState<HeaderNavState>({
    pageType: 'default',
    navData: null
  });

  const setHeaderNav = useCallback(({ pageType, navData }: { pageType: PageType; navData?: NavData | null }) => {
    setHeaderNavState({
      pageType: pageType || 'default',
      navData: navData || null
    });
  }, []);

  const resetHeaderNav = useCallback(() => {
    setHeaderNavState({
      pageType: 'default',
      navData: null
    });
  }, []);

  const value = {
    pageType: headerNav.pageType,
    navData: headerNav.navData,
    setHeaderNav,
    resetHeaderNav
  };

  return (
    <PublicHeaderNavContext.Provider value={value}>
      {children}
    </PublicHeaderNavContext.Provider>
  );
}

export function usePublicHeaderNavContext() {
  const context = useContext(PublicHeaderNavContext);
  if (!context) {
    throw new Error(
      'usePublicHeaderNavContext must be used within PublicHeaderNavProvider'
    );
  }
  return context;
}
