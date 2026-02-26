import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import ProviderEditCardWidget
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderEditCard.widget';

export default withPageAuth(
  async function ProviderEditCardPage({ params }: any) {
    const { id } = await params;
    return <ProviderEditCardWidget cardId={id} />;
  },
  { path: '/provider/cards/edit/:id', inlineHandlers: true }
);
