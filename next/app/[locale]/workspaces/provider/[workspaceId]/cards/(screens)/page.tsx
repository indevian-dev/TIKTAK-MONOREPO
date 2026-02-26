import { withPageAuth } from "@/lib/middleware/Interceptor.View.middleware";
import { ProviderCardsPageWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderCardsPage.widget';

export default withPageAuth(
  async function ProviderCardsPage() {
    return <ProviderCardsPageWidget />;
  },
  { path: '/provider/cards', inlineHandlers: true }
);
