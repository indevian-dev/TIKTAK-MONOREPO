import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import ProviderMyAccountWidget
  from '@/app/[locale]/workspaces/provider/[workspaceId]/accounts/(widgets)/ProviderMyAccountWidget';

export default withPageAuth(
  async function ProviderMyAccountPage({ }) {
    return <ProviderMyAccountWidget />;
  },
  { pagePath: '/provider/accounts/me', inlineHandlers: true }
);
