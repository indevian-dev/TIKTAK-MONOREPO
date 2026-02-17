import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import ProviderStoreCreateApplicationWidget
  from '@/app/[locale]/workspaces/provider/[workspaceId]/stores/(widgets)/ProviderStoreCreateApplicationWidget';

export default withPageAuth(
  async function ProviderStoreCreateApplicationPage({ authData }) {
    return <ProviderStoreCreateApplicationWidget />;
  },
  { pagePath: '/provider/stores/applications/create', inlineHandlers: true }
);
