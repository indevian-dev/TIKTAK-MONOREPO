
import { PublicRootScreenAddsWidget }
    from '@/app/[locale]/(tenants)/(guest)/(root-page)/(widgets)/PublicRootScreenAddsWidget';
import { PublicRootScreenCardsWidget }
    from '@/app/[locale]/(tenants)/(guest)/(root-page)/(widgets)/PublicRootScreenCardsWidget';
import { PublicRootScreenStoresWidget }
    from '@/app/[locale]/(tenants)/(guest)/(root-page)/(widgets)/PublicRootScreenStoresWidget';
import { PublicCategoriesFastNavigationWidget }
    from '@/app/[locale]/(tenants)/(guest)/categories/(widgets)/PublicCategoriesFastNavigationWidget';

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