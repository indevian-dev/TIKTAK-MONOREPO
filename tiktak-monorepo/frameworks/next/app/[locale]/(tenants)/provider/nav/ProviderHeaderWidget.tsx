'use client'

import React
    from 'react';
import { Link }
    from '@/i18n/routing';
// import { ProviderLangSwitcherWidget } from '@/app/[locale]/provider/ui/ProviderLangSwitcherWidget';
import { ProviderRunningStrokeWidget }
    from '@/app/[locale]/(tenants)/provider/ui/ProviderRunningStrokeWidget';
import Image
    from 'next/image';
import { ProviderNotificationBadgeTile }
    from '@/app/[locale]/(tenants)/provider/notifications/(tiles)/ProviderNotificationBadgeTile';


export function ProviderHeaderWidget({ isMenuOpen, setIsMenuOpen }: {
    isMenuOpen: boolean;
    setIsMenuOpen: (value: boolean) => void;
}) {

    return (
        <>
            <header className="sticky top-0 bg-brandPrimaryDarkBg rounded-b mb-4 z-10">
                <nav className="z-20 text-dark relative bg-brandPrimaryDarkBg max-w-7xl mx-auto flex items-center px-4 py-5">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 md:hidden">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-brand">
                            <rect y={`${isMenuOpen ? '10' : '4'
                                }`} width="24" height="4" rx="4" ry="4" className={`fill-brand origin-center transition-transform ${isMenuOpen ? 'transform rotate-45 ' : ''
                                    }`}></rect>
                            <rect y={`${isMenuOpen ? '10' : '18'
                                }`} width="24" height="4" rx="4" ry="4" className={`fill-brand origin-center transition-transform ${isMenuOpen ? 'transform -rotate-45 ' : ''
                                    }`}></rect>
                        </svg>
                    </button>
                    <div className="w-full flex justify-between items-center">
                        <Link href="/" className='grid grid-cols-1 items-center'>
                            <Image src={"/logo-w.svg"} alt="Logo" width="120" height="60" />
                            <span className='text-white font-bold text-sm'>Provider</span>
                        </Link>
                        <div className='w-full hidden md:flex justify-center items-center px-4'>
                            <ProviderRunningStrokeWidget />
                        </div>
                        <ProviderNotificationBadgeTile />
                        <div className='flex text-white'>
                            {/* <ProviderLangSwitcherWidget /> */}
                        </div>
                    </div>
                </nav>
            </header >
        </>
    );
}
