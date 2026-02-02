import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import PageTitleWidget
    from "@/app/[locale]/(tenants)/provider/ui/ProviderPageTitleWidget";

export default withPageAuth(
  async function ProviderRootPage({ }) {
    return (
        <div>
            <PageTitleWidget pageTitle="Tiktak Provider" />
        </div>
    );
  },
  { pagePath: '/provider', inlineHandlers: true }
);
