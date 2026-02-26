import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { ProviderConversationsListWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/conversations/(widgets)/ProviderConversationsList.widget';

export default withPageAuth(
  async function ProviderConversationsListPage({ authData }) {
    return <ProviderConversationsListWidget />;
  },
  { path: '/provider/conversations', inlineHandlers: true }
);
