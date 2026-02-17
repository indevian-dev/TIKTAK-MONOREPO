import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { ProviderConversationWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/conversations/(widgets)/ProviderConversationWidget';

export default withPageAuth(
  async function ProviderConversationPage({ authData, params }) {
    const { id } = await params;
    return <ProviderConversationWidget conversationId={id} />;
  },
  { pagePath: '/provider/conversations/:id', inlineHandlers: true }
);
