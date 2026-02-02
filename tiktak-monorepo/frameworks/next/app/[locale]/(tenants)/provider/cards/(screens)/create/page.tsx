import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { ProviderAddCardWidget }
  from '@/app/[locale]/(tenants)/provider/cards/(widgets)/ProviderAddCardWidget';

export default withPageAuth(
  async function ProviderAddCardPage({ }) {
  return <ProviderAddCardWidget />;
  },
  { pagePath: '/provider/cards/create', inlineHandlers: true }
);
