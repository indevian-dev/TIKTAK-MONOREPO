import { withPageAuth }
  from "@/lib/auth/AccessValidatorForPages";
import { StaffPageEditWidget }
  from '@/app/[locale]/workspaces/staff/[workspaceId]/pages/(widgets)/StaffPageEditWidget';

export default withPageAuth(
  async function StaffTermsEditPage({ }) {
    return <StaffPageEditWidget pageType="TERMS" title="Terms" />;
  },
  { pagePath: '/staff/pages/terms', inlineHandlers: true }
);
