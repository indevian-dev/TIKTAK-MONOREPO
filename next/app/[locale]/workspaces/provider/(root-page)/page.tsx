import { withPageAuth }
  from "@/lib/middleware/Interceptor.View.middleware";
import PageTitleWidget
  from "@/app/[locale]/workspaces/provider/[workspaceId]/ui/ProviderPageTitle.widget";

export default withPageAuth(
  async function ProviderRootPage({ }) {
    return (
      <div>
        <PageTitleWidget pageTitle="Tiktak Provider" />
      </div>
    );
  },
  { path: '/provider', inlineHandlers: true }
);
