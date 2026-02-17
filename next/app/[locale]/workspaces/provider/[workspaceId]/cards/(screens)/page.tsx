import { withPageAuth } from "@/lib/auth/AccessValidatorForPages";
import { ProviderCardsPageWidget }
  from '@/app/[locale]/workspaces/provider/[workspaceId]/cards/(widgets)/ProviderCardsPageWidget';

export default withPageAuth(
  async function ProviderCardsPage() {
    return <ProviderCardsPageWidget />;
  },
  { pagePath: '/provider/cards', inlineHandlers: true }
);
