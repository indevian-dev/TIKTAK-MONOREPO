import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import { ProviderConversationWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/conversations/(widgets)/ProviderConversation.widget';

export default withPageAuth(
  async function ProviderConversationPage({ params }: any) {
    const { id } = await params;
    return <ProviderConversationWidget conversationId={id} />;
  },
  { path: '/provider/conversations/:id', inlineHandlers: true }
);
