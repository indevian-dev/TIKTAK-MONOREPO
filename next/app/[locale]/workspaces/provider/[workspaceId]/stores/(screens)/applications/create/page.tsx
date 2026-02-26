import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import ProviderStoreCreateApplicationWidget
  from '@/app/[locale]/workspaces/provider/[workspaceId]/stores/(widgets)/ProviderStoreCreateApplication.widget';

export default withPageAuth(
  async function ProviderStoreCreateApplicationPage({ authData }) {
    return <ProviderStoreCreateApplicationWidget />;
  },
  { path: '/provider/stores/applications/create', inlineHandlers: true }
);
