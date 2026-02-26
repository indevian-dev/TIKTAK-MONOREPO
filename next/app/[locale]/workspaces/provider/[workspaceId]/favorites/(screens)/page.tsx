import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { ProviderFavoriteCardsListWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/favorites/(widgets)/ProviderFavoriteCardsList.widget';

export default withPageAuth(
  async function ProviderFavoritesListPage({ authData }) {
    return (
      <div>
        <ProviderFavoriteCardsListWidget />
      </div>
    );
  },
  { path: '/provider/favorites', inlineHandlers: true }
);
