
import { PublicRootScreenAddsWidget }
    from '@/app/[locale]/(public)/(root-page)/(widgets)/PublicRootScreenAddsWidget';
import { PublicRootScreenCardsWidget }
    from '@/app/[locale]/(public)/(root-page)/(widgets)/PublicRootScreenCardsWidget';
import { PublicRootScreenStoresWidget }
    from '@/app/[locale]/(public)/(root-page)/(widgets)/PublicRootScreenStoresWidget';
import { PublicCategoriesFastNavigationWidget }
    from '@/app/[locale]/(public)/categories/(widgets)/PublicCategoriesFastNavigationWidget';

export const metadata = {
    title: 'Tiktak'
};

const PublicRootScreen = async () => {
    return (
        <>
            <PublicCategoriesFastNavigationWidget />
            <PublicRootScreenStoresWidget />
            <PublicRootScreenAddsWidget />
            <PublicRootScreenCardsWidget />
        </>
    );
};

export default PublicRootScreen;