import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import ProviderStoreEditWidget
  from '@/app/[locale]/workspaces/provider/[workspaceId]/stores/(widgets)/ProviderStoreEditWidget';

export default withPageAuth(
  async function ProviderStoreEditPage({ authData }) {
    return <ProviderStoreEditWidget />;
  },
  { pagePath: '/provider/stores/edit/:id', inlineHandlers: true }
);
