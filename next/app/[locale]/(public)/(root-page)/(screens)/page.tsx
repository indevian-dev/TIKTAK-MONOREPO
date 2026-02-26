
import { PublicRootScreenAddsWidget }
    from '@/app/[locale]/(public)/(root-page)/(widgets)/PublicRootScreenAdds.widget';
import { PublicRootScreenCardsWidget }
    from '@/app/[locale]/(public)/(root-page)/(widgets)/PublicRootScreenCards.widget';
import { PublicRootScreenStoresWidget }
    from '@/app/[locale]/(public)/(root-page)/(widgets)/PublicRootScreenStores.widget';
import { PublicCategoriesFastNavigationWidget }
    from '@/app/[locale]/(public)/categories/(widgets)/PublicCategoriesFastNavigation.widget';

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