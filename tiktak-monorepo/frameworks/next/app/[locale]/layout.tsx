import 'react-toastify/dist/ReactToastify.css';
import { NextIntlClientProvider }
    from 'next-intl';
import { GlobalToastProvider }
    from '@/app/GlobalToastProvider';
import { GlobalCategoryProvider }
    from '@/app/[locale]/(global)/(context)/GlobalCategoryContext';
import { GlobalAuthProfileProvider }
    from '@/app/[locale]/(global)/(context)/GlobalAuthProfileContext';
import { GlobalFavoriteCardsProvider }
    from '@/app/[locale]/(global)/(context)/GlobalFavoriteCardsContext';
import { GlobalTwoFactorAuthProvider }
    from '@/app/[locale]/(global)/(context)/GlobalTwoFactorAuthContext';
import { GlobalTwoFactorAuthModalWidget }
    from '@/app/[locale]/(global)/(widgets)/GlobalTwoFactorAuthModalWidget';

interface LocaleLayoutProps {
  children: React.ReactNode;
}

export default async function LocaleLayout({ children }: LocaleLayoutProps) {

    return (
        <NextIntlClientProvider>
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
        </NextIntlClientProvider>
    );
}