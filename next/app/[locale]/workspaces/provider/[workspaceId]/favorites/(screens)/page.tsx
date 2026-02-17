import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { ProviderFavoriteCardsListWidget }
    from '@/app/[locale]/workspaces/provider/[workspaceId]/favorites/(widgets)/ProviderFavoriteCardsListWidget';

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
