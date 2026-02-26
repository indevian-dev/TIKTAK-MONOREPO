import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import ProviderMyAccountWidget
  from '@/app/[locale]/workspaces/provider/[workspaceId]/accounts/(widgets)/ProviderMyAccount.widget';

export default withPageAuth(
  async function ProviderMyAccountPage({ }) {
    return <ProviderMyAccountWidget />;
  },
  { path: '/provider/accounts/me', inlineHandlers: true }
);
