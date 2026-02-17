import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { ProviderConversationsListWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/conversations/(widgets)/ProviderConversationsListWidget';

export default withPageAuth(
  async function ProviderConversationsListPage({ authData }) {
    return <ProviderConversationsListWidget />;
  },
  { pagePath: '/provider/conversations', inlineHandlers: true }
);
