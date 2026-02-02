import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import ProviderEditCardWidget
  from '@/app/[locale]/(tenants)/provider/cards/(widgets)/ProviderEditCardWidget';

export default withPageAuth(
  async function ProviderEditCardPage({ params }) {
    const { id } = await params;
    return <ProviderEditCardWidget cardId={id} />;
  },
  { pagePath: '/provider/cards/edit/:id', inlineHandlers: true }
);
