import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import ProviderStoreEditWidget
  from '@/app/[locale]/workspaces/provider/[workspaceId]/stores/(widgets)/ProviderStoreEdit.widget';

export default withPageAuth(
  async function ProviderStoreEditPage({ authData }) {
    return <ProviderStoreEditWidget />;
  },
  { path: '/provider/stores/edit/:id', inlineHandlers: true }
);
