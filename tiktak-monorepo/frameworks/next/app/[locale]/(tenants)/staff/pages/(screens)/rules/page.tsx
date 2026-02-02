import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffPageEditWidget }
  from '@/app/[locale]/(tenants)/staff/pages/(widgets)/StaffPageEditWidget';

export default withPageAuth(
    async function StaffRulesEditPage({ }) {
    return <StaffPageEditWidget pageType="RULES" title="Rules" />;
  },
  { pagePath: '/staff/pages/rules', inlineHandlers: true }
);
