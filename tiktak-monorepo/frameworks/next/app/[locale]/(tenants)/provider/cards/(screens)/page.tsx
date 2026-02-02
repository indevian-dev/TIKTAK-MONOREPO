import { withPageAuth } from "@/lib/auth/AccessValidatorForPages";
import { ProviderCardsPageWidget }
  from '@/app/[locale]/(tenants)/provider/cards/(widgets)/ProviderCardsPageWidget';

export default withPageAuth(
  async function ProviderCardsPage() {
    return <ProviderCardsPageWidget />;
  },
  { pagePath: '/provider/cards', inlineHandlers: true }
);
