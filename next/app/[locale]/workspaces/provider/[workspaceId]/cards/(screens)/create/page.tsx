import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { ProviderAddCardWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderAddCard.widget';

export default withPageAuth(
  async function ProviderAddCardPage({ }) {
    return <ProviderAddCardWidget />;
  },
  { path: '/provider/cards/create', inlineHandlers: true }
);
