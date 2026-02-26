import 'react-toastify/dist/ReactToastify.css';
import '../globals.css';
import { NextIntlClientProvider }
    from 'next-intl';
import { getMessages } from 'next-intl/server';
import { GlobalToastProvider }
    from '@/app/[locale]/(global)/(porviders)/GlobalToastProvider';
import { GlobalCategoryProvider }
    from '@/app/[locale]/(global)/(context)/GlobalCategoryContext';
import { GlobalAuthProfileProvider }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { GlobalFavoriteCardsProvider }
    from '@/app/[locale]/(global)/(context)/GlobalFavoriteCardsContext';
import { GlobalTwoFactorAuthProvider }
    from '@/app/[locale]/(global)/(context)/GlobalTwoFactorAuthContext';
import { GlobalThemeProvider }
    from '@/app/[locale]/(global)/(context)/GlobalThemeProvider';
import { GlobalTwoFactorAuthModalWidget }
    from '@/app/[locale]/(global)/(widgets)/GlobalTwoFactorAuthModal.widget';

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string;[key: string]: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const resolvedParams = await params;
    const messages = await getMessages({ locale: resolvedParams.locale });

    return (
        <html lang={resolvedParams.locale} suppressHydrationWarning>
            <body className='bg-neutral-100 dark:bg-app-dark-purple text-app-dark-purple dark:text-white overflow-y-scroll min-h-screen  '>
                <NextIntlClientProvider>
                    <GlobalThemeProvider>
                        <GlobalCategoryProvider>
                            <GlobalAuthProfileProvider>
                                <GlobalFavoriteCardsProvider>
                                    <GlobalTwoFactorAuthProvider>
                                        <div className='absolute top-0 left-0 w-0 h-0'>
                                            <GlobalToastProvider />
                                        </div>
                                        <GlobalTwoFactorAuthModalWidget />
                                        {children}
                                    </GlobalTwoFactorAuthProvider>
                                </GlobalFavoriteCardsProvider>
                            </GlobalAuthProfileProvider>
                        </GlobalCategoryProvider>
                    </GlobalThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html >
    );
}