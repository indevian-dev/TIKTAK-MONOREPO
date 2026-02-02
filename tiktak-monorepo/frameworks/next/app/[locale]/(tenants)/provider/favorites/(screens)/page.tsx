import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { ProviderFavoriteCardsListWidget }
    from '@/app/[locale]/(tenants)/provider/favorites/(widgets)/ProviderFavoriteCardsListWidget';

export default withPageAuth(
  async function ProviderFavoritesListPage({ authData }) {
    return (
        <div>
            <ProviderFavoriteCardsListWidget />
        </div>
    );
  },
  { pagePath: '/provider/favorites', inlineHandlers: true }
);
